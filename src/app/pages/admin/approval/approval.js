angular.module('skybrand.admin.approval', [
  'ui.state',
  'skybrand.model',
  'skybrand.server',
  'skybrand.utilities',
  'skybrand.notifications',
  'skybrand.filedroppanel',
  'ng-context-menu'
])

.config(function config($stateProvider) {
  $stateProvider.state('approval', {
    url:  '/admin/assets/awaiting?category',
    views: {
      "main": {
        controller: 'ApprovalCtrl',
        templateUrl: 'pages/admin/approval/approval.tpl.html'
      }
    },
    resolve: {
      access: function(utilitiesService, $q) {

        var 
          deferred = $q.defer()
        ;
        
        //check permissions
        utilitiesService.assureAdmin(deferred);

        return deferred.promise;
      }
    },
    data: {
      pageTitle: 'Approval'
    }
  });
})

.controller('ApprovalCtrl', function ApprovalController($scope, $rootScope, $stateParams, modelService, serverService, notificationsService, $timeout, $filter, utilitiesService) {

  $scope.modelService = modelService;
  $scope.notifications = notificationsService;
  $scope.selectedAsset = 'null';
  $scope.stateParams = $stateParams;
  $scope.filters = {
    selected: {},
    available: modelService.filters.available
  };
  $scope.$rootScope = $rootScope;

  $scope.data = [];
  $scope.edit = {
    edit: false
  };
  $scope.assetsLeft = 0;

  $rootScope.lightbox.open({type: 'notifications.loading'});
  
  serverService.assets.getAwaiting({page: -1, category: $stateParams.category}).then(function(result) {
    $scope.selectedAsset = result.records[0];
    $scope.assetsLeft = result.records.length;
    (function autoExec(i) {
      if (result.records.length === 0) {
        return false;
      }
      if (i === result.records.length) {
        return false;
      }
      if (i === 0) {
        $scope.data.push(result.records[i]);
        autoExec(i + 1);
      } else {
        $timeout(function() {
          $scope.data.push(result.records[i]);
          autoExec(i + 1);
        }, 200);
      }
    })(0);
    $rootScope.lightbox.close();
  });

  $scope.date = function(date_str) {
    return $filter('date')(new Date(date_str * 1000), "dd/MM/yyyy");
  };

  $scope.$watch('selectedAsset', function(newVal, oldVal) {
    if (oldVal === newVal || typeof newVal === 'undefined' ) {
      return false;
    }
    //unselect everything
    utilitiesService.filters.reset();
    utilitiesService.filters.populateFiltersFromAsset(newVal, $scope.filters);
  });

  $scope.clearSiblings = function(collection, option) {
    $.each(collection, function(index, value) {
      if (option.value !== value.value) {
        value.selected = false;
      }
    });
  };

  $scope.countLeft = function() {
    var count = 0;
    angular.forEach($scope.data, function(value, key) {
      if (!value.done) {
        count += 1;
      }
    });
    return count;
  };

  $scope.select = function(asset) {
    $scope.selectedAsset = asset;
  };

  $scope.reject = function() {
    if ($scope.selectedAsset.data.asset_comment_approval.length === 0) {
      $scope.notify = true;
      $scope.notifyMessage = true;
      $timeout(function() {
        $scope.notify = false;
      }, 400);
      return false;
    }
    $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Rejecting asset'});
    serverService.assets.reject({
      id: $scope.selectedAsset.id,
      asset_comment_approval: $scope.selectedAsset.data.asset_comment_approval
    }).then(function(result) {

      $rootScope.lightbox.close().then(function(){

        $scope.selectedAsset.done = true;
        $scope.selectedAsset.rejected = true;

        var curIndex = $.inArray($scope.selectedAsset, $scope.data);
        $scope.selectedAsset = typeof $scope.data[curIndex + 1] === 'undefined' ? $scope.selectedAsset : $scope.data[curIndex + 1];
        $scope.assetsLeft -= 1;

        $('html, body').animate({
          scrollTop: $('body').offset().top
        }, 400);

        $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Asset rejected', autoclose: true});

      });

    });
  };

  $scope.archive = function(id) {
    $rootScope.lightbox.open({type: 'confirmation', message1: 'Are you sure you want to archive this asset?'}).then(function(result){
      if(result) {
        $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Archiving asset'});
        serverService.assets.archive({'id': id}).then(function(){
          $rootScope.lightbox.close().then(function(){
            $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Asset archived!', autoclose: true});
            $scope.filters.available.is_replacement = false;
          });
        });
      }
    });
  };

  $scope.approve = function() {
    var args = utilitiesService.filters.getSelected($scope.filters.available, '|');
    args.id = $scope.selectedAsset.id;
    args.title = $scope.selectedAsset.data.title;
    args.summary = $scope.selectedAsset.data.summary;
    args.comment = $scope.selectedAsset.data.comment;
    args.asset_comment_approval = $scope.selectedAsset.data.asset_comment_approval;
    
    $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Approving asset'});
    serverService.assets.update(args).then(function(result) {

      serverService.assets.approve({
        id: $scope.selectedAsset.id
      }).then(function(result) {

        $rootScope.lightbox.close().then(function(){
          $scope.selectedAsset.done = true;
          $scope.selectedAsset.done_message = 'Approved ';

          var curIndex = $.inArray($scope.selectedAsset, $scope.data);
          $scope.selectedAsset = typeof $scope.data[curIndex + 1] === 'undefined' ? $scope.selectedAsset : $scope.data[curIndex + 1];
          
          $('html, body').animate({
            scrollTop: $('body').offset().top
          }, 400);

          $rootScope.lightbox.open({type: 'notifications.success', message1: 'Asset approved!', autoclose: true});
          
          $rootScope.$broadcast('assets:approved');

        });

      });

    });
  };

})

;
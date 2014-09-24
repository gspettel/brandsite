angular.module('skybrand.admin.activity', [
  'ui.state',
  'skybrand.model',
  'skybrand.server',
  'skybrand.utilities', 
  'skybrand.notifications' 
])

.config(function config($stateProvider) {
  $stateProvider.state('activity', {
    url: '/admin/activity',
    views: {
      "main": {
        controller: 'ActivityCtrl',
        templateUrl: 'pages/admin/activity/activity.tpl.html'
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
      pageTitle: 'Activity'
    }
  });
})

.controller('ActivityCtrl', function ActivityController($scope, $rootScope, $location, utilitiesService, modelService, serverService, $timeout, $filter) {

  $scope.modelService = modelService;
  $scope.$rootScope = $rootScope;

  $scope.assetsAwaiting = {
    page: 1,
    completed: false,
    data: []
  };
  $scope.issuesAwaiting = {
    completed: false,
    data: []
  };
  $scope.brandHubActivities = {
    data: [],
    totalDays: null,
    totalBookings: 0,
    completed: false
  };
  $scope.assetsActivities = {
    page: 1,
    completed: false,
    data: []
  };

  serverService.assets.getAwaiting({
    page: -1
  }).then(function(response) {
    $scope.assetsAwaiting.completed = true;
    $scope.assetsAwaiting.data = response.records;

  });

  serverService.assets.reportsGet().then(function(response) {
    $scope.issuesAwaiting.completed = true;
    $scope.issuesAwaiting.data = response;
  });

  serverService.brandHub.getMonthlyBookings(Math.floor(new Date().getTime() / 1000)).then(function(response) {
    $scope.brandHubActivities.completed = true;
    $scope.brandHubActivities.data = response.result.records;
    $scope.brandHubActivities.totalBookings = response.result.total_records;
    $scope.brandHubActivities.totalDays = response.result.total_days;
  });

  serverService.assets.getActivity().then(function(response) {
    $scope.assetsActivities.completed = true;
    $scope.assetsActivities.data = response.records;

  });

  $scope.goto = function(dest) {
    if(dest === 'awaiting') {
      $location.path('/admin/assets/awaiting');
    } else {
      $location.path('/brandhub/view');      
    }
  };

  $scope.viewIssue = function(issue) {
    $rootScope.lightbox.open({type: 'assets.issue.view', data: issue});
  };

  $scope.moreAssetsActivities = function() {
    serverService.assets.getActivity({
      page: $scope.assetsActivities.page + 1
    }).then(function(response) {
      $scope.assetsActivities.completed = true;

      $scope.assetsActivities.page = response.page;

      (function autoExec(i) {
        if (response.records.length === 0 || i === response.records.length) {
          return false;
        }
        if (i === 0) {
          $scope.assetsActivities.data.push(response.records[i]);
          autoExec(i + 1);
        } else {
          $timeout(function() {
            $scope.assetsActivities.data.push(response.records[i]);
            autoExec(i + 1);
          }, 200);
        }
      })(0);

    });

  };

  $scope.date = function(date_str) {
    return $filter('date')(new Date(date_str * 1000), "dd/MM/yyyy");
  };

  $rootScope.$on('issue:closed', function(event, args){
    angular.forEach($scope.issuesAwaiting.data, function(item, index){
      if(item.id === args.id) {
        $scope.issuesAwaiting.data.splice(index, 1);
      }
    });
  });

})

;
angular.module('skybrand.brandhub.book', [
  'ui.state',
  'skybrand.model',
  'fidi.uploader',
  'skybrand.utilities',
  'skybrand.datepicker',
  'skybrand.filedroppanel'
])

.config(function config($stateProvider) {
  $stateProvider.state('brandhub-book', {
    url: '/brandhub/book',
    views: {
      "main": {
        controller: 'BrandhubBookCtrl',
        templateUrl: 'pages/brandhub/book/book.tpl.html'
      }
    },
    resolve: {
      access: function(utilitiesService, $q) {

        var 
          deferred = $q.defer()
        ;
        
        //check permissions
        utilitiesService.assurePermissions(['brandhub-book'], deferred);

        return deferred.promise;
      }
    },
    data: {
      pageTitle: 'Book BrandHub'
    }
  });
})

.directive('slotSelector', [

  function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, iElement, attrs, ngModel) {

        scope.selectTime = function(time) {
          var radios = iElement.find('input');
          radios.attr('disabled', '');
          $(radios[time - 1]).removeAttr('disabled');
          if (radios[time]) {
            $(radios[time]).removeAttr('disabled');
          }
          if (!$(radios[time - 1]).is(':checked') && typeof radios[time - 2] !== undefined) {
            $(radios[time - 2]).removeAttr('disabled');
            if (typeof radios[time] !== undefined) {
              $(radios[time]).attr('disabled', '');
            }
          }
          var unselected = true;
          angular.forEach(radios, function(value, index) {
            if ($(value).is(':checked')) {
              unselected = false;
            }
          });

          if (unselected) {
            radios.removeAttr('disabled', '');
          }

        };

        scope.clear = function() {
          $(iElement).find('input').removeAttr('disabled');
          scope.times = {};
        };

        scope.$on('brandhub:booked', function() {
          scope.clear();
        });

        scope.$watch(attrs.ngModel, function() {
          var valid = false;
          $.each(scope.times, function(i, val) {
            if (val === true) {
              valid = true;
              return false;
            }
          });
          ngModel.$setValidity('slotSelector', valid);
        }, true);

      }
    };
  }
])

.controller('BrandhubBookCtrl', function BrandhubBookController($scope, $rootScope, modelService, $location, utilitiesService, serverService, $q, uploaderService) {

  uploaderService.setConfig({
    'url': '/api/bookings/upload',
    'flash_swf_url': modelService.cms.config.urls.local_templates + modelService.cms.env + '/assets/others/Moxie.swf',
    'silverlight_xap_url': modelService.cms.config.urls.local_templates + modelService.cms.env + '/assets/others/Moxie.xap'
  });


  $scope.date = (new Date()).toString();
  $scope.dateInMarket = null;
  $scope.dateDeadline = null;
  $scope.times = {};
  $scope.files = [];
  $scope.modelService = modelService;
  $scope.utilitiesService = utilitiesService;
  
  $('html, body').scrollTop(0);

  $scope.book = function() {
    //determine the start time and end time
    var date = new Date($scope.date);
    var times = [];
    angular.forEach($scope.times, function(value, key) {
      if (value) {
        times.push(parseInt(key.split('_')[1], 10));
      }
    });
    
    times = times.sort();
    var starttime_minutes = times[0];
    date.setHours(14);
    date.setMinutes(starttime_minutes);
    date.setSeconds(0);
    $scope.starttime = date.getTime() / 1000;
    var endtime_minutes = times[times.length - 1];
    endtime_minutes = endtime_minutes + 15;
    date.setHours(14);
    date.setMinutes(endtime_minutes);
    date.setSeconds(0);
    $scope.endtime = date.getTime() / 1000;

    $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Adding booking'});

    serverService.brandHub.book({
      'first_name': $scope.first_name,
      'last_name': $scope.last_name,
      'campaign': $scope.campaign,
      'date_in_market': new Date($scope.dateInMarket).getTime() / 1000,
      'deadline': new Date($scope.dateDeadline).getTime() / 1000,
      'phone': $scope.phone,
      'description': $scope.description,
      'starttime': $scope.starttime,
      'endtime': $scope.endtime
    })
    .then(function(response) {

      var complete = function(){
        $rootScope.lightbox.close().then(function(){
          $rootScope.lightbox.open({type: 'notifications.success', message1: 'Booking successful!', autoclose: true}).then(function(){
            $location.path('/brandhub/book/completed/' + response.result.id ).search({'date':$scope.starttime * 1000});
          });
        });        
      };

      if(!$scope.files.length) {
        complete();
        return true;
      }

      $scope.bookId = response.result.id;

      //upload the files
      (function autoExec(i){
        $scope.$watch(function(){
          if(!$scope.files || !$scope.files[i]) {
            return false;
          }
          return $scope.files[i].percent;
        }, function(newVal, oldVal){
          if(newVal === oldVal) { return false; }
          $rootScope.lightbox.update({message1: 'Uploading file ' + $scope.files[i].name + ': ' + newVal + '%'});
        });

        uploaderService.upload($scope.files[i], {
          'id': $scope.bookId
        }).then(function() {
          $scope.files[i].done = true;
          if(i < $scope.files.length - 1) {
            autoExec(i + 1);
          } else {
            complete();
          }
        }, function(reason){
          $rootScope.lightbox.close().then(function(){
            $rootScope.lightbox.open({type: 'confirmation.error', message1: 'Error uploading file ' + $scope.files[i].name + '. <br/><p class="intro smaller">Server response: ' + reason.result + '</p>'});
          });
        });
      })(0);
      

    });
  };

  //get init data
  $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Checking availability'});
  
  //get available slots
  serverService.brandHub.getAvailableSlots((new Date($scope.date)).getTime() / 1000).then(function(response) {
    $scope.availableSlots = response.result;
    $rootScope.lightbox.close();
  });

  //get available slots
  $scope.$watch("date", function(newVal, oldVal) {
    if (newVal === oldVal) {
      return false;
    }

    $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Checking availability'});
    serverService.brandHub.getAvailableSlots(Math.floor((new Date($scope.date)).getTime() / 1000)).then(function(response) {
      $rootScope.lightbox.close();
      $scope.availableSlots = response.result;
      $scope.times.time_15 = false;
      $scope.times.time_30 = false;
      $scope.times.time_45 = false;
      $scope.times.time_00 = false;
    });
  });

})

;
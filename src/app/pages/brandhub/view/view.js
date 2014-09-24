angular.module('skybrand.brandhub.view', [
  'ui.state',
  'skybrand.model',
  'skybrand.filters',
  'skybrand.server',
  'skybrand.utilities',
  'skybrand.notifications' 
])

.config(function config($stateProvider) {
  $stateProvider.state('brandhub-view', {
    url: '/brandhub/view',
    views: {
      "main": {
        controller: 'BrandhubViewCtrl',
        templateUrl: 'pages/brandhub/view/view.tpl.html'
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
    data:{ pageTitle: 'View BrandHub' }
  });
})

.controller('BrandhubViewCtrl', function BrandhubViewController($scope, $rootScope, modelService, utilitiesService, notificationsService, serverService, $filter) {

  $scope.selectedDate = Math.floor((new Date()).getTime() / 1000);

  $scope.modelService = modelService;
  $scope.notifications = notificationsService;

  $scope.lightbox = $rootScope.lightbox;

  $scope.brandHubActivities = {
    data: [],
    totalDays: null,
    totalBookings: 0
  };

  var updateBookings = (function autoExec() {
    $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Loading bookings'});
    serverService.brandHub.getAllMonthlyBookings($scope.selectedDate).then(function(response) {
      $rootScope.lightbox.close();
      $scope.brandHubActivities.data = response.result.records;
      $scope.brandHubActivities.totalBookings = response.result.total_records;
      $scope.brandHubActivities.totalDays = response.result.total_days;
    });
    return autoExec;
  })();

  $scope.cancelSession = function(){
    
    $rootScope.lightbox.open({
      type: 'brandhub.view.cancel'
    })
    .then(function(date){
      if(!date) { return false; }
      $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Cancelling session'});
      serverService.brandHub.cancelSession(date / 1000).then(function(response) {
        $rootScope.lightbox.close().then(function(){
          $rootScope.lightbox.open({type: 'notifications.success', message1: 'Session cancelled', autoclose: true}).then(function(){
            updateBookings();
          });
        });
      });
    });
    
  };

  $scope.next = function() {
    var date = new Date($scope.selectedDate * 1000);
    date.setDate(15);
    $scope.selectedDate = Math.floor(date.setMonth(date.getMonth() + 1) / 1000);
    updateBookings();
  };

  $scope.prev = function() {
    var date = new Date($scope.selectedDate * 1000);
    date.setDate(15);
    $scope.selectedDate = Math.floor(date.setMonth(date.getMonth() - 1) / 1000);
    updateBookings();
  };

  $scope.deleteBooking = function(id) {
    $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Deleting booking'});
    serverService.brandHub.deleteBooking(id).then(function(){
      $rootScope.lightbox.close().then(function(response) {
        $rootScope.lightbox.open({type: 'notifications.success', message1: 'The booking has been deleted', autoclose: true}).then(function(){
          updateBookings();
        });
      });
    });
  };

  $scope.showBooking = function(booking){
    if(!booking) { return false; }
    $rootScope.lightbox.open({type: 'brandhub.view', data: booking});
  };

  $scope.date = function(date_str) {
    return $filter('date')(new Date(date_str), "dd/MM/yyyy");
  };

})

;
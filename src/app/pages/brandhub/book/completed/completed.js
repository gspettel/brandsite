angular.module('skybrand.brandhub.book.completed', [
  'ui.state',
  'skybrand.server'
])

.config(function config($stateProvider) {
  $stateProvider.state('brandhub-book-completed', {
    url: '/brandhub/book/completed/:id?date',
    views: {
      "main": {
        controller: 'BrandhubBookCompletedCtrl',
        templateUrl: 'pages/brandhub/book/completed/completed.tpl.html'
      }
    },
    data: {
      pageTitle: 'Book Brand Hub'
    }
  });
})

.controller('BrandhubBookCompletedCtrl', function BrandhubBookCompletedController($scope, $stateParams, serverService) {

  $scope.date = $stateParams.date;

  serverService.brandHub.notifyAdmins({id: $stateParams.id});

  $scope.addToCalendar = function() {

    window.location.href = '/api/bookings/calendar/' + $stateParams.id;
    
  };

})

;
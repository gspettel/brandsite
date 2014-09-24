
//this must be refactored because it's very unDRY

angular.module('skybrand.server', [
  'skybrand.cache'
])

.service('serverService', function($http, $q, cacheService) {

    //ASSETS
    //region
    this.assets = {
      add: function(args){

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/assets/add',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      checkTitle: function(args){

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/assets/check/title',
          params: args
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      get: function(args){

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/assets/get',
          params: args
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      update: function(args){

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/assets/update',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      getAwaiting: function(args){

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/assets/get/awaiting',
          params: args
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      getActivity: function(args){

        var params = $.extend({page: 1}, args);

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/logs/get/assets/activity',
          params: params
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      approve: function(args){

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/assets/approve',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      archive: function(args){

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/assets/archive',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      reject: function(args){

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/assets/reject',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      addThumb: function(args){

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/assets/thumb/upload',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      addDefaultThumb: function(args){

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/assets/thumb/set/default',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      notifyAdmins: function(args){

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/notify/assets/new/' + args.id
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      report: function(args){

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/assets/report/add',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      reportClose: function(args){

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/assets/report/close',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      reportsGet: function(){

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/assets/reports/get'
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      }

    };
    //endregion

    //FEEDBACK
    //region
    this.feedback = {

      add: function(args){

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/feedback/add',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      }

    };
    //endregion

    //TEAM
    //region
    this.team = {
      get: function(args){

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/team/get'
        }).
        success(function(data, status) {
          cacheService.put('team', data);
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      }
    };
    //endregion

    //NEWS
    //region
    this.news = {
      getCampaigns: function(args){

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/news/campaigns/get',
          params: args
        }).
        success(function(data, status) {
          if(args.page === 1) {
            cacheService.put(JSON.stringify(args), data);
          }
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      getWeekly: function(args){

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/news/get',
          params: args
        }).
        success(function(data, status) {
          cacheService.put('news.weekly', data);
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      }
    };
    //endregion

    //CONTENT
    //region
    this.content = {
      search: function(args){

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/search',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      }
    };
    //endregion

    //SETTINGS
    //region
    this.settings = {
      get: function(){

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/settings/get'
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      }
    };
    //endregion

    //USER
    //region
    this.user = {
      login: function(args) {

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/user/login',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },

      logout: function() {

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/user/logout',
          data: ''
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      
      get: function() {

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/user/get',
          data: ''
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      
      getNotifications: function(args) {

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/user/notifications/get',
          params: args
        }).
        success(function(data, status) {
          deferred.resolve(data.result);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      }

    };
    //endregion

    //BRAND HUB
    //region
    this.brandHub = {
      book: function(args) {

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/bookings/add',
          data: $.param(args),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },

      getAvailableSlots: function(date) {

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/bookings/slots/get/all-available',
          params: {'date': date}
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },

      getMonthlyBookings: function(date) {

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/bookings/get/monthly',
          params: {'date': date}
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      
      getAllMonthlyBookings: function(date) {

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/bookings/get/monthly/all',
          params: {'date': date}
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },

      deleteBooking: function(id) {

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/bookings/delete',
          data: $.param({
              'id': id
          })
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },

      cancelSession: function(date) {

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/bookings/sessions/cancel',
          data: $.param({
              'date': date
          })
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },

      getBooking: function(id) {

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/bookings/get',
          params: {'id': id}
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },

      notifyAdmins: function(args) {

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/notify/booking/'+args.id
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      }

    };
    //endregion

    //USERS
    //region
    this.users = {
      
      all: function(args) {

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/users/get/all',
          params: args
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },

      get: function(args) {

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/users/get',
          params: args
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },

      add: function(args) {

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/users/add',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },

      update: function(args) {

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/users/update',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },

      remove: function(args) {

        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: '/api/users/remove',
          data: $.param(args)
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      }

    };
    //endregion

    //ROLES
    //region
    this.roles = {
      
      get: function() {

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/roles/get'
        }).
        success(function(data, status) {
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      }

    };
    //endregion

    //OUR BRAND
    //region
    this.ourBrand = {
      
      getOurBrand: function() {

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/our-brand/get'
        }).
        success(function(data, status) {
          cacheService.put('ourBrand.ourBrand', data);
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      },
      
      getGuidelines: function() {

        var deferred = $q.defer();

        $http({
          method: 'GET',
          url: '/api/guidelines/get'
        }).
        success(function(data, status) {
          cacheService.put('ourBrand.guidelines', data);
          deferred.resolve(data);
        }).
        error(function(data, status) {
          deferred.reject(data);
        });

        return deferred.promise;

      }

    };

    //endregion

  }
)

;
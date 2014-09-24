angular.module( 'skybrand.guidelines', [
  'templates-app',
  'ui.state',
  'skybrand.model',
  'skybrand.utilities',
  'skybrand.repeatCompleted'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'guidelines', {
    url: '/our-brand/guidelines?'+
    'section',
    resolve: {
      data: function($rootScope, serverService, $stateParams, $q, $timeout, cacheService, modelService) {

        var 
          deferred = $q.defer(),
          data = null
        ;
        
        if( data = cacheService.get('ourBrand.guidelines')) {
          deferred.resolve(data.result.data);
        } else {
          
          if(typeof SkyBrandSite !== 'undefined') {
            $rootScope.lightbox.open({
              type: 'notifications.loading',
              message1: 'Loading page'
            });
            serverService.ourBrand.getGuidelines().then(function(response) {

              $rootScope.lightbox.close().then(function() {
                deferred.resolve(response.result.data);
              });

            });
          }

          //load page specific scripts
          $.getScript(modelService.cms.config.urls.templates + "partials/skybrand-animations/skybs.ob.modernizr.min.js")
            .done(function(script, textStatus) {
              $.getScript(modelService.cms.config.urls.templates + "partials/skybrand-animations/skybs.ob.libs.min.js")
                .done(function(script, textStatus) {
                  $.getScript(modelService.cms.config.urls.templates + "partials/skybrand-animations/skybs.ob.main.min.js")
                    .done(function(script, textStatus) {

                      $rootScope.lightbox.open({
                        type: 'notifications.loading',
                        message1: 'Loading page'
                      });
                      serverService.ourBrand.getGuidelines().then(function(response) {

                        $rootScope.lightbox.close().then(function() {
                          deferred.resolve(response.result.data);
                        });

                      });

                    });
                });
            });

        }

        return deferred.promise;
      },
      access: function(utilitiesService, $q) {

        var 
          deferred = $q.defer()
        ;
        
        //check permissions
        utilitiesService.assureLoggedIn(deferred);

        return deferred.promise;
      }
    },
    views: {
      "main": {
        controller: 'GuidelinesCtrl',
        templateUrl: 'pages/ourBrand/guidelines/guidelines.tpl.html'
      }
    },
    data:{ pageTitle: 'Guidelines' }
  });
})

.controller( 'GuidelinesCtrl', function GuidelinesController( $scope, data, modelService, utilitiesService ) { 
  $scope.modelService = modelService;
  $scope.utilitiesService = utilitiesService;
  $scope.data = data;
})

.directive('guidelines', function($timeout, $stateParams, modelService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      $('html, body').scrollTop(0);

      //fix issue with ng-repeat markup not available on time
      var i = 0;
      scope.$on("repeat:completed", function(){
        if(i++ === 7) {

          (function autoExec() {
              if(typeof SkyBrandSite === 'undefined' || typeof SkyBrandSite.OB === 'undefined' || typeof SkyBrandSite.OB.Main === 'undefined' || typeof SkyBrandSite.OB.Main.init === 'undefined') {
              setTimeout(autoExec, 300);
              return;
            }    
            SkyBrandSite.OB.Main.init($('#wrap-guidelines'), {
              stickyHeaderScroll: false, // pixel value at which the header should become sticky
              sideNavPreviewSecs: 2,
              scrollTo : $stateParams.section ? '#'+$stateParams.section : '',
              videoPluginPath : modelService.cms.config.urls.templates + 'partials/skybrand-animations/',
              videoPluginForceBrowsers : 'firefox'
            }, {
                minion_eyes : [
                  modelService.cms.config.urls.images + '/minion_masks.png', 
                  modelService.cms.config.urls.images + '/minion_overlay.png', 
                  modelService.cms.config.urls.images + '/minion_pupil.png', 
                  modelService.cms.config.urls.images + '/minion_shadow.png'
                ]
            });
          })();

          setTimeout(function(){
            SkyBrandSite.OB.Main.initAfterLoad();
          }, 2500);

          return;
        }
      });

      scope.$on("$destroy", function(){
        $('body').removeClass('guidelines');
        if(typeof SkyBrandSite !== 'undefined') {
          try {
            SkyBrandSite.OB.Main.destroy();
          }catch(e){}
        }
      });

    }

  };

})

;


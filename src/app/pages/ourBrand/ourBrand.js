angular.module('skybrand.ourBrand', [
  'templates-app',
  'ui.state',
  'skybrand.model',
  'skybrand.utilities'
])

.config(function config($stateProvider) {
  $stateProvider.state('our-brand', {
    url: '/our-brand?'+
    'section',
    resolve: {
      data: function($rootScope, serverService, $stateParams, $q, $timeout, cacheService, modelService) {

        var
          deferred = $q.defer(),
          data = null
        ;

        if (data = cacheService.get('ourBrand.ourBrand')) {
          deferred.resolve(data.result.data);
        } else {
          if(typeof SkyBrandSite !== 'undefined') {
            $rootScope.lightbox.open({
              type: 'notifications.loading',
              message1: 'Loading page'
            });
            serverService.ourBrand.getOurBrand().then(function(response) {

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
                      serverService.ourBrand.getOurBrand().then(function(response) {

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
        controller: 'OurBrandCtrl',
        templateUrl: 'pages/ourBrand/ourBrand.tpl.html'
      }
    },
    data: {
      pageTitle: 'Our brand'
    }
  });
})

.controller('OurBrandCtrl', function OurBrandController($scope, $rootScope, data, $stateParams, modelService, utilitiesService) {
  $scope.modelService = modelService;
  $scope.utilitiesService = utilitiesService;
  $scope.data = data;
  var coverflowItems = [];

  $scope.getCoverflowData = function(){
    if(coverflowItems.length) {
      return coverflowItems;
    }
    angular.forEach($scope.data.our_brand_coverflow_items, function(value){
      coverflowItems.push("{'id':'year-"+value.data.year+"', 'date':'"+value.data.our_brand_coverflow_item_year+"','head':'"+
        value.data.title.replace(/'/g,"%27")+"','text':'"+value.data.summary.replace(/'/g,"%27")+"','img':'"+value.data.image.url+
        "', 'video': '"+(value.data.video_id || '')+"'}");
    });

    coverflowItems = "{'type' : 'coverflow', 'id' : '25_years', 'init' : '1', 'items' : ["+coverflowItems.join(',')+"]}";

    return coverflowItems;
  };

})

.directive('ourBrand', function($rootScope, $stateParams, modelService, $timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
  
    $('html, body').scrollTop(0);

    (function autoExec() {
      if(typeof SkyBrandSite === 'undefined' || typeof SkyBrandSite.OB === 'undefined' || typeof SkyBrandSite.OB.Main === 'undefined' || typeof SkyBrandSite.OB.Main.init === 'undefined') {
        setTimeout(autoExec, 300);
        return;
      }
      SkyBrandSite.OB.Main.init(element, {
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

    scope.$on("$destroy", function(){
      if(typeof SkyBrandSite !== 'undefined') {
        try{
          SkyBrandSite.OB.Main.destroy();
        }catch(e){}
      }
    });
    
    element.on('video:play', function(ev, data){
      scope.$apply(function(){
        $rootScope.lightbox.open({
          type: 'video',
          data: {
            url: data.url,
            copy: '<p>'+data.text+'</p>',
            title: data.head
          }
        });
      });
    });

    }

  };

})

;
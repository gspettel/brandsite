angular.module('skybrand.lightbox', [
  'templates-app',
  "skybrand.model",
  "skybrand.server",
  'skybrand.datepicker',
  'skybrand.filters',
  'skybrand.carousel',
  'skybrand.iframe',
  'skybrand.shareInput',
  'skybrand.floatingPanel',
  'ivpusic.cookie',
  'ui.state'
])

.value('lightboxDefaults', {
  all: {
    autoclose: false,
    autoclosetimeout: 0,
    backOnClose: false,
    show: false,
    readyToRemove: false,
    modal: false,
    loading: false,
    message: ''
  },
  'notifications.loading': {
    message1: 'Loading',
    message2: 'Please wait...',
    message3: '',
    allowCancel: false
  },
  'notifications.alert': {
    message1: 'An error occurred',
    message2: ''
  },
  'notifications.success': {
    message1: 'Operation successful',
    message2: ''
  },
  'login': {
    error: null
  },
  'video': {
    data: {
      url: '',
      copy: '',
      title: ''
    }
  },
  'gallery': {
    'slideIndex': 0
  },
  'confirmation': {
    'message1': 'Are you sure you want to execute this operation?'
  }
})

.constant('lightboxSettings', {
  'animations': {
    'speed': 600 //needs to be higher than the duration of css animations
  },
  'timeout': {
    'minimum': 1000,
    'logout': 0,
    'forceClose': 10000
  }
})

.provider('lightbox', function() {

  this.$get = function(lightboxConfig, $q, $rootScope) {

    return {
      open: function(options) {
        lightboxConfig.deferred = $q.defer();
        lightboxConfig.open(options);
        return lightboxConfig.deferred.promise;
      },

      isOpened: function(options) {
        return lightboxConfig.show;
      },

      update: function(options) {
        lightboxConfig.update(options);
      },

      close: function() {
        lightboxConfig.deferred = $q.defer();
        lightboxConfig.close();
        return lightboxConfig.deferred.promise;
      },

      isLoading: function() {
        return lightboxConfig.show && typeof lightboxConfig.options !== 'undefined' && typeof lightboxConfig.options.type !== 'undefined' && lightboxConfig.options.type === 'notifications.loading';
      }

    };
  };

})

.run(function(lightbox, $rootScope) {
  $rootScope.lightbox = lightbox;
})

.service('lightboxConfig', function($window, $rootScope, $location, $timeout, lightboxDefaults, modelService, $q, lightboxSettings) {
    this.show = false;
    this.options = angular.copy(lightboxDefaults.all);
    this.deferred = null;
    //prevent calling close before finishing the fade in animation
    this.opening = false;
    this.closing = false;
    this.scrollbarWidth = false;
    this.forceCloseCallback = null;

    var self = this;

    scrollbarWidth = getScrollbarWidth();

    function getScrollbarWidth() {
      var scrollDiv = document.createElement("div");
      scrollDiv.className = "lightbox-scrollbar-measure";
      document.body.appendChild(scrollDiv);
      scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }

    if(modelService.cms.isIE8) {
      lightboxSettings.animations.speed = 300;
      lightboxSettings.timeout.minimum = 400;
    }

    this.update = function(options) {
      angular.extend(self.options, options);
    };

    function showBodyScrollBar(){
        $('body').css( {
            'overflow':   'hidden',
            'padding-right': (self.scrollbarWidth || getScrollbarWidth()) + 'px'
        }).addClass('has-lightbox');
        $('header.main').width( $('header.main').width() - (self.scrollbarWidth || getScrollbarWidth()) );
    }
    function hideBodyScrollBar(){
        $('body, header.main').removeAttr('style').removeClass('has-lightbox');
    }

    this.open = function(options) {

      self.options.loading = false;
      self.options.error = '';

      //check if locked from closing
      if(self.closing) {
        $timeout(function(){
          self.open(options);
        }, lightboxSettings.animations.speed);
        return false;
      }

      //keep the lightbox opened for a minimum time to do all the animations and allow the user to read the content
      self.opening = true;
      $timeout(function(){
        self.opening = false;
      }, lightboxSettings.timeout.minimum);

      angular.extend(self.options, lightboxDefaults.all);
      if(typeof lightboxDefaults[options.type] !== 'undefined') {
        angular.extend(self.options, lightboxDefaults[options.type]);
      }
      angular.extend(self.options, options);

      showBodyScrollBar();
      self.show = true;

      if(self.options.autoclose) {
        //wait for the fade in animation
        $timeout(function(){
          self.close();
        }, self.options.autoclosetimeout);
      }

      //force close after timeout expires
      // if(self.options.type === 'notifications.loading' && self.options.message1 !== 'Archiving assets'){
      //   lightboxSettings.forceCloseCallback = $timeout(function(){
      //     self.close();
      //   }, lightboxSettings.timeout.forceClose);
      // } else {
      //    $timeout.cancel( lightboxSettings.forceCloseCallback );
      // }

    };

    this.close = function(value) {
      //call to close without lightbox being initialised
      if(typeof self.options.type === 'undefined' || self.closing) {
        return false;
      }

      if(self.opening || !self.show) {
        $timeout(function(){
          self.close(value);
        }, lightboxSettings.animations.speed);
        return false;
      }

      self.show = false;
      self.closing = true;
      $timeout(function(){

        hideBodyScrollBar();

        if(self.options && self.options.backOnClose && !modelService.isFirstLoad) {
          $location.url(modelService.pages.previous);
          self.options.backOnClose = false;
        }

        self.options.readyToRemove = true;

        var oldVals = angular.copy(self.options);
        angular.copy(lightboxDefaults[self.options.type], self.options);
        angular.extend(self.options, oldVals);

        self.closing = false;

        //$timeout.cancel( lightboxSettings.forceCloseCallback );

        self.deferred.resolve(value);

      }, lightboxSettings.animations.speed);

    };

    window.SkyBrand.closeLightbox = function() {
      self.close();
    };

  }
)

.directive('lightbox', function(lightboxConfig, $rootScope, $stateParams, $window, $timeout, $location, modelService, serverService, lightboxSettings, $filter, lightbox, separator, ipCookie) {
    return {
      restrict: 'A',
      scope: {},
      templateUrl: 'components/lightbox/lightbox.tpl.html',
      replace: true,
      link: function(scope, element, attrs) {
        scope.config = lightboxConfig;
        scope.date = null;
        scope.modelService = modelService;

        scope.$watch('config.options.type', function(newVal, oldVal){
          if(newVal === oldVal) { return false; }
          if(newVal === 'logout') {
            scope.session.logout();
          }
        });
        
        scope.select = function(value) {
          scope.config.close(value);
        };

        scope.selectDate = function(value) {
          //dont resolve immediatelly because the fadeout animation need to be completed
          scope.config.close(new Date(value));
        };

        scope.basket = {

          getDownloadLink: function() {
            if(!scope.config.options.data) {
              return '';
            }
            var qs = [];
            for (var i = 0; i < scope.config.options.data.length; i++) {
              qs.push(scope.config.options.data[i].id);
            }
            return '/api/download/multiple?assets=' + qs.join(separator);
          },

          getUrl: function() {
            if(typeof scope.config.options === 'undefined' || typeof scope.config.options.data === 'undefined' || scope.config.options.type !== 'assets.basket') {
              return '';
            }
            var qs = [];
            angular.forEach(scope.config.options.data, function(value, index){
              qs.push(value.id);
            });
            return $window.location.protocol+'//'+$window.location.host + '/assets/all?id=' + qs.join(separator);
          },

          clear: function() {
            modelService.basket = [];
            ipCookie.remove('brandsite_basket');            
            lightbox.close().then(function(){
              $location.path('assets/all');
            });
          },

          remove: function(index) {
            scope.config.options.data.splice(index, 1);
            modelService.basket.splice(index, 1);
            if(!scope.config.options.data.length) {
              scope.config.close();
              ipCookie.remove('brandsite_basket');
            } else {
              var basketIds = [];
              angular.forEach(modelService.basket, function(value, index){
                basketIds.push(value.id ? value.id : value);
              });
              ipCookie('brandsite_basket', JSON.stringify(basketIds), {path: '/'});
            }
          },          

          add: function(asset) {

            var found = false,
              basketIds = []
            ;

            angular.forEach(modelService.basket, function(value, index){
              var val = value.id ? value.id : value;
              basketIds.push(val);
              if(val === asset.id) {
                $rootScope.lightbox.open({type: 'notifications.alert', message1: 'The item is already in the basket', autoclose: true});
                found = true;
                return false;        
              }
            });
            if(found){
              return false;
            }
             
            modelService.basket.push(asset);
            basketIds.push(asset.id);
            
            ipCookie('brandsite_basket', JSON.stringify(basketIds), {path: '/'});

            lightbox.close().then(function(){
              $rootScope.lightbox.open({type: 'notifications.success', message1: 'The item was added to the basket', autoclose: true});
            });

          }

        };

        scope.feedback = {
          submit: function(){
            scope.config.options.loading = true;
            serverService.feedback.add({'comment': scope.config.options.data.comment}).then(function(){
              lightbox.close().then(function(){
                lightbox.open({type: 'notifications.success', message1: 'Thank you!', message2: 'Your feedback was submited to the Sky Brand team.', autoclose: true});
              });
            });
          }
        };

        scope.asset = {

          report: {
            open: function(id){
              scope.config.options.backOnClose = false;
              lightbox.close().then(function(){
                lightbox.open({type: 'assets.issue.report', data: {id: id}});                
              });
            },
            submit: function(){
              scope.config.options.loading = true;
              serverService.assets.report({'id': scope.config.options.data.id, 'comment': scope.config.options.data.comment}).then(function(){
                lightbox.close().then(function(){
                  lightbox.open({type: 'notifications.success', message1: 'Thank you!', message2: 'Your feedback was submited to the Sky Brand team.', autoclose: true}).then(function(){
                    $location.path('/assets/all');
                  });
                });
              });
            },
            close: function(){
              scope.config.options.loading = true;
              serverService.assets.reportClose({'id': scope.config.options.data.id}).then(function(){
                $rootScope.$broadcast('issue:closed', {'id':scope.config.options.data.id});
                lightbox.close().then(function(){
                  lightbox.open({type: 'notifications.success', message1: 'The issue is now closed', autoclose: true});
                });
              });
            },
            closeAndBack: function() {
              scope.config.options.backOnClose = true;
              lightbox.close();
            }
          },

          archive: function(id) {
            scope.config.options.backOnClose = false;
            lightbox.close().then(function(){

              lightbox.open({type: 'confirmation', message1: 'Are you sure you want to archive this asset?'}).then(function(result){
                if(result) {
                  lightbox.open({type: 'notifications.loading', message1: 'Archiving asset'});
                  serverService.assets.archive({'id': id}).then(function(){
                    $rootScope.$broadcast('asset:archived', {'id':id});
                    lightbox.close().then(function(){
                      lightbox.open({type: 'notifications.success', message1: 'Asset archived!', autoclose: true});
                    });
                  });
                } else {
                  $location.path('/assets/all');
                }
              });

            });
          },

          cancelDownload: function() {
            serverService.download.cancel().then(function(response){
              lightbox.close().then(function(){
                lightbox.open({type: 'notifications.alert', message1: 'The download was cancelled', autoclose: true});
              });
            });
          }

        };

        scope.brandhub = {

          date: function() {
            return new Date(scope.date).getTime();
          }

        };

        scope.gallery = {
          onChange: function(index){ 
            scope.config.options.slideIndex = typeof index === 'undefined' ? 0 : index;
          }
        };

        scope.video = {
          getIframeSrc: function(){
            return scope.config.options.data ? $filter('toTrustedSource')('//player.sky.com/?videoId=' + scope.config.options.data.url) : ''; 
          }
        };

        scope.session = {
          random: new Date().getTime(),
          login: function(user, pass) {

            scope.config.options.loading = true;
            serverService.user.login({'user': user, 'pass': pass}).then(function(response){
              scope.config.options.loading = false;
              if(response.success) {
                $rootScope.$broadcast('user:login');
                lightbox.close();
              } else {
                scope.config.options.error = 'Login failed';
              }
            }, function(reason){
              scope.config.options.loading = false;
              scope.config.options.error = reason.errors.message;
            });
          },
          logout: function(user, pass) {
            serverService.user.logout().then(function(){
              $rootScope.$broadcast('user:logout');
              $timeout(function(){
                window.location.href = '/';
              }, lightboxSettings.timeout.logout);
            });
          }
        };

        scope.access = {
          form: {
            reset: function() {
              scope.config.options.data.username = '';
              scope.config.options.data.first_name = ''; 
              scope.config.options.data.last_name = '';
              scope.config.options.data.email = ''; 
              scope.config.options.data.pass = ''; 
              scope.config.options.data.role = null;
              scope.config.options.data.passConfirmation = '';
              scope.config.options.loading = false;
              scope.config.options.error = '';
            }
          },

          user: {
            update: function() {
              scope.config.options.loading = true;

              serverService.users.update({
                'id': scope.config.options.data.id, 
                'first_name': scope.config.options.data.data.first_name, 
                'last_name': scope.config.options.data.data.last_name, 
                'email': scope.config.options.data.data.email, 
                'pass': scope.config.options.data.data.pass, 
                'role': scope.config.options.data.data.roleBindingVal.id, 
                'user_locked': scope.config.options.data.data.user_locked
              })
              .then(function(response){
                scope.config.options.loading = false;
                if(response.success) {                  
                  scope.config.options.error = 'User updated successfully';
                  //update the values in the access view
                  scope.config.options.data.data.role = scope.config.options.data.data.roleBindingVal.name;
                } else {
                  scope.config.options.error = 'Operation failed';
                }
              }, function(reason){
                scope.config.options.loading = false;
                scope.config.options.error = reason.errors.message;
              });

            },

            add: function() {
              scope.config.options.loading = true;

              serverService.users.add({
                'username': scope.config.options.data.username, 
                'first_name': scope.config.options.data.first_name, 
                'last_name': scope.config.options.data.last_name, 
                'email': scope.config.options.data.email, 
                'pass': scope.config.options.data.pass, 
                'role': scope.config.options.data.role.id
              })
              .then(function(response){
                if(response.success) {                  

                  $rootScope.$broadcast('user:added');

                  lightbox.close().then(function(){
                    lightbox.open({type: 'notifications.success', message1: 'User successfully created', autoclose: true});
                  });

                } else {
                  lightbox.close().then(function(){
                    lightbox.open({type: 'confirmation.error', message1: 'Operation failed. Please try again', autoclose: true});
                  });
                }
              }, function(reason){
                scope.config.options.loading = false;
                scope.config.options.error = reason.result;
              });

            },

            remove: function() {

              lightbox.open({type: 'confirmation', message1: 'Are you sure you want to delete the user?'}).then(function(result){
                if(result) {

                  lightbox.open({type: 'notifications.loading', message1: 'Deleting user', message2: 'Please wait...'});

                  serverService.users.remove({
                    'id': scope.config.options.data.id
                  })
                  .then(function(response){
                    if(response.success) {                  

                      $rootScope.$broadcast('user:removed', scope.config.options.data.id);

                      lightbox.close().then(function(){
                        lightbox.open({type: 'notifications.success', message1: 'User successfully deleted', autoclose: true});
                        $location.path('/admin/access');
                      });

                    } else {
                      lightbox.close().then(function(){
                        lightbox.open({type: 'confirmation.error', message1: 'Error occured', message2: 'Please try again'}).then(function(){
                          $location.path('/admin/access');
                        });
                      });
                    }
                  }, 
                  function(reason){
                    lightbox.close().then(function(){
                      lightbox.open({type: 'confirmation.error', message1: 'Error occured', message2: 'Please try again'}).then(function(){
                        $location.path('/admin/access');
                      });
                    });
                  });

              } else {
                $location.path('/admin/access');
              }

            });
            
          }
        }

      };

      scope.showNotification = function(message, autoclose) {
        scope.config.options.loading = true;
        scope.config.options.message = message;
        
        if(autoclose) {
          $timeout(function(){
            scope.config.options.loading = false;
          }, lightboxSettings.timeout.minimum * 2);
        }
      };

        // element.on('click', function(e){
        //   var $target = $(e.target);
        //   if($target.is('a') || 
        //     $target.is('input') || 
        //     $target.is('label') || 
        //     $target.is('textarea') || 
        //     $target.is('select') 
        //     ) {
        //     return;
        //   }
        //   if ($target.closest(".lightbox-content").length || $target.closest(".ng-animate").length) {
        //     return false;
        //   }
        //   if(scope.config.options.type.indexOf('notifications') === 0 || 
        //     scope.config.options.type.indexOf('confirmation.error') === 0  ||
        //     scope.config.options.modal ||
        //     modelService.isFirstLoad && scope.config.options.type.indexOf('brandhub.view') !== 0) {
        //     return false;
        //   }
        //   scope.$apply(function(){
        //     scope.config.close(false);
        //   });

        // });

      }

    };

  }
)

;
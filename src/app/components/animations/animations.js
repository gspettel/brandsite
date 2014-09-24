angular.module('skybrand.animations', [
  'skybrand.model'
])

//ANIMATIONS NOT YET SUPPORTED BY NGMIN GRUNT TASK THUS THE ARRAY VERSION OF DECLARATION MUST BE USED

.animation('.compact', [function() {
  var initialHeight = 0;
  return {
    beforeAddClass: function(element, className, done) {
      if (className == 'ng-hide') {
        element.animate({
          opacity: 0
        }, 300, done);
      } else {
        done();
      }
    },

    removeClass: function(element, className, done) {
      if (className == 'ng-hide') {

        element.css({
          'opacity': 0
        });

        element.delay(400).animate({
          height: 1500,
          opacity: 1
        }, 300, function() {

          $('html, body').animate({
            scrollTop: element.offset().top - 100
          }, 300);
          element.css({
            height: 'auto'
          });
          done();

        });

      } else {
        done();
      }
    }
  };

}])

.animation('.fade', ['modelService', function(modelService) {
  return {
    beforeAddClass: function(element, className, done) {
      if (className == 'ng-hide') {
        if (modelService.cms.isIE8) {
          element.css('opacity', 0);
          done();
        } else {
          TweenLite.to(element, 0.3, {
            opacity: 0,
            onComplete: done
          });
        }
      } else {
        done();
      }
    },

    enter: function(element, done) {
      if(modelService.cms.IE8) {
        element.css('opacity', 1);
        done();
      } else {
        TweenLite.to(element, 0.3, {
          opacity: 1,
          onComplete: done
        });
      }
    },

    removeClass: function(element, className, done) {
      if (className == 'ng-hide') {
        if (modelService.cms.isIE8) {
          element.css('opacity', 1);
          done();
        } else {
          element.css('opacity', 0);
          setTimeout(function() {
            TweenLite.to(element, 0.3, {
              opacity: 1,
              onComplete: done
            });
          });
        }
      } else {
        done();
      }
    }
  };

}])

.animation('.fadein-slide-vertical', ['modelService', function(modelService) {
  return {
    beforeAddClass: function(element, className, done) {

      if (className == 'ng-hide') {
        if (modelService.cms.isIE8) {
          element.css('opacity', 0);
          done();
        } else {
          TweenLite.to(element, 0.3, {
            opacity: 0,
            y: '-20px',
            onComplete: done
          });
        }
      } else {
        done();
      }
    },

    enter: function(element, done) {
      if (modelService.cms.isIE8) {
        element.css('opacity', 1);
          done();
      } else {
        element.css('opacity', 0);
        setTimeout(function() {
          TweenLite.to(element, 0.3, {
            opacity: 1,
            y: 0,
            onComplete: done
          });
        }, 100);
      }
    },

    leave: function(element, done) {
      TweenLite.to(element, 0.3, {
        opacity: 0,
        y: '-20px',
        onComplete: done
      });
    },

    removeClass: function(element, className, done) {
      if (className == 'ng-hide') {

        if (modelService.cms.isIE8) {
          element.css('opacity', 1);
          done();
        } else {
          element.css('opacity', 0);
          setTimeout(function() {
            TweenLite.to(element, 0.3, {
              opacity: 1,
              y: 0,
              onComplete: done
            });
          }, 100);
        }
      } else {
        done();
      }
    }
  };

}])
.animation('.fadein-slide-horizontal', ['modelService', function(modelService) {
  return {
    beforeAddClass: function(element, className, done) {

      if (className == 'ng-hide') {
        if (modelService.cms.isIE8) {
          element.css('opacity', 0);
          done();
        } else {
          TweenLite.to(element, 0.3, {
            opacity: 0,
            x: '20px',
            onComplete: done
          });
        }
      } else {
        done();
      }
    },

    enter: function(element, done) {
      if (modelService.cms.isIE8) {
        element.css('opacity', 1);
          done();
      } else {
        element.css('opacity', 0);
        setTimeout(function() {
          TweenLite.to(element, 0.3, {
            opacity: 1,
            x: 0,
            onComplete: done
          });
        }, 100);
      }
    },

    leave: function(element, done) {
      TweenLite.to(element, 0.3, {
        opacity: 0,
        x: '20px',
        onComplete: done
      });
    },

    removeClass: function(element, className, done) {
      if (className == 'ng-hide') {

        if (modelService.cms.isIE8) {
          element.css('opacity', 1);
          done();
        } else {
          element.css('opacity', 0);
          setTimeout(function() {
            TweenLite.to(element, 0.3, {
              opacity: 1,
              x: 0,
              onComplete: done
            });
          }, 100);
        }
      } else {
        done();
      }
    }
  };

}])

;
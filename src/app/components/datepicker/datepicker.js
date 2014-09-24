angular.module('skybrand.datepicker', [
  'skybrand.model'
])

.directive('datepicker', function datepicker($parse, modelService, $interval) {
  return {
    restrict: "A",
    require: '?ngModel',
    scope: {
      datepickerOnChange: '&',
      datepicker: '='
    },
    templateUrl: 'components/datepicker/datepicker.tpl.html',
    replace: false,
    link: function(scope, element, attrs, ngModel) {

      var 
        day = element.find('input.day'),
        month = element.find('input.month'),
        year = element.find('input.year')
      ;

      element.find('.date-picker').datePicker();
      element.find('.date-picker .date.today').addClass('selected');
      element.addClass('wrap-date-picker');

      function update() {
        //disable weekends
        element.find('.date-picker .date:nth-child(7n)').addClass('past');
        element.find('.date-picker .date:nth-child(7n-1)').addClass('past');
      }

      update();

      element
          .on('click', '.prev', update)
          .on('click', '.next', update);

      (function(){
        var lastVal = {day: '', month: '', year: ''};
        $interval(function(){
          if(lastVal.day !== day.val() || lastVal.month !== month.val() || lastVal.year !== year.val()){
            lastVal = {day: day.val(), month: month.val(), year: year.val()};
            

              if(typeof scope.datepickerOnChange !== 'undefined') {
                scope.datepickerOnChange({
                  date: new Date(lastVal.year + '/' + lastVal.month + '/' + lastVal.day)
                });
              }
              
              if(typeof ngModel !== 'undefined') {
                ngModel.$setViewValue(lastVal.year + '/' + lastVal.month + '/' + lastVal.day);
                ngModel.$render(); 
              }


          }
        }, 500);
      })();

    }
  };

})

;
angular.module('skybrand.filters', [
])

.constant('filtersSettings', {
  'not_specified': 'N/A'
})

.filter('object2Array', function() {
  return function(input) {
    var out = []; 
    for(var i in input){
      out.push(input[i]);
    }
    return out;
  };
})

.filter('checkEmpty', function(filtersSettings) {
  return function(input) {
    return typeof input === 'undefined' || !input || !input.toString().length ? filtersSettings.not_specified : input;
  };
})

.filter('nl2br', function() {
  return function(input) {
    var breakTag = '<br />';
    return (input + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  };
})

.filter('toTrusted', function($sce) {
  return function(input) {
    return $sce.trustAsHtml(input);
  };
})

.filter('toTrustedSource', function($sce) {
  return function(input) {
    return $sce.trustAsResourceUrl(input);
  };
})

.filter('toName', function($sce) {
  return function(input) {
    input = input.charAt(0).toUpperCase() + input.slice(1);
    input = input.replace('-', ' ');
    return input;
  };
})

.filter('joinIds', function(separator) {
  return function(input) {
    var ids = [];
    angular.forEach(input, function(value){
      if(value.data.asset_id) {
        ids.push(value.data.asset_id);
      }
    });
    return ids.join(separator);
  };
})

.filter('ext', function() {
  return function(input) {
    return input.substr( (input.lastIndexOf('.') +1) );
  };
})

;
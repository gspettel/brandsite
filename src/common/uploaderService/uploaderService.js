angular.module('fidi.uploader', [

])

.provider('uploaderService', function UploaderServiceProvider() {

  var id = randomString(5);

  var config = {
    'runtimes': 'html5,flash,silverlight',
    'browse_button': $('body').append('<div id="' + id + '" style="position:absolute; visibility: none; height:0; width: 0;"><a href="javascript:void(0);"></a></div>').find('#' + id + ' a').eq(0)[0],
    'container': $('#' + id)[0],
    'multi_selection': true,
    'max_file_size': '2048mb',
    'url': null,
    'flash_swf_url': null,
    'silverlight_xap_url': null,
    'urlstream_upload': true,
    'filters': [
      {title : "Allowed files", extensions : "jpg,jpeg,gif,tiff,tif,png,psd,psb,zip,rar,tar,gzip,txt,doc,docx,xls,xlsx,ppt,pptx,pdf,rtf,mp3,ogg,wav,mov,mp4,f4v,flv,c4d,swf,eps,avi,ai,mpg,tga,ttf,JPG,JPEG,GIF,TIFF,TIF,PNG,PSD,PSB,ZIP,RAR,TAR,GZIP,TXT,DOC,DOCX,XLS,XLSX,PPT,PPTX,PDF,RTF,MP3,OGG,WAV,MOV,MP4,F4V,FLV,C4D,SWF,EPS,AVI,AI,MPG,TGA,TTF"}
    ]
  };

  this.init = function(args) {
    angular.extend(config, args);
  };

  function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var rs = '';
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      rs += charSet.substring(randomPoz, randomPoz + 1);
    }
    return rs;
  }

  this.$get = function uploaderService($timeout, $q, $rootScope) {

    var public = {

      setParams: function(params) {
        config.multipart_params = params;
      },

      setConfig: function(args) {
        angular.extend(config, args);
      },

      upload: function(file, params) {
        var deferred = $q.defer();

        var _file = file;

        if(typeof params !== 'undefined' && params !== null) {
          public.setParams(params);
        }

        if (!config.url || !config.flash_swf_url || !config.silverlight_xap_url) {
          throw "The uploader service is not configured. Use the config phase to add the configuration!";
        }

        var _uploader = new plupload.Uploader(config);

        _uploader.init();


        _uploader.bind("PostInit", function(up) {
          $timeout(function() {
            _uploader.addFile(_file);
          });
        });

        _uploader.bind('FilesAdded', function(up, files) {
          _uploader.start();
        });

        _uploader.bind('Error', function(up, err) {
          up.refresh(); // Reposition Flash/Silverlight

          deferred.reject(JSON.parse(err.response));
        });

        _uploader.bind('FileUploaded', function(up, file, res) {

          $rootScope.$apply(function() {
            _file.done = true;
          });

          deferred.resolve(JSON.parse(res.response));

        });

        _uploader.bind('UploadProgress', function(up, file) {

          $rootScope.$apply(function() {
            _file.percent = file.percent;
          });

        });

        return deferred.promise;

      }
    };

    return public;

  };

})

;
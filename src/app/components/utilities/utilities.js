angular.module('skybrand.utilities', [
  'ui.state',
  'skybrand.model'
])

.service('utilitiesService', function utilitiesService(modelService, $location, $rootScope, serverService, $window, $timeout, separator ) {
  var self = this;

  $.embedly.defaults.key = SkyBrand.vars.embedlyKey;

  this.filters = {

    reset: function(except) {
      if (!except) {
        except = [];
      }
      //unselect all filters
      angular.forEach(modelService.filters.available, function(filter, key) {
        angular.forEach(filter, function(value, key) {
          value.selected = false;
        });
      });
      modelService.filters.available.is_replacement = false;
      modelService.filters.available.is_private = false;
      modelService.filters.available.asset_dark_background = false;
    },

    getFromUrl: function($stateParams, values_separator) {
      var convert = typeof values_separator !== 'undefined';
      var regex = new RegExp('\\{'+separator+'\\}', 'gi');
      
      var filters = {
        'title': convert && angular.isDefined($stateParams.title) && $stateParams.title ? $stateParams.title.replace(regex, values_separator) : $stateParams.title,
        'id': convert && angular.isDefined($stateParams.id) && $stateParams.id ? $stateParams.id.replace(regex, values_separator) : $stateParams.id,
        'asset_main_category': null,
        'asset_master_brand_category': convert && angular.isDefined($stateParams.master_brand_category) && $stateParams.master_brand_category ? $stateParams.master_brand_category.replace(regex, values_separator) : $stateParams.master_brand_category,
        'asset_channels_brand': convert && angular.isDefined($stateParams.channels_brand) && $stateParams.channels_brand ? $stateParams.channels_brand.replace(regex, values_separator) : $stateParams.channels_brand,
        'asset_channels_category': convert && angular.isDefined($stateParams.channels_category) && $stateParams.channels_category ? $stateParams.channels_category.replace(regex, values_separator) : $stateParams.channels_category,
        'asset_products_category': convert && angular.isDefined($stateParams.products_category) && $stateParams.products_category ? $stateParams.products_category.replace(regex, values_separator) : $stateParams.products_category,
        'asset_products_product': convert && angular.isDefined($stateParams.products_product) && $stateParams.products_product ? $stateParams.products_product.replace(regex, values_separator) : $stateParams.products_product,
        'asset_campaigns_media': convert && angular.isDefined($stateParams.campaigns_media) && $stateParams.campaigns_media ? $stateParams.campaigns_media.replace(regex, values_separator) : $stateParams.campaigns_media,
        'asset_campaigns_product_area': convert && angular.isDefined($stateParams.campaigns_product_area) && $stateParams.campaigns_product_area ? $stateParams.campaigns_product_area.replace(regex, values_separator) : $stateParams.campaigns_product_area,
        'asset_content_content': convert && angular.isDefined($stateParams.content_content) && $stateParams.content_content ? $stateParams.content_content.replace(regex, values_separator) : $stateParams.content_content,
        'asset_content_document': convert && angular.isDefined($stateParams.content_document) && $stateParams.content_document ? $stateParams.content_document.replace(regex, values_separator) : $stateParams.content_document,
        'year': convert && angular.isDefined($stateParams.year) && $stateParams.year ? $stateParams.year.replace(regex, values_separator) : $stateParams.year,
        'quarter': convert && angular.isDefined($stateParams.quarter) && $stateParams.quarter ? $stateParams.quarter.replace(regex, values_separator) : $stateParams.quarter,
        'asset_initiatives_category': convert && angular.isDefined($stateParams.initiatives_category) && $stateParams.initiatives_category ? $stateParams.initiatives_category.replace(regex, values_separator) : $stateParams.initiatives_category,
        'asset_initiatives_initiative': convert && angular.isDefined($stateParams.initiatives_initiative) && $stateParams.initiatives_initiative ? $stateParams.initiatives_initiative.replace(regex, values_separator) : $stateParams.initiatives_initiative,
        'filetype': convert && angular.isDefined($stateParams.filetype) && $stateParams.filetype ? $stateParams.filetype.replace(regex, values_separator) : $stateParams.filetype,
        'country': convert && angular.isDefined($stateParams.country) && $stateParams.country ? $stateParams.country.replace(regex, values_separator) : $stateParams.country,
        'is_replacement': $stateParams.is_replacement,
        'is_private': $stateParams.is_private
      };

      if ($stateParams.mainCategory) {
        $.each(modelService.filters.available.main_categories, function(index, option) {
          if (option.value.replace('_', '-') === $stateParams.mainCategory) {
            filters.asset_main_category = option.id;
          }
        });
      }

      return filters;
    },

    populateAvailableFromUrl: function(availableFilters, $stateParams, values_separator) {

      var separator = typeof values_separator !== 'undefined' ? values_separator : separator;

      var main_category = null;

      if ($stateParams.mainCategory) {
        $.each(availableFilters.main_categories, function(index, option) {
          if (option.value.replace('_', '-') === $stateParams.mainCategory) {
            option.selected = true;
            main_category = option.value;
          }
        });
      }

      if ($stateParams.master_brand_category) {
        $.each(availableFilters.master_brands_categories, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.master_brand_category.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      if ($stateParams.channels_category) {
        $.each(availableFilters.channels_categories, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.channels_category.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      if ($stateParams.channels_brand) {
        $.each(availableFilters.channels_brands, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.channels_brand.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      if ($stateParams.products_product) {
        $.each(availableFilters.products_products, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.products_product.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      if ($stateParams.products_category) {
        $.each(availableFilters.products_categories, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.products_category.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      if ($stateParams.campaigns_product_area) {
        $.each(availableFilters.campaigns_product_areas, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.campaigns_product_area.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      if ($stateParams.campaigns_media) {
        $.each(availableFilters.campaigns_medias, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.campaigns_media.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      if ($stateParams.year) {
        $.each(availableFilters.years, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.year.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      if ($stateParams.quarter) {
        $.each(availableFilters.quarters, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.quarter.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      if ($stateParams.initiatives_category) {
        $.each(availableFilters.initiatives_categories, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.initiatives_category.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      if ($stateParams.initiatives_initiative) {
        $.each(availableFilters.initiatives_initiatives, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.initiatives_initiative.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      if ($stateParams.content_content) {
        $.each(availableFilters.content_contents, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.content_content.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      if ($stateParams.content_document) {
        $.each(availableFilters.content_documents, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.content_document.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      if ($stateParams.filetype) {
        $.each(availableFilters.filetypes, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.filetype.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      if ($stateParams.country) {
        $.each(availableFilters.countries, function(index, option) {
          if ($.inArray(option.id.toString(), $stateParams.country.split(separator)) !== -1) {
            option.selected = true;
          }
        });
      }

      availableFilters.is_replacement = $stateParams.is_replacement === 'true';
      availableFilters.is_private = $stateParams.is_private === 'true';
    },

    getSelected: function(filtersSource, values_separator) {

      separator = typeof values_separator !== 'undefined' ? values_separator : separator;

      var selectedDestination = {};
      var selectedSection = null;

      selectedDestination.asset_main_category = (function() {
        var values = [];
        $.each(filtersSource.main_categories, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            selectedSection = option.value;
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();

      selectedDestination.asset_master_brand_category = (function() {
        var values = [];
        $.each(filtersSource.master_brands_categories, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.asset_channels_category = (function() {
        var values = [];
        $.each(filtersSource.channels_categories, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.asset_channels_brand = (function() {
        var values = [];
        $.each(filtersSource.channels_brands, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.asset_products_product = (function() {
        var values = [];
        $.each(filtersSource.products_products, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.asset_products_category = (function() {
        var values = [];
        $.each(filtersSource.products_categories, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.asset_campaigns_product_area = (function() {
        var values = [];
        $.each(filtersSource.campaigns_product_areas, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.asset_campaigns_media = (function() {
        var values = [];
        $.each(filtersSource.campaigns_medias, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.asset_initiatives_category = (function() {
        var values = [];
        $.each(filtersSource.initiatives_categories, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.asset_initiatives_initiative = (function() {
        var values = [];
        $.each(filtersSource.initiatives_initiatives, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.asset_content_content = (function() {
        var values = [];
        $.each(filtersSource.content_contents, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.asset_content_document = (function() {
        var values = [];
        $.each(filtersSource.content_documents, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.quarter = (function() {
        var values = [];
        $.each(filtersSource.quarters, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.filetype = (function() {
        var values = [];
        $.each(filtersSource.filetypes, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.country = (function() {
        var values = [];
        $.each(filtersSource.countries, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.asset_guideline = (function() {
        var values = [];
        $.each(filtersSource.guidelines, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.id);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.year = (function() {
        var values = [];
        $.each(filtersSource.years, function(index, option) {
          if (typeof option.selected !== 'undefined' && option.selected) {
            values.push(option.value);
          }
        });
        return values.join(separator);
      })();
      selectedDestination.is_replacement = filtersSource.is_replacement === null ? null : filtersSource.is_replacement;
      selectedDestination.is_private = filtersSource.is_private === null ? null : filtersSource.is_private;
      selectedDestination.asset_dark_background = filtersSource.asset_dark_background === null ? null : filtersSource.asset_dark_background;

      selectedDestination.title = filtersSource.title === null ? null : filtersSource.title;
      selectedDestination.summary = filtersSource.summary === null ? null : filtersSource.summary;
      selectedDestination.comment = filtersSource.comment === null ? null : filtersSource.comment;
      selectedDestination.asset_to_replace = filtersSource.asset_to_replace === null ? null : filtersSource.asset_to_replace;

      //clear selectedFilters of other categories
      if (selectedSection === 'master_brand') {
        selectedDestination.asset_channels_category = null;
        selectedDestination.asset_channels_brand = null;
        selectedDestination.asset_products_product = null;
        selectedDestination.asset_products_category = null;
        selectedDestination.asset_campaigns_product_area = null;
        selectedDestination.asset_campaigns_media = null;
        selectedDestination.asset_initiatives_category = null;
        selectedDestination.asset_initiatives_initiative = null;
        selectedDestination.asset_content_content = null;
        selectedDestination.asset_content_document = null;
        selectedDestination.asset_initiatives_initiative = null;
        selectedDestination.country = null;
        selectedDestination.quarter = null;
        selectedDestination.year = null;
      }
      if (selectedSection === 'channels') {
        selectedDestination.asset_master_brand_category = null;
        selectedDestination.asset_products_product = null;
        selectedDestination.asset_products_category = null;
        selectedDestination.asset_campaigns_product_area = null;
        selectedDestination.asset_campaigns_media = null;
        selectedDestination.asset_initiatives_category = null;
        selectedDestination.asset_initiatives_initiative = null;
        selectedDestination.asset_content_content = null;
        selectedDestination.asset_content_document = null;
        selectedDestination.country = null;
        selectedDestination.quarter = null;
        selectedDestination.year = null;
      }
      if (selectedSection === 'products') {
        selectedDestination.asset_master_brand_category = null;
        selectedDestination.asset_channels_category = null;
        selectedDestination.asset_channels_brand = null;
        selectedDestination.asset_campaigns_product_area = null;
        selectedDestination.asset_campaigns_media = null;
        selectedDestination.asset_initiatives_category = null;
        selectedDestination.asset_initiatives_initiative = null;
        selectedDestination.asset_content_content = null;
        selectedDestination.asset_content_document = null;
        selectedDestination.country = null;
        selectedDestination.quarter = null;
        selectedDestination.year = null;
      }
      if (selectedSection === 'campaigns') {
        selectedDestination.asset_master_brand_category = null;
        selectedDestination.asset_products_product = null;
        selectedDestination.asset_products_category = null;
        selectedDestination.asset_channels_category = null;
        selectedDestination.asset_channels_brand = null;
        selectedDestination.asset_initiatives_category = null;
        selectedDestination.asset_initiatives_initiative = null;
        selectedDestination.asset_content_content = null;
        selectedDestination.asset_content_document = null;
      }
      if (selectedSection === 'initiatives') {
        selectedDestination.asset_master_brand_category = null;
        selectedDestination.asset_products_product = null;
        selectedDestination.asset_products_category = null;
        selectedDestination.asset_campaigns_product_area = null;
        selectedDestination.asset_campaigns_media = null;
        selectedDestination.asset_channels_category = null;
        selectedDestination.asset_channels_brand = null;
        selectedDestination.asset_content_content = null;
        selectedDestination.asset_content_document = null;
        selectedDestination.country = null;
        selectedDestination.quarter = null;
        selectedDestination.year = null;
      }
      if (selectedSection === 'content') {
        selectedDestination.asset_master_brand_category = null;
        selectedDestination.asset_products_product = null;
        selectedDestination.asset_products_category = null;
        selectedDestination.asset_campaigns_product_area = null;
        selectedDestination.asset_campaigns_media = null;
        selectedDestination.asset_channels_category = null;
        selectedDestination.asset_channels_brand = null;
        selectedDestination.asset_initiatives_category = null;
        selectedDestination.asset_initiatives_initiative = null;
        selectedDestination.country = null;
        selectedDestination.quarter = null;
        selectedDestination.year = null;
      }

      return selectedDestination;

    },

    populateFiltersFromAsset: function(asset, filters) {

      this.reset();

      if (asset.data.is_replacement) {
        filters.available.is_replacement = true;
      } else {
        filters.available.is_new = true;
      }

      filters.available.is_private = asset.data.is_private;
      filters.available.asset_dark_background = asset.data.asset_dark_background;

      angular.forEach(filters.available.main_categories, function(value, key) {
        if (value.id === asset.data.asset_main_category.id) {
          value.selected = true;
          filters.asset_main_category = value;
        } 
      });

      angular.forEach(asset.data.asset_master_brand_category, function(asset_option, key) {
        angular.forEach(filters.available.master_brands_categories, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            filters.available.master_brands_categories[key].selected = true;
          }
        });
      });

      angular.forEach(asset.data.asset_channels_category, function(asset_option, key) {
        angular.forEach(filters.available.channels_categories, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            available_option.selected = true;
          }
        });
      });

      angular.forEach(asset.data.asset_channels_brand, function(asset_option, key) {
        angular.forEach(filters.available.channels_brands, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            available_option.selected = true;
          }
        });
      });

      angular.forEach(asset.data.asset_products_category, function(asset_option, key) {
        angular.forEach(filters.available.products_categories, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            available_option.selected = true;
          }
        });
      });

      angular.forEach(asset.data.asset_products_product, function(asset_option, key) {
        angular.forEach(filters.available.products_products, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            available_option.selected = true;
          }
        });
      });

      angular.forEach(asset.data.asset_campaigns_product_area, function(asset_option, key) {
        angular.forEach(filters.available.campaigns_product_areas, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            available_option.selected = true;
          }
        });
      });

      angular.forEach(asset.data.asset_campaigns_media, function(asset_option, key) {
        angular.forEach(filters.available.campaigns_medias, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            available_option.selected = true;
          }
        });
      });

      angular.forEach(filters.available.years, function(available_option, key) {
        if (available_option.value === asset.data.year) {
          available_option.selected = true;
        }
      });

      angular.forEach(asset.data.quarter, function(asset_option, key) {
        angular.forEach(filters.available.quarters, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            available_option.selected = true;
          }
        });
      });

      angular.forEach(asset.data.asset_initiatives_category, function(asset_option, key) {
        angular.forEach(filters.available.initiatives_categories, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            available_option.selected = true;
          }
        });
      });

      angular.forEach(asset.data.asset_initiatives_initiative, function(asset_option, key) {
        angular.forEach(filters.available.initiatives_initiatives, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            available_option.selected = true;
          }
        });
      });

      angular.forEach(asset.data.asset_content_content, function(asset_option, key) {
        angular.forEach(filters.available.content_contents, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            available_option.selected = true;
          }
        });
      });

      angular.forEach(asset.data.asset_content_document, function(asset_option, key) {
        angular.forEach(filters.available.content_documents, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            available_option.selected = true;
          }
        });
      });

      angular.forEach(asset.data.filetype, function(asset_option, key) {
        angular.forEach(filters.available.filetypes, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            available_option.selected = true;
          }
        });
      });

      angular.forEach(asset.data.country, function(asset_option, key) {
        angular.forEach(filters.available.countries, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            available_option.selected = true;
          }
        });
      });

      angular.forEach(asset.data.asset_guideline, function(asset_option, key) {
        angular.forEach(filters.available.guidelines, function(available_option, key) {
          if (available_option.id === asset_option.id) {
            available_option.selected = true;
          }
        });
      });

    }

  };

  this.showFeedbackForm = function() {
    $rootScope.lightbox.open({type: 'feedback.add', backOnClose: false});                
  };

  this.assureAdmin = function(deferred) {
    (function autoExec(){
      if(!modelService.user) {
        $timeout(autoExec,200);
      } else {
        if(!modelService.user.isSuperuser) {
          deferred.reject();
          $location.path('not-allowed');
        } else {
          deferred.resolve();
        }
      }
    })();
  };

  this.assureLoggedIn = function(deferred) {
    (function autoExec(){
      if(!modelService.user) {
        $timeout(autoExec,200);
      } else {
        if(!modelService.user.isLoggedin) {
          deferred.reject();
          $location.path('login');
        } else {
          deferred.resolve();
        }
      }
    })();
  };

  this.assurePermissions = function(permissions, deferred) {
    (function autoExec(){
      if(!modelService.user) {
        $timeout(autoExec,200);
      } else {
        var granted = true;
        angular.forEach(permissions, function(permission){
          if(!modelService.user.permissions[permission]) {
            granted = false;
          }
        });
        if(!granted) {
          deferred.reject();
          $location.path('not-allowed');
        } else {
          deferred.resolve();
        }
      }
    })();
  };

  this.back = function(){
    $location.url(modelService.pages.previous);
  };

  this.getPathFromAbsUrl = function(url) {
    $rootScope.parser = document.createElement('a');
    $rootScope.parser.href = url;
    var path = $rootScope.parser.pathname + $rootScope.parser.search;
    if(modelService.cms.isIE8) {
      path = url.substr(url.indexOf('#') + 2);
    }
    return path;
  };

  this.files = {
    'getThumb': function(file) {
      var ext = file.name.split('.').pop();
      if ($.inArray(ext.toLowerCase(), ['jpg', 'jpeg', 'png', 'gif', 'bmp']) !== -1) {
        if (modelService.cms.isIE8 || modelService.cms.isIE9) {
          return 'The thumbnail will be generated from the uploaded file. Because you\'re using an old browser, previews are not available. It\'s highly recommended you upgrade your browser.';
        }
        return file;
      } else {
        if (modelService.cms.isIE8 || modelService.cms.isIE9) {
          return 'The generated thumbnail will the default thumbnail for ' + ext.toUpperCase() + ' files. Because you\'re using an old browser, previews are not available. It\'s highly recommended you upgrade your browser.';
        }
        if ($.inArray(ext.toLowerCase(), modelService.cms.thumbs) !== -1) {
          return modelService.cms.config.urls.templates + modelService.cms.env + '/assets/images/thumbs/' + ext + '.jpg';
        }

        return modelService.cms.config.urls.templates + modelService.cms.env + '/assets/images/thumbs/default.png';

      }
    }
  };

  //generate embed videos
  this.parser = {

    videos: function(maxWidth){
      if(!maxWidth) {
        maxWidth = 650;
      }
      $("p.skybrand-embed").each(function(index,el){
        el = $(el);
        var url = el.text();
        el.replaceWith('<a class="skybrand-embed" href="'+url+'">Watch Video</a>');
      });

      setTimeout(function(){
        var embeds = $("a.skybrand-embed");
        if(!embeds.length) { return false; }
        embeds.embedly({
            query: {
            maxwidth: maxWidth                
          }
        });
      },0);

    }
  };

  //add some utility prototypes
  (function() {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    Date.prototype.Sky = {};

    Date.prototype.Sky.getMonthName = function(month) {
        return months[ this.getMonth() ];
    };
    Date.prototype.Sky.getDayName = function(day) {
        return days[ this.getDay() ];
    };
    Date.prototype.Sky.daysInMonth = function(){
      return 32 - new Date(this.getFullYear, this.getMonth(), 32).getDate();
    };

    //polyfill object.keys ie8
    if (!Object.keys) {
      Object.keys = (function () {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
              'toString',
              'toLocaleString',
              'valueOf',
              'hasOwnProperty',
              'isPrototypeOf',
              'propertyIsEnumerable',
              'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
          if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
            throw new TypeError('Object.keys called on non-object');
          }

          var result = [], prop, i;

          for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
              result.push(prop);
            }
          }

          if (hasDontEnumBug) {
            for (i = 0; i < dontEnumsLength; i++) {
              if (hasOwnProperty.call(obj, dontEnums[i])) {
                result.push(dontEnums[i]);
              }
            }
          }
          return result;
        };
      }());
    }

  })();

})

;
# Brand portal for BSkyB

## Quick notes
This repo contains the frontend code for the Internal brand asset management system build for BSkyB (https://www.believeinbetter.com)

Screenshots [here](screenshots)

**Technologies used: **

AngularJS, ngBoilerplate, UI Router, HTML5, CSS3, SASS / Compass, File API, Canvas, Plupload, jQuery, 
Grunt, Bower 

## Project structure

Based on ngBoilerplate (https://github.com/ngbp/ngbp)

* The source file are located in `src` directory.

* `src/common` directory contains reusable AngularJS modules which don't depend current app specifics. At most they can only depend on other reusable modules inside the same `src/common` directory.  

* `src/app/pages` contains the Angular modules which have a route assigned (eg: pages and lightbox routes).

* `src/app/components` contains Angular modules which don't have a route assigned - directives, services, factories such as main menus, JS constructor wrapped in factories, date pickers, carousels, lightboxes etc.


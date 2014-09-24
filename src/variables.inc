<?php
/**
*
* this file exports the package version from grunt + others global variables and it's included by others file that require this information
* eg: the admin theme requires the file to get the package version and include the css/js
*
**/

$pkgname = '<%= pkgname %>';
$pkgversion = '<%= pkgversion %>';

$available_default_thumbs = array( 'jpg', 'jpeg', 'gif','tiff','tif','png','psd','psb','zip','rar','tar','gzip','txt','doc','docx','xls','xlsx','ppt','pptx','pdf','rtf','mp3','ogg','wav','mov','mp4','f4v','flv','c4d','swf','eps','avi','ai','mpg', 'mpeg', 'tga', 'ttf');

//other config removed from public git

?>
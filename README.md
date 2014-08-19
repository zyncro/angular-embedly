[![Build Status](https://magnum.travis-ci.com/lithiumtech/angular-embedly.svg?token=ge874yewpnzVTyXyDf8v&branch=master)](https://magnum.travis-ci.com/lithiumtech/angular-embedly)

Angular Embed.ly
================

Angular Embed.ly is a JavaScript library for AngularJS apps to interact with the 
Embed.ly API. To find out what Embed.ly is all about, please visit http://embed.ly. 
This library and documentation is adapted from the Embed.ly jQuery library, 
available at https://github.com/embedly/embedly-jquery.

The Angular Embed.ly library file `angular.embedly.js` can be found in the root directory. The minified file 
`angular.embedly.min.js` may also be used. Library demos can be found in the `demo` directory. 
Unit tests can be found in the `test` directory.

Run a local demo server
-----------------------

1.  Git clone this repository `git clone git@github.com:lithiumtech/angular-embedly.git`
2.  From the command line, run:`npm install` and `bower install`
3.  Edit the demo files to replace any instances of 'Your Embed.ly Key Here' with your actual Embed.ly API key.
4.  Run: `gulp server`
5.  You can now navigate to:
  * localhost:8080/demo/readme_demo.html
  * localhost:8080/demo/post_demo.html
  * localhost:8080/demo/example_page.html

Basic Setup
-----------
Angular Embed.ly requires AngularJS 1.2.17 or above. 
Add Angular and Angular Embed.ly to your document.
```
<head>
  <script src="./bower_components/angular/angular.js"></script>
  <script src="./angular.embedly.js"></script>
</head>
```

Choose a name for your Angular Embed.ly App, e.g. 'ngEmbedlyTestApp'. 
Include the ng-app directive in the 'body' tag (or a 'div' tag).
```
<body ng-app="ngEmbedlyTestApp">
```

You must include a short script where you declare an angular module whose name 
corresponds to your ng-app directive. This module depends on the 'ngEmbedApp' module 
from the Angular Embed.ly library.
```
<head>
...
  <script>
    var mod = angular.module('ngEmbedlyTestApp', ['ngEmbedApp']);
    ...
  </script>
</head>
```

Create a directive that returns a controller, where custom options and functions may be 
specified as variables on the `$scope`. **You *must* also include your Embed.ly API key here.** 
```
mod.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
    }
  }
});
```

In the document, add your directive to the div within which all your embedded content should go. 
```
<div my-embedly-test>
```

Inside this div, you should add the ng-embedly directive. You must reference your API key as a directive 
attribute here. Using the ng-embedly directive more than once allows for different embed options in 
distinct areas of the document.
```
<div my-embedly-test>
  ...
  <!-- Links here won't be embedded -->
  ...
  <div ng-embedly key="key">
    <!-- Links here will be embedded with default options-->
  </div>
  ...
  <div ng-embedly key="key" query="query">
    <!-- Links here will be embedded with custom query options -->
  </div>
  ...
</div>
```

Now all links contained in ng-embedly will be replaced with embedded content. <br/>
Note: for the custom query options to work properly, they must be declared inside the controller 
as `$scope.query = {...};`. Continue reading for specific custom options.


Custom Options
--------------
Customized options are available by adding and modifying scope variables, with corresponding
references in the HTML. Multiple options may be specified at once. Camel case in the script 
should be replaced with dashes in HTML. Ex: `$scope.addImageStyles` should be referenced in the 
document as `add-image-styles`.

**Key**<br/>
Embed.ly requires that you pass an API key with every request.
To sign up for a key visit app.embed.ly/signup.<br/>
HTML:
```
<div ng-embedly key="key">
```
Script:
```
.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
    }
  }
});
```

**Endpoint**<br/>
A string value that maps to the Embed.ly endpoints. The Preview and
Objectify endpoints are only available for [Legacy plans](http://embed.ly/docs/endpoints).
  * [oembed](<http://embed.ly/docs/endpoints/1/oembed>) - a standard in 3rd
    party embedding, contains a finite set of attributes.
  * [extract](http://embed.ly/docs/extract/api/endpoints/1/extract) - returns
    a wide variety of attributes (article text, images, dominant colors,
    keywords, related links, and embeds in page) for creating an experience
    with your links.
  * [preview](http://embed.ly/docs/endpoints/1/preview) - returns a larger
    set of attributes (multiple images, RSS content, and embeds in page) for
    customizing your embeds.
  * [objectify](http://embed.ly/docs/endpoints/2/objectify>) - returns all of
    the meta and API data Embed.ly has for a link. Advanced users.

HTML:
```
<div ng-embedly key="key" endpoint="endpoint">
```
Script:
```
.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
      $scope.endpoint = 'extract';
    }
  }
});
```

**Secure**<br/>
A boolean value representing whether or not to explicitly set the HTTPS 
or HTTP endpoint for your request. By default Embed.ly jQuery will use 
``window.location.protocol`` to determine which endpoint to use. You can 
override this by explicitly setting the secure parameter to ``true`` for 
``https`` or ``false`` for HTTP.<br/>
HTML:
```
<div ng-embedly key="key" secure="secure">
```
Script:
```
.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
      $scope.secure = true;
    }
  }
});
```

**Query Arguments**<br/>
A direct pass though to all the Query Arguments that the Embed.ly API accepts.
These will be combined with the ``key``, ``endpoint``, and the URLs to
form the request to Embed.ly.
```
  query: {
    maxwidth: 400,
    maxheight: 400,
    chars: 200,
    autoplay: true
    ...
  }
```
HTML:
```
<div ng-embedly key="key" query="query">
```
Script:
```
.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
      $scope.query = {maxwidth:600, maxheight:600, autoplay:false};
    }
  }
});
```

**Method**<br/>
A string value to tell Embed.ly how to place the content in your page when
using the default display function.
  * `replace` - replaces the link with the content
  * `after` - inserts the content after the link
  * `afterParent` - inserts the content after the parent element
  * `replaceParent` - replaces parent element with the embed content
HTML:
```
<div ng-embedly key="key" method="method">
```
Script:
```
.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
      $scope.method = 'after';
    }
  }
});
```

**Add Image Styles**<br/>
A boolean value representing whether or not Embed.ly should use the style
element to resize images based on the maxWidth and maxHeight parameters.<br/>
HTML:
```
<div ng-embedly key="key" add-image-styles="addImageStyles">
```
Script:
```
.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
      $scope.addImageStyles = false;
    }
  }
});
```

**Wrap Element**<br/>
A string value representing the valid HTML element to wrap the content in.<br/>
HTML:
```
<div ng-embedly key="key" wrap-element="wrapElement">
```
Script:
```
.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
      $scope.wrapElement = 'div';
    }
  }
});
```

**Class Name**<br/>
A string value representing a CSS class you would like to assign to the
wrapElement.<br/>
HTML:
```
<div ng-embedly key="key" class-name="className">
```
Script:
```
.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
      $scope.className = 'my-Embed';
    }
  }
});
```

**Batch Size**<br/>
Embed.ly's API only accepts a maximum of 20 URLs per request, so the Client
batches these up into groups of 20. If you would like to set a custom size,
you can do so with this argument.<br/>
HTML:
```
<div ng-embedly key="key" batch="batch">
```
Script:
```
.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
      $scope.batch = 10;
    }
  }
});
```

**URL RegEx**<br/>
A regular expression representing what links to show content for. Use 
Embed.ly's [generator](http://embed.ly/tools/generator) to generate a 
regular expression for a specific set of sources.<br/>
HTML:
```
<div ng-embedly key="key" url-reg-exp="urlRegExp">
```
Script:
```
.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
      $scope.urlRegExp = /http:\/\/(www\.flickr\.com\/photos\/.*|flic\.kr\/.*)/i;
    }
  }
});
```

**Display**<br/>
Some developers may wish to write a custom `display` method to further 
customize the appearance of embeds in their document, using information from 
Embed.ly's API. For example, media snippets can be created using thumbnail 
information from the Embed.ly API responses and custom CSS.<br/>
HTML:
```
<div ng-embedly key="key" display="display">
```
Script:
```
.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
      $scope.display = function() {
        // custom display code goes here
      }
    }
  }
});
```

**URLs Directive**<br/>
In some cases, the ngEmbedUrls directive should be used instead of the ngEmbedly 
directive. It should be used for custom manipulation of the embed URLs, e.g. 
detecting URLs in a text input box. In this case, `$scope.urls` becomes available. 
This variable is an array where URLs not native to the document can be pushed.<br/>
HTML:
```
<div ng-embed-urls key="key" urls="urls">
```
Script:
```
.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
      $scope.urls = [];
      $scope.urls.push('www.google.com');
      // Do something with urls[]
    }
  }
});
```

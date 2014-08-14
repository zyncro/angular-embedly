Angular Embed.ly
================
**Author: Sarah Green**<br/>
Software Engineering Intern, Summer 2014<br/>
Lithium Technologies<br/>
San Francisco, CA

Angular Embed.ly is a JavaScript library for AngularJS apps to interact with the 
Embed.ly API. This library and documentation is adapted from the Embed.ly jQuery
library, available at https://github.com/embedly/embedly-jquery.

The library file can be found in the 'src' directory. Library demos can be found in 
the 'demo' directory. Unit tests can be found in the 'test' directory. AngularJS 1.2.17 
can be found in the 'libs' directory.

Also included: TravisCI for continuous integration, Bower for package management, 
npm for managing Node.js modules, Gulp for task automation, JS Hint to detect JavaScript errors, 
Jasmine/Karma/PhantomJS for unit testing, and Karma-Coverage for test coverage statistics.

[![Build Status](https://magnum.travis-ci.com/lithiumtech/angular-embedly.svg?token=ge874yewpnzVTyXyDf8v&branch=master)](https://magnum.travis-ci.com/lithiumtech/angular-embedly)

Basic Setup
-----------
Angular Embed.ly requires Angular 1.2.17 or above. 
Add Angular and Angular Embed.ly to your document.
```
<head>
  <script src="../libs/angular.js"></script>
  <script src="../src/angular.embedly.js"></script>
</head>
```

Choose a name for your Angular Embed.ly App, e.x. 'ngEmbedlyTestApp'. 
Include the ng-app directive with your chosen name in the 'body' tag.
```
<body ng-app="ngEmbedlyTestApp">
```

You must include a short script in the 'head' tag. Create an angular module 
with the same name from ng-app. This module depends on the 'ngEmbedApp' 
module from the Angular Embed.ly library.
```
<head>
...
  <script>
    var mod = angular.module('ngEmbedlyTestApp', ['ngEmbedApp']);
    ...
  </script>
</head>
```

Now create a directive in your script that returns a controller, where custom 
options and functions may be specified as variables on the `$scope`. You *must* 
also include your Embed.ly API key here. It may be named myEmbedlyTest or otherwise. 
```
mod.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
    }
  }
});
```

In your document, add this directive to the div within which all your embedded 
content should go. Any camel case in the script should be replaced with dashes in html. 
```
<div my-embedly-test>
```

Inside this div, you should add another div with the ng-embedly directive. You must 
reference your API key as a directive attribute here, as well as other custom options. 
This div is separated from the above directive div so that different embed options may 
be specified for different areas of the document.
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

Now, all links with an 'a' tag inside the ng-embedly div will be replaced with
embedded content. <br />
Note: for the custom query options to work properly, they must be declared inside the 
directive's returned controller as `$scope.query = {...};`. Continue reading for specific 
custom options.


Custom Options
--------------
Customized options are available by adding and modifying scope variables in the directive's 
returned controller, with corresponding references in the html. Multiple options may 
be specified at once. 
Remember that camel case in the script should be replaced with dashes in html. Ex: 
`$scope.addImageStyles` should be referenced in the document as `add-image-styles`.

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
<div ng-embedly key="'Your Embed.ly Key'" secure="secure">
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
<div ng-embedly key="'Your Embed.ly Key'" query="query">
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
<div ng-embedly key="'Your Embed.ly Key'" method="method">
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
<div ng-embedly key="'Your Embed.ly Key'" add-image-styles="addImageStyles">
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
<div ng-embedly key="'Your Embed.ly Key'" wrap-element="wrapElement">
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
<div ng-embedly key="'Your Embed.ly Key'" class-name="className">
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
<div ng-embedly key="'Your Embed.ly Key'" batch="batch">
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
<div ng-embedly key="'Your Embed.ly Key'" url-re="urlRe">
```
Script:
```
.directive('myEmbedlyTest', function() {
  return {
    controller: function ($scope, $rootScope) {
      $scope.key = 'Your Embed.ly API key';
      $scope.urlRe = /http:\/\/(www\.flickr\.com\/photos\/.*|flic\.kr\/.*)/i;
    }
  }
});
```

**Display**<br/>
Some developers may wish to write a custom `display` method to further 
customize the appearance of embeds in their document, using information from 
Embed.ly's API. For example, media snippets can be created using thumbnail 
information from the Embed.ly API responses and custom CSS.<br />
HTML:
```
<div ng-embedly key="'Your Embed.ly Key'" display="display">
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
This variable is an array where URLs not native to the document can be pushed.
HTML:
```
<div ng-embed-urls key="'Your Embed.ly Key'" urls="urls">
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

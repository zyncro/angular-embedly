(function() {

  'use strict';

  describe('directive', function() {

    var $rootScope, $compile, $element, $httpBackend, API, $timeout;

    beforeEach(function () {
      module('ngEmbedApp');
      inject(function (_$rootScope_, _$compile_, _$httpBackend_, _API_, _$timeout_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        API = _API_;
        $timeout = _$timeout_;
      });
    });

    // Testing basic embeds
    
    it('should embed a video URL as an iframe', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DDHlzIgSvnYc")
      .respond([youtubeResponse]);
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\"><a href=\"https://www.youtube.com/watch?v=DHlzIgSvnYc\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      var iframes = $element.find('iframe');
      expect(iframes.length).toEqual(1);
      expect(iframes[0].src.match(/schema=youtube/g));
    });

    it('should use thumbnail for link type embed', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fwww.facebook.com")
      .respond([facebookResponse]);
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\"><a href=\"http://www.facebook.com\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
    });

    it('should embed two photos as imgs', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg,http%3A%2F%2Fwww.privateislandsonline.com%2Fcontent%2Flistings%2F245%2Fcimage_d05d567275-thumbb.jpg")
      .respond([photoResponse,photoResponse2]);
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a><a href=\"http://www.privateislandsonline.com/content/listings/245/cimage_d05d567275-thumbb.jpg\">/a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      var imgs = $element.find('img');
      expect(imgs.length).toEqual(2);
      expect(imgs[0].src).toEqual('http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg');
      expect(imgs[1].src).toEqual('http://www.privateislandsonline.com/content/listings/245/cimage_d05d567275-thumbb.jpg');
    });

    it('should compare src on img to original url', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      var img = $element.find('img')[0];
      expect(img.src).toEqual('http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg');
    });

    it('should use the ngEmbedUrls directive correctly', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.urls = ['http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg'];
      $element = $compile("<div ng-embed-urls key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" urls=\"urls\"></div>")($rootScope);
      $rootScope.$digest();
      $httpBackend.flush();
      var img = $element.find('img')[0];
      expect(img.src).toEqual('http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg');
      });

    it('should ignore a duplicate URL in the ngEmbedUrls directive', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.urls = ['http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg', 'http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg'];
      $element = $compile("<div ng-embed-urls key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" urls=\"urls\"></div>")($rootScope);
      $rootScope.$digest();
      $httpBackend.flush();
      var img = $element.find('img')[0];
      expect(img.src).toEqual('http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg');
      });

    it('should reject bad URLs', function() {
      $rootScope.urls = ['htp:/stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg'];
      $element = $compile("<div ng-embed-urls key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" urls=\"urls\"></div>")($rootScope);
      $rootScope.$digest();
      var imgs = $element.find('img');
      expect(imgs.length).toEqual(0);
      });
  
    it('should reject URLs with a provided regex', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=https%3A%2F%2Fwww.flickr.com%2Fphotos%2F32625085%40N05%2F3100650262%2F")
      .respond([photoResponse]);
      $rootScope.urlRegExp = /https:\/\/(www\.flickr\.com\/photos\/.*|flic\.kr\/.*)/i;
      $rootScope.urls = ['https://www.flickr.com/photos/32625085@N05/3100650262/', 'http://www.facebook.com'];
      $element = $compile("<div ng-embed-urls key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" url-reg-exp=\"urlRegExp\" urls=\"urls\"></div>")($rootScope);
      $rootScope.$apply();
      $rootScope.$digest();
      $httpBackend.flush();
      });
  
    it('should have an Embed.ly error', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=abc&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond(401);
      $element = $compile("<div ng-embedly key=\"'abc'\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      var imgs = $element.find('img');
      expect(imgs.length).toEqual(0);
    });

    it('should have an Embed.ly error', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F4fsdjfsdjfbsdhfbsjdf.jpg")
      .respond(404);
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\"><a href=\"http://stuffpoint.com/puppies/image/4fsdjfsdjfbsdhfbsjdf.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      var imgs = $element.find('img');
      expect(imgs.length).toEqual(0);
    });

    it('should use thumbnail url when no url is available', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fwww.instagram.com%2Fp%2FqSFCeiMS2Z%2F")
      .respond([instagramResponse]);
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\"><a href=\"http://www.instagram.com/p/qSFCeiMS2Z/\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      var iframes = $element.find('iframe');
      expect(iframes.length).toEqual(1);
      });

    it('should use the response cache', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DDHlzIgSvnYc")
      .respond([youtubeResponse]);
      API.request('oembed', ['https://www.youtube.com/watch?v=DHlzIgSvnYc'], {key:'7c14d0f2f67840cf9144b91f1b6d5002'});
      $rootScope.$digest();
      $httpBackend.flush();
      $timeout.flush();
      API.request('oembed', ['https://www.youtube.com/watch?v=DHlzIgSvnYc'], {key:'7c14d0f2f67840cf9144b91f1b6d5002'});
      $timeout.flush();
      //if didn't crash, then test passed
      });

    it('should handle a div ng-embedly with href attribute on it', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DDHlzIgSvnYc")
      .respond([youtubeResponse]);
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" href=\"https://www.youtube.com/watch?v=DHlzIgSvnYc\"></div>")($rootScope);
      $rootScope.$apply();
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
    });

    it('should handle an empty a tag', function() {
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\"><a></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
    });

    it('should attempt to send a message to null console level', function() {
      API.log(null, 'test message');
      //if didn't crash, then test passed
      });

    // Testing customized embed options

    it('should require an Embedly API key', function() {
      spyOn(window.console, 'error');
      $element = $compile("<div ng-embedly><a href=\"https://www.youtube.com/watch?v=DHlzIgSvnYc\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      expect(window.console.error).toHaveBeenCalledWith('Embedly Angular requires an API Key. Please sign up for one at http://embed.ly');
    });

    it('should use extract endpoint (without custom display function)', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/extract?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fblog.embed.ly%2Fjavascript-hackathon-downcityjs-betaspring")
      .respond([extractResponse]);
      $rootScope.endpoint = 'extract';
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" endpoint=\"endpoint\"><a href=\"http://blog.embed.ly/javascript-hackathon-downcityjs-betaspring\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      //if didn't crash, then test passed
    });

    it('should use objectify endpoint', function() {
      $httpBackend.expectGET("http://api.embed.ly/2/objectify?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fblog.embed.ly%2Fjavascript-hackathon-downcityjs-betaspring")
      .respond([extractResponse]);
      $rootScope.endpoint = 'objectify';
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" endpoint=\"endpoint\"><a href=\"http://blog.embed.ly/javascript-hackathon-downcityjs-betaspring\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      //if didn't crash, then test passed
    });

    it('should be secure: set endpoint to https://api.embed.ly/...', function() {
      $httpBackend.expectGET("https://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.secure = true;
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" secure=\"secure\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
        //if didn't crash, then test passed
      });

    it('should ignore a bad request to set secure endpoint', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.secure = 'this is not a boolean';
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" secure=\"secure\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
        //if didn't crash, then test passed
      });

    it('should use query arguments to set embedded content dimensions', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?maxwidth=600&maxheight=400&key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.query = {maxwidth:600,maxheight:400};
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" query=\"query\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      var imgStyle = $element.find('img')[0].style;
      var w = parseInt(imgStyle.maxWidth, 10);
      var h = parseInt(imgStyle.maxHeight, 10);
      expect(w).toBeLessThan(601);
      expect(h).toBeLessThan(401);
    });

    it('should only use integers for maxwidth and maxheight query arguments', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?maxheight=400&key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.query = {maxwidth:600.5,maxheight:400};
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" query=\"query\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      var imgStyle = $element.find('img')[0].style;
      var h = parseInt(imgStyle.maxHeight, 10);
      expect(h).toBeGreaterThan(399);
      expect(h).toBeLessThan(401);
    });

    it('should not use bad query arguments', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.query = {maxwidth:'abc',maxheight:'$%!',width:true,autoplay:600};
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" query=\"query\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
    });

    it('should use query arguments to enable video autoplay', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?autoplay=true&key=7c14d0f2f67840cf9144b91f1b6d5002&urls=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DDHlzIgSvnYc")
      .respond([youtubeAutoplay]);
      $rootScope.query = {autoplay:true};        
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" query=\"query\"><a href=\"https://www.youtube.com/watch?v=DHlzIgSvnYc\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      var iframe = $element.find('iframe')[0];
      expect(iframe.src.match(/autoplay=1/g));
    });

    it('should use the replace method by default', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      expect($element.html().match(/a href/g).length).toEqual(1);
      expect($element.html().match(/<div class=\"embed\">/g).length).toEqual(1);
    });

    it('should use the after method', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.method = 'after';
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" method=\"method\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      expect($element.html().match(/a href/g).length).toEqual(2);
      expect($element.html().match(/<div class=\"embed\">/g).length).toEqual(1);
    });

    it('should use the afterParent method', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.method = 'afterParent';
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" method=\"method\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      expect($element.html().match(/a href/g).length).toEqual(1);
      expect($element.html().match(/<div class=\"embed\">/g)).toBeNull();
    });

    it('should use the replaceParent method', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.method = 'replaceParent';
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" method=\"method\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      expect($element.html().match(/a href/g).length).toEqual(1);
      expect($element.html().match(/<div class=\"embed\">/g)).toBeNull();
    });

    it('should suppress styling on img', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?maxwidth=600&maxheight=400&key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.query = {maxwidth:600,maxheight:400};
      $rootScope.addImageStyles = false;
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" query=\"query\" add-image-styles=\"false\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      var imgStyle = $element.find('img')[0].style;
      var w = imgStyle.maxWidth;
      var h = imgStyle.maxHeight;
      expect(w).toEqual('');
      expect(h).toEqual('');
    });

    it('should use a wrapper element', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.wrapElement = 'section';
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" wrap-element=\"wrapElement\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      expect($element.find('section').length).toEqual(1);
    });

    it('should set a custom CSS class name to wrapper element', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.className = "my-embed";
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" class-name=\"className\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      expect($element.find('div')[0].className).toEqual('my-embed');
    });

    it('should use a custom display method', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.urls = ['http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg'];
      $rootScope.display = function() {
        this.style = this.imageStyle();
        var html = '<span>' + this.url + '</span>';
        this.$elem.replaceWith(html);
        this.$elem.triggerHandler('displayed', [this]);
      };
      $element = $compile("<div ng-embed-urls key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" display=\"display\" urls=\"urls\"></div>")($rootScope);
      $rootScope.$digest();
      $httpBackend.flush();
      expect($element.find('span').length).toEqual(1);
    });

    it('should not use a bad custom display request', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $rootScope.urls = ['http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg'];
      $rootScope.display = 'this is not a function';
      $element = $compile("<div ng-embed-urls key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" display=\"display\" urls=\"urls\"></div>")($rootScope);
      $rootScope.$digest();
      $httpBackend.flush();
      expect($element.html().match('<div class=\"embed\"').length).toEqual(1);
    });

    it('should split a group of URLs into batches for API requests', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg")
      .respond([photoResponse]);
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fwww.privateislandsonline.com%2Fcontent%2Flistings%2F245%2Fcimage_d05d567275-thumbb.jpg")
      .respond([photoResponse2]);
      $rootScope.batch = 1;
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" batch=\"batch\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a><a href=\"http://www.privateislandsonline.com/content/listings/245/cimage_d05d567275-thumbb.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      var imgs = $element.find('img');
      expect(imgs.length).toEqual(2);
      });

    it('should ignore a bad batch request', function() {
      $httpBackend.expectGET("http://api.embed.ly/1/oembed?key=7c14d0f2f67840cf9144b91f1b6d5002&urls=http%3A%2F%2Fstuffpoint.com%2Fpuppies%2Fimage%2F42977-puppies-cute-puppies-wallpaper.jpg,http%3A%2F%2Fwww.privateislandsonline.com%2Fcontent%2Flistings%2F245%2Fcimage_d05d567275-thumbb.jpg")
      .respond([photoResponse,photoResponse2]);
      $rootScope.batch = 'this is not a number';
      $element = $compile("<div ng-embedly key=\"'7c14d0f2f67840cf9144b91f1b6d5002'\" batch=\"batch\"><a href=\"http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg\"></a><a href=\"http://www.privateislandsonline.com/content/listings/245/cimage_d05d567275-thumbb.jpg\"></a></div>")($rootScope);
      $rootScope.$digest();
      $timeout.flush();
      $httpBackend.flush();
      var imgs = $element.find('img');
      expect(imgs.length).toEqual(2);
    });

    // Testing UTILS functions

    it('should check null or undefined with UTILS.none()', function() {
      var x = null;
      var y;
      var z = 5;
      expect(UTILS.none(x)).toBeTruthy();
      expect(UTILS.none(y)).toBeTruthy();
      expect(UTILS.none(z)).toBeFalsy();
    });

    it('should zip arrays with UTILS.zip()', function() {
      var params_one = [1, 3];
      var params_two = [2, 4, 5];
      var params_three;
      Array.prototype.map = undefined;
      var zipped = UTILS.zip([params_one, params_two]);
      expect(zipped).toEqual([[1,2], [3,4]]);
    });

    it('should handle zipping with an undefined object using UTILS.zip()', function() {
      var params_one = [1, 3];
      var params_two;
      Array.prototype.map = undefined;
      expect(function() {
        UTILS.zip([params_one, params_two]);
      }).toThrow(new TypeError(' this is null or not defined'));
    });

    it('should turn an object into a list with UTILS.listify()', function() {
      var x = 1;
      var y = { 'id': 'demo', 'message': 'test'};
      var z = null;
      var listX = UTILS.listify(x);
      var listY = UTILS.listify(y);
      var listZ = UTILS.listify(z);
      expect(angular.isArray(listX)).toBeTruthy();
      expect(angular.isArray(listY)).toBeTruthy();
      expect(listZ).toEqual([]);
    });

    it('should convert an object to a URL encoded query string with UTILS.objectToQueryString()', function() {
      var obj = {
        a: {
          one: 1,
          two: 2,
          three: 3
        },
        b: [ 1, 2, 3 ]
      };
      var objArr = ['one', 'two', 'three'];
      var encoded = UTILS.objectToQueryString(obj);
      var encodedArr = UTILS.objectToQueryString(objArr);
      expect(encoded).toEqual('a%5Bone%5D=1&a%5Btwo%5D=2&a%5Bthree%5D=3&b%5B%5D=1&b%5B%5D=2&b%5B%5D=3');
      expect(encodedArr).toEqual('0=one&1=two&2=three');
    });

    it('should convert an object to a URL encoded query string with UTILS.objectToQueryString()', function() {
      UTILS.buildParams('[]', ['[]'], function(){});
    });

    // Expected responses

    var photoResponse =
    {
      "provider_url": "http://stuffpoint.com",
      "height": 768,
      "width": 1024,
      "version": "1.0",
      "url": "http://stuffpoint.com/puppies/image/42977-puppies-cute-puppies-wallpaper.jpg",
      "provider_name": "Stuffpoint",
      "type": "photo"
    };

    var photoResponse2 =
    {
      "provider_url": "http://www.privateislandsonline.com",
      "height": 363,
      "width": 667,
      "version": "1.0",
      "url": "http://www.privateislandsonline.com/content/listings/245/cimage_d05d567275-thumbb.jpg",
      "provider_name": "Privateislandsonline",
      "type": "photo"
    };

    var youtubeResponse = 
    {
      "provider_url": "https://www.youtube.com/",
      "description": "Because Peter Dinklage. http://danbarham.com/dinklage/",
      "title": "Peter Dinklage Game of Thrones Theme Song",
      "url": "https://www.youtube.com/watch?v=DHlzIgSvnYc",
      "author_name": "Dan Barham",
      "height": 480,
      "thumbnail_width": 480,
      "width": 854,
      "html": "<iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FDHlzIgSvnYc%3Ffeature%3Doembed&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DDHlzIgSvnYc&image=https%3A%2F%2Fi1.ytimg.com%2Fvi%2FDHlzIgSvnYc%2Fhqdefault.jpg&key=858f6e6f8d2e46f0afe27fe0c4fcf27a&type=text%2Fhtml&schema=youtube\" width=\"854\" height=\"480\" scrolling=\"no\" frameborder=\"0\" allowfullscreen></iframe>",
      "author_url": "http://www.youtube.com/user/DanBarhamPhotography",
      "version": "1.0",
      "provider_name": "YouTube",
      "thumbnail_url": "https://i1.ytimg.com/vi/DHlzIgSvnYc/hqdefault.jpg",
      "type": "video",
      "thumbnail_height": 360
    };

    var youtubeAutoplay = 
    {
      "provider_url": "https://www.youtube.com/",
      "description": "Because Peter Dinklage. http://danbarham.com/dinklage/",
      "title": "Peter Dinklage Game of Thrones Theme Song",
      "url": "https://www.youtube.com/watch?v=DHlzIgSvnYc",
      "author_name": "Dan Barham",
      "height": 480,
      "thumbnail_width": 480,
      "width": 854,
      "html": "<iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FDHlzIgSvnYc%3Fautoplay%3D1%26feature%3Doembed&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DDHlzIgSvnYc&image=https%3A%2F%2Fi1.ytimg.com%2Fvi%2FDHlzIgSvnYc%2Fhqdefault.jpg&key=858f6e6f8d2e46f0afe27fe0c4fcf27a&autoplay=1&type=text%2Fhtml&schema=youtube\" width=\"854\" height=\"480\" scrolling=\"no\" frameborder=\"0\" allowfullscreen></iframe>",
      "author_url": "https://www.youtube.com/user/DanBarhamPhotography",
      "version": "1.0",
      "provider_name": "YouTube",
      "thumbnail_url": "https://i1.ytimg.com/vi/DHlzIgSvnYc/hqdefault.jpg",
      "type": "video",
      "thumbnail_height": 360
    };

    var vimeoResponse =
    {
      "provider_url": "https://vimeo.com/",
      "description": "The Christchurch Earthquake left the majority of its population devastated, but for a small group of homeless people, disaster brought about new and luxurious living opportunities - a taste of what it's like to live like a king. Director: Zoe McIntosh Loading Docs is a series of 10 incredible 3-minute documentaries from New Zealand.",
      "title": "Living Like Kings",
      "author_name": "Loading Docs",
      "height": 720,
      "thumbnail_width": 1280,
      "width": 1280,
      "html": "<iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=http%3A%2F%2Fplayer.vimeo.com%2Fvideo%2F96458672&src_secure=1&url=http%3A%2F%2Fvimeo.com%2F96458672&image=http%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F476633043_1280.jpg&key=858f6e6f8d2e46f0afe27fe0c4fcf27a&type=text%2Fhtml&schema=vimeo\" width=\"1280\" height=\"720\" scrolling=\"no\" frameborder=\"0\" allowfullscreen></iframe>",
      "author_url": "http://vimeo.com/loadingdocs",
      "version": "1.0",
      "provider_name": "Vimeo",
      "thumbnail_url": "http://i.vimeocdn.com/video/476633043_1280.jpg",
      "type": "video",
      "thumbnail_height": 720 
    };

    var facebookResponse = 
    {
        "provider_url": "https://www.facebook.com",
        "description": "Facebook is a social utility that connects people with friends and others who work, study and live around them. People use Facebook to keep up with...",
        "title": "Welcome to Facebook - Log In, Sign Up or Learn More",
        "url": "https://www.facebook.com/",
        "mean_alpha": 34922.3984615,
        "thumbnail_width": 325,
        "thumbnail_url": "https://www.facebook.com/images/fb_icon_325x325.png",
        "version": "1.0",
        "provider_name": "Facebook",
        "type": "link",
        "thumbnail_height": 325
    };

    var instagramResponse =
    {
      "provider_url": "http://instagram.com/",
      "description": "clemislove's video on Instagram",
      "title": "Instagram",
      "author_name": "clemislove",
      "height": 716,
      "thumbnail_width": 640,
      "width": 616,
      "html": "<iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=http%3A%2F%2Fvideos-h-18.ak.instagram.com%2Fhphotos-ak-xfp1%2F10541179_657998327610718_1773948269_n.mp4&src_secure=1&url=http%3A%2F%2Finstagram.com%2Fp%2FqSFCeiMS2Z%2F&image=http%3A%2F%2Fphotos-g.ak.instagram.com%2Fhphotos-ak-xfa1%2F10549708_1507736419444462_634752041_n.jpg&key=850bbdc0cdfa4d0eaa17006c0273c69e&type=video%2Fmp4&schema=instagram\" width=\"616\" height=\"716\" scrolling=\"no\" frameborder=\"0\" allowfullscreen></iframe>",
      "author_url": "http://instagram.com/clemislove",
      "version": "1.0",
      "provider_name": "Instagram",
      "thumbnail_url": "http://photos-g.ak.instagram.com/hphotos-ak-xfa1/10549708_1507736419444462_634752041_n.jpg",
      "type": "video",
      "thumbnail_height": 640
    };

    var extractResponse = 
    {
      "provider_url": "http://tumblr.com",
      "description": "We came, we saw, we hacked...along with an office full of excited hackers at DowncityJS in Providence, RI this past weekend. Huge thanks to Betaspring for hosting, Chris Meiklejohn of Basho and all the other sponsors.",
      "embeds": [ ],
      "safe": true,
      "provider_display": "blog.embed.ly",
      "related": [ ],
      "favicon_url": "http://37.media.tumblr.com/avatar_3629f4099658_128.png",
      "authors": [
      {
      "url": "http://blog.embed.ly",
      "name": "embedly"
      }
      ],
      "images": [
      {
      "caption": null,
      "url": "http://25.media.tumblr.com/avatar_3629f4099658_128.png",
      "height": 128,
      "width": 128,
      "colors": [
      {
      "color": [
      0,
      0,
      0
      ],
      "weight": 0.5126953125
      },
      {
      "color": [
      57,
      196,
      232
      ],
      "weight": 0.39306640625
      },
      {
      "color": [
      242,
      250,
      252
      ],
      "weight": 0.09423828125
      }
      ],
      "entropy": 1.32496068508,
      "size": 9952
      },
      {
      "caption": null,
      "url": "http://38.media.tumblr.com/avatar_16931f739401_96.png",
      "height": 96,
      "width": 96,
      "colors": [
      {
      "color": [
      1,
      7,
      11
      ],
      "weight": 0.485107421875
      },
      {
      "color": [
      0,
      131,
      214
      ],
      "weight": 0.224853515625
      },
      {
      "color": [
      53,
      168,
      236
      ],
      "weight": 0.160400390625
      },
      {
      "color": [
      239,
      247,
      252
      ],
      "weight": 0.083251953125
      },
      {
      "color": [
      144,
      205,
      239
      ],
      "weight": 0.04638671875
      }
      ],
      "entropy": 3.31525776668,
      "size": 11838
      }
      ],
      "cache_age": 20215,
      "language": "English",
      "app_links": [ ],
      "original_url": "http://blog.embed.ly/javascript-hackathon-downcityjs-betaspring",
      "url": "http://blog.embed.ly/post/45149859437/javascript-hackathon-downcityjs-betaspring",
      "media": { },
      "title": "DowncityJS Hackathon Recap",
      "offset": null,
      "lead": null,
      "content": "<div> <strong>We came, we saw, we hacked...along with an office full of excited hackers at </strong><strong>A great crowd came out on a chilly weekend to see what hackers from as far as DC could conjure up in a mere 24-hour JavaScript Hackathon. One of the standout projects, <a href=\"http://dtrejo.com/\">David Trejo </a> put together a simple and easy to use color identifier with some surprisingly useful features called Our own <a href=\"http://colorslice.dtrejo.com/\">Colorslice</a>. <a href=\"https://twitter.com/artgibby\">Art Gibson </a> created, Grillin Mah Bus, a real time feed which tracks social media interactions of people on a public transit bus. </strong> <strong>We provided our API for the event and some prizes for best use of our API as a solo participant and as a group, we were pleased with the outcome! </strong> <strong> in Providence, RI this past weekend. Huge thanks to <a href=\"http://betaspring.com/\">Betaspring</a> for hosting, <a href=\"https://twitter.com/cmeik\">Chris Meiklejohn</a> of <a href=\"http://basho.com/\">Basho</a> and all the other sponsors. </strong> <strong>Best Solo: Thom Nichols for <a href=\"https://github.com/tomstrummer\">Xirq.us </a>, they used Embedly to embed photos and media within curated tweets by the location they're near to let you know in one convenient spot what exactly is going on in an area. </strong> <strong>Best Design: Aaron and Aaron created Meet, a dating app that won't allow you to talk to your match before meeting up with them, it cuts to the chase by only providing the option to meet your match. </strong> <strong>Best Team: Ryan Laughlin, Liz Neu, and Kyle Nichols for <a href=\"http://thumbwar.me/\">Thumbwar </a>, which allows users to sync up with a friend over mobile, tablet or laptop connection to play a bundle of mini games with each other to pass the time or to unleash that competitive side if only for a few seconds. </strong> <strong><br>The bottom line is, we had a blast! The four of us, Art, Andy, Kawan and myself enjoyed an engaging and often silly weekend with some new friends and replenished our creativity tanks. Shout out to <a href=\"https://github.com/GabeLoins\">Gabe </a>, <a href=\"https://github.com/gilesvangruisen\">Giles </a>, <a href=\"https://github.com/SDooman\">Samuel </a>, <a href=\"https://github.com/gbc1230\">Graham </a>and <a href=\"https://github.com/vtran008\">Vinh</a> </strong><strong>of Cheer Me &#220;p </strong><strong>and <a href=\"https://github.com/LtCmdDudefellah\">Aaron </a>and <a href=\"https://github.com/aesnyder\">Aaron </a>for Meet. We're looking forward to seeing the real thing and will definitely be sending some pleasant messages to some unsuspecting mopes. <img src=\"https://lh3.googleusercontent.com/MaaMmP0N4psfPqQOUqegiz3q-SxnRd3sFn-XNKy92XLXo-R6dZIcFv7PkvgleeCqynGsUj4s9GUTnL__W77OpjmaTcBgis98nhudlkwsZp7-CNCqihX1zalDbQ\"></strong> <p><strong>Best use of our API: </strong> <strong>Cheer Me &#220;p, a service which allows you to send a friendly and uplifting message to someone having a tough time. They'll receive it with cat gifs and all, embedded from sites like Tumblr and Reddit using the Embedly API. </strong></p> </div>",
      "entities": [
      {
      "count": 4,
      "name": "Aaron"
      },
      {
      "count": 1,
      "name": "Vinh"
      },
      {
      "count": 1,
      "name": "Thom Nichols"
      },
      {
      "count": 1,
      "name": "David Trejo"
      },
      {
      "count": 1,
      "name": "Basho"
      },
      {
      "count": 1,
      "name": "Chris Meiklejohn"
      },
      {
      "count": 1,
      'name': "Gibson"
      },
      {
      "count": 1,
      "name": "Samuel"
      },
      {
      "count": 1,
      "name": "Providence"
      },
      {
      "count": 1,
      "name": "DC"
      },
      {
      "count": 1,
      "name": "Kawan"
      },
      {
      "count": 1,
      "name": "Tumblr"
      },
      {
      "count": 1,
      "name": "Giles"
      },
      {
      "count": 1,
      "name": "Grillin Mah Bus"
      },
      {
      "count": 1,
      "name": "Andy"
      },
      {
      "count": 1,
      "name": "Kyle Nichols"
      },
      {
      "count": 1,
      "name": "Reddit"
      },
      {
      "count": 1,
      "name": "Gabe"
      },
      {
      "count": 1,
      "name": "Graham"
      },
      {
      "count": 1,
      "name": "Liz Neu"
      },
      {
      "count": 1,
      "name": "Ryan Laughlin"
      }
      ],
      "favicon_colors": [
      {
      "color": [
      0,
      0,
      0
      ],
      "weight": 0.51318359375
      },
      {
      "color": [
      57,
      196,
      232
      ],
      "weight": 0.3857421875
      },
      {
      "color": [
      243,
      251,
      253
      ],
      "weight": 0.10107421875
      }
      ],
      "keywords": [
      {
      "score": 31,
      "name": "api"
      },
      {
      "score": 28,
      "name": "embedly"
      },
      {
      "score": 21,
      "name": "aaron"
      },
      {
      "score": 14,
      "name": "hackers"
      },
      {
      "score": 14,
      "name": "best"
      },
      {
      "score": 13,
      "name": "nichols"
      },
      {
      "score": 13,
      "name": "using"
      },
      {
      "score": 11,
      "name": "solo"
      },
      {
      "score": 11,
      "name": "meet"
      },
      {
      "score": 11,
      "name": "weekend"
      }
      ],
      "published": null,
      "provider_name": "Tumblr",
      "type": "html"
    };

  });

})();

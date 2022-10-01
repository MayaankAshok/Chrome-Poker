// Loaded into the page by content_script.js

// (function(open, send) {

//     // Closure/state var's
//     var xhrOpenRequestUrl;  // captured in open override/monkey patch
//     var xhrSendResponseUrl; // captured in send override/monkey patch
//     var responseData;       // captured in send override/monkey patch
 
//     //...overrides of the XHR open and send methods are now encapsulated within a closure
 
//     XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
//        xhrOpenRequestUrl = url;     // update request url, closure variable
//        console.log(url);
//        open.apply(this, arguments); // reset/reapply original open method
//     };
 
//     XMLHttpRequest.prototype.send = function(data) {
        
//        //...what ever code you need, i.e. capture response, etc.
//        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
//           xhrSendResponseUrl = this.responseURL;
//           responseData = this.data;  // now you have the data, JSON or whatever, hehehe!
//        }
//        send.apply(this, arguments); // reset/reapply original send method
//     }
 
//  })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send)

// setTimeout(function(){
    console.log(document)
    var scriptElements = document.getElementsByTagName('script');
    console.log(scriptElements)
    for (var i = 0; i < scriptElements.length; i++) {

        var curScriptBody = scriptElements[i].outerHTML;
        scriptElements[i].outerHTML = "<script> console.log(1); </script>";
        // console.log(scriptElements[i].outerHTML)
    }

// },0)
/*!
 * Ordr.in JavaScript Library Alpha
 * http://www.ordr.in
 *
 * Copyright 2011
 *
 * Last updated: Monday, Jun 27
 *
 * BIG OBJECT: ordrin.js
 *    Ordrin.r (restaurants)
 *      .o (order)
 *      .u (user)
 */

Ordrin = {
  _append: "", // what goes at the end of the query (callback, alternate HTTP methods, etc.)
  _apiMethod: "", // whether a reverse origin proxy or JSONP will be used to access API
  _site: "", // domain at which API instance is being run
  _key: "", // API developer key
  
  initialize: function(key, site, apiMethod) {
    // establish the developer key and site used
    if (!key) { this._error("Only GET requests allowed without an API key."); }
    if (!site) { this._error("Site must be provided for initialization."); }
    this._site = site;
    this._key = key;
    
    // and if API method specified, add JSONP to append (strung into end of all queries)
    if (apiMethod) {
      if(this._append) {
          this._append = this._append + "&jsonp=";
      } else {
        this._append = "?jsonp=";
      }
    } else { this._xmlhttp = new XMLHttpRequest(); } // if no API method specified, default to using reverse origin proxy methods
  },

  
  _apiRequest: function(api, request, func, params) {
    // string together all params
    var paramsURL = "";
    for (var i = 3; i < arguments.length; i++) {
      paramsURL = paramsURL + "/" + arguments[i];
      console.log(paramsURL);
    }
    
    // string together whole request
    console.log("api: " + api + ", request: " + request + ", paramsURL: " + paramsURL + ", Ordrin._append: " + Ordrin._append);
      
    if (this._xmlhttp) { // reverse origin proxy method
      var url = "http://" + this._site + "/" + request + paramsURL + Ordrin._append; // NEEDS HTTPS:// ADDED AFTER TESTING
      console.log("url: " + url);
      
      this._xmlhttp.onreadystatechange = function() { if(this.readyState==4 && this.status==200) { func(this.responseText); console.log("response: " + this.responseText);} };
      //this._xmlhttp.setRequestHeader("X-NAAMA-CLIENT-AUTHENTICATION, version="1");
      this._xmlhttp.open("GET",url,true);
      this._xmlhttp.send();
    } else {
      var url = "https://" + api + "-test.ordr.in/" + request + paramsURL + Ordrin._append + func;
      console.log("url: " + url);
      if(document.getElementById('jsonp')) { document.getElementById('jsonp').parentNode.removeChild(document.getElementById('jsonp')); } // clean up any previous scripts injected into head
      // script injection
      var s = document.createElement('script');
      s.src = url;
      s.type = 'text/javascript';
      s.id = "jsonp";
    
      if(document.getElementsByTagName('head').length > 0) document.getElementsByTagName('head')[0].appendChild(s);
    }
  },
  
  _objCheck: function(type, obj) {
    switch (type) {
      case "addr": if (!obj.street || !obj.city || !obj.zip) { this._error("Address must be provided and fully formed as Address object in API."); } break;
      case "dTime": if (Object.prototype.toString.call(obj) !== '[object Date]') { this._error("Date must be provided as Javascript's built-in Date object or ASAP."); } break;
      case "money": if (!obj.amount) { this._error("Money must be provided and fully formed as Money object in API."); } break;
    }
  },
  _error: function(msg) {
    console.log("Ordrin error: " + msg);
    alert("Ordrin error: " + msg);    
  },
  
  // Restaurant API
  r: {
    checkNums: /^\s*\d+\s*$/,
    
    deliveryList: function(dTime, addr, func) {
      // check integrity of objects
      Ordrin._objCheck("dTime", dTime);
      Ordrin._objCheck("addr", addr);
      
      // API request 
      Ordrin._apiRequest("r", "dl", func, dTime.ordrin_convertForAPI(), addr.ordrin_convertForAPI());
    },
    deliveryCheck: function(restID, dTime, addr, func) {
      // check integrity of objects
      Ordrin._objCheck("dTime", dTime);
      Ordrin._objCheck("addr", addr);
      if (!this.checkNums.test(restID)) { Ordrin._error("Restaurant ID must be numerical."); }
      
      // API request 
      Ordrin._apiRequest("r", "dc", func, restID, dTime.ordrin_convertForAPI(), addr.ordrin_convertForAPI());
    },
    deliveryFee: function(restID, subtotal, tip, dTime, addr, func) {
      // check integrity of objects
      Ordrin._objCheck("dTime", dTime);
      Ordrin._objCheck("addr", addr);
      Ordrin._objCheck("money", subtotal);
      Ordrin._objCheck("money", tip);
                       
      if (!this.checkNums.test(restID)) { Ordrin._error("Restaurant ID must be numerical."); }
      if (!this.checkNums.test(subtotal) || !this.checkNums.test(tip)) { Ordrin._error("Subtotal and tip must be numerical."); }
      
      // API request 
      Ordrin._apiRequest("r", "fee", func, restID, subtotal.ordrin_convertForAPI(), tip.ordrin_convertForAPI(), dTime.ordrin_convertForAPI(), addr.ordrin_convertForAPI());
    },
    details: function(restaurantID, func) {
      // check integrity of objects
      if (!this.checkNums.test(restaurantID)) { Ordrin._error("Restaurant ID must be numerical."); }
      
      // API request
      Ordrin._apiRequest("r", "rd", func, restaurantID);
    }
  },
  
  // Order API (incomplete)
  o: {
    submit: function(restaurantID, params) {
      // using a hidden form to submit the order via POST
      /* var form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", "https://o-test.ordr.in/o/" + restaurantID);
  
      // adding in all parameters for order form
      for(var key in params) {
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", params[key]);
  
          form._appendChild(hiddenField);
      }
  
      document.body._appendChild(form);
      form.submit();
      _error(""); */
      
      _apiRequest("jsonp", "o", restaurantID, params);
    }
  }
}
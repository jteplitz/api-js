/*!
 * Ordr.in JavaScript Library Alpha
 * http://www.ordr.in
 *
 * Copyright 2011
 *
 * Last updated: Tuesday, July 5
 *
 * BIG OBJECT: ordrin.js
 *    Ordrin.r (restaurants)
 *      .o (order)
 *      .u (user)
 */

Ordrin = {
  _apiMethod: "", // whether a reverse origin proxy or JSONP will be used to access API
  _site: "", // domain at which API instance is being run
  _key: "", // API developer key
  _errs: [], // error array pushed into and thrown at end of errors
  
  initialize: function(key, site, apiMethod) {
    // establish the developer key and site used
    if (!key) { this._errs.push(["connection", "API key required"]); }
    if (!site) { this._errs.push(["connection", "no site provided"]); }
    this._site = site;
    this._key = key;
    
    if (this._errs[0]) { throw this._errs; }
    
    // and if API method is not specified, default to XHR
    if (!apiMethod) { this._xmlhttp = new XMLHttpRequest(); } // if no API method specified, default to using reverse origin proxy methods
  },

  
  _apiRequest: function(api, request, func, params) {
      var paramsURL = "";
      var userAuth = 0;
      var outForm = [];
      var appends = [];
      
      if (!(this._key || this._site)) { this._errs.push(["connection", "API must be initialized before making any requests"]); }
      if (this._errs[0]) { throw this._errs; }
      
      console.log("current user: " + Ordrin.u.currEmail + ", current password: " + Ordrin.u.currPass);
      
      // string together all params for either submission
      for (var i = 3; i < arguments.length; i++) {
        if (!/[=]/.test(arguments[i])) {
          paramsURL = paramsURL + "/" + arguments[i]; 
          console.log(paramsURL);
        } else {
          outForm.push(arguments[i].split("="));
        }
      }

      // string together whole request
      console.log("api: " + api + ", request: " + request + ", paramsURL: " + paramsURL);
      
      if (this._xmlhttp) { // reverse origin proxy method
        var url = "http://" + this._site + "/" + request + paramsURL; // + Ordrin._append; // NEEDS HTTPS:// ADDED AFTER TESTING
        console.log("url: " + url);
        
        // set what kind of connection is being made based on API (user API split into a get and post component)
        switch (api) {
          case "r": this._xmlhttp.open("GET",url,true); break;
          case "o": this._xmlhttp.open("POST",url,true); break;
          case "uG": this._xmlhttp.open("GET",url,true); userAuth = 1; break;
          case "uP": this._xmlhttp.open("POST",url,true); userAuth = 1; break;
          case "uPu": this._xmlhttp.open("PUT",url,true); userAuth = 1; break;
          case "uD": this._xmlhttp.open("DELETE",url,true); userAuth = 1; break;
        }
        
        this._xmlhttp.onreadystatechange = function() { if(this.readyState==4 && this.status==200) { func(this.responseText); console.log("response: " + this.responseText);} };
        this._xmlhttp.setRequestHeader("X-NAAMA-CLIENT-AUTHENTICATION", 'id="' + this._key + '", version="1"');
        if (userAuth) {
          console.log('uri: /' + request + paramsURL)
          var hashcode = ordrin_SHA256(ordrin_SHA256(Ordrin.u.currPass) + Ordrin.u.currEmail + "/" + request + paramsURL);
          console.log("SHA pass: " + ordrin_SHA256(Ordrin.u.currPass));
          console.log("whole hash: " + hashcode);
          this._xmlhttp.setRequestHeader("X-NAAMA-AUTHENTICATION", 'username="' + Ordrin.u.currEmail + '", response="' + hashcode + '", version="1"');
        }
        this._xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        
        if(outForm) { this._xmlhttp.send(outForm); } else { this._xmlhttp.send(); }
      } else { 
        appends.push(["jsonp", func]);
        
        var cx = new Date();
        appends.push(["_cx", cx.getTime()]);
        
        switch (api) {
          case "uP": appends.push(["_method", "POST"]); api = "u"; break;
          case "uPu": appends.push(["_method", "PUT"]); api = "u"; break;
          case "uD": appends.push(["_method", "DELETE"]); api = "u"; break;
        }
    
        for (var i = 0; i < appends.length; i++) {
          appends[i] = appends[i].join("=");
        }
        
        for (var i = 0; i < outForm.length; i++) {
          outForm[i] = outForm[i].join("=");
        }
        
        var _append = "?" + appends.join("&") + "&" + outForm.join("&");
        
        //var url = "https://" + api + "-test.ordr.in/" + request + paramsURL + _append; 
        var url = "http://nn2.deasil.com/" + request + paramsURL + _append;
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
  
  // Restaurant API
  r: {
    checkNums: /^\s*\d+\s*$/,
    
    deliveryList: function(dTime, addr, func) {
      // check integrity of objects
      addr.validate();
      
      // API request 
      Ordrin._apiRequest("r", "dl", func, dTime.ordrin_convertForAPI(), addr.ordrin_convertForAPI("r"));
    },
    deliveryCheck: function(restID, dTime, addr, func) {
      // check integrity of objects
      addr.validate();
      if (!this.checkNums.test(restID)) { this._errs.push("validation", "restaurant ID must be provided and numerical"); }
      
      // API request 
      Ordrin._apiRequest("r", "dc", func, restID, dTime.ordrin_convertForAPI(), addr.ordrin_convertForAPI("r"));
    },
    deliveryFee: function(restID, subtotal, tip, dTime, addr, func) {
      // check integrity of objects
      addr.validate(); 
      if (!this.checkNums.test(restID)) { this._errs.push("validation", "restaurant ID must be provided and numerical"); }
            
      // API request 
      Ordrin._apiRequest("r", "fee", func, restID, subtotal.ordrin_convertForAPI(), tip.ordrin_convertForAPI(), dTime.ordrin_convertForAPI(), addr.ordrin_convertForAPI("r"));
    },
    details: function(restaurantID, func) {
      // check integrity of objects
      if (!this.checkNums.test(restaurantID)) { this._errs.push("validation", "restaurant ID must be provided and numerical"); }
      
      // API request
      Ordrin._apiRequest("r", "rd", func, restaurantID);
    }
  },
  
  // Order API (incomplete)
  o: {
    submit: function(restID, tray, tip, dTime, ccs) {
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
      form.submit();*/
      
      //_apiRequest("o", "o", restID, tray, tip, dTime.getMonth() + "-" + dTime.getDate(), dTime.get, user.firstName, user.lastName, user.addr.street, user.addr.city, user.addr.state, user.addr.zip, user.addr.phone, username/email, ccs_nameOnIt, ccs_number, ccs_expiry, ccs_billaddr.1, ccs_billaddr.2, ccs_city, ccs_state, ccs_zip);
    }
  },
  
  // User API 
  u: {
    currEmail: "",
    currPass: "",
    
    makeAcct: function(email, password, firstName, lastName, func) {
      Ordrin._apiRequest("uP", "u", func, email, "first_name=" + firstName, "last_name=" + lastName, "password=" + password); // password needs to be SHA encoded in later versions
    },
    setCurrAcct: function(email, password) {
      this.currEmail = email;
      this.currPass = password;
    },
    getAcct: function(func) {
      Ordrin._apiRequest("uG", "u", func, this.currEmail);
    },
    getAddress: function(nickname, func) {
      if (nickname) { Ordrin._apiRequest("uG", "u", func, this.currEmail, "addrs", nickname); } else { Ordrin._apiRequest("uG", "u", func, this.currEmail, "addrs"); }
    },
    updateAddress: function(addr, func) {
      addr.validate();
      Ordrin._apiRequest("uPu", "u", func, this.currEmail, "addrs", addr.nick, "addr=" + addr.street, "addr2=" + addr.street2, "city=" + addr.city, "state=" + addr.state, "zip=" + addr.zip, "phone=" + addr.phone);  
    },
    deleteAddress: function(nickname, func) {
      Ordrin._apiRequest("uD", "u", func, this.currEmail, "addrs", nickname);
    },
    getCard: function(nickname, func) {
      if (nickname) { Ordrin._apiRequest("uG", "u", func, this.currEmail, "ccs", nickname); } else { Ordrin._apiRequest("uG", "u", func, this.currEmail, "ccs"); }
    },
    updateCard: function(nickname, name, number, cvc, expiryMonth, expiryYear, addr, func) {   
      addr.validate();
      Ordrin._apiRequest("uPu", "u", func, this.currEmail, "ccs", nickname, "name=" + name, "number=" + number, "cvc=" + cvc, "expiry_month=" + expiryMonth, "expiry_year=" + expiryYear, "bill_addr=" + addr.street, "bill_addr2=" + addr.street2, "bill_city=" + addr.city, "bill_state=" + addr.state, "bill_zip=" + addr.zip);  
    },
    deleteCard: function(nickname, func) {
      Ordrin._apiRequest("uD", "u", func, this.currEmail, "ccs", nickname);
    },
    orderHistory: function(orderID, func) {
      if (orderID) { Ordrin._apiRequest("uG", "u", func, this.currEmail, "order", orderID); } else { Ordrin._apiRequest("uG", "u", func, this.currEmail, "orders"); }
    },
    updatePassword: function(password, func) {
      Ordrin._apiRequest("uPu", "u", func, this.currEmail, "password", "password=" + ordrin_SHA256(password));
      this.currPass = password;
    }
  }
}

/**
*
*  Secure Hash Algorithm (SHA256)
*  http://www.webtoolkit.info/
*
*  Original code by Angel Marin, Paul Johnston.
*
**/
 
function ordrin_SHA256(s){
	var chrsz   = 8;
	var hexcase = 0;
 
	function safe_add (x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}
 
	function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
	function R (X, n) { return ( X >>> n ); }
	function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
	function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
	function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
	function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
	function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
	function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
 
	function core_sha256 (m, l) {
		var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
		var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
		var W = new Array(64);
		var a, b, c, d, e, f, g, h, i, j;
		var T1, T2;
 
		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;
 
		for ( var i = 0; i<m.length; i+=16 ) {
			a = HASH[0];
			b = HASH[1];
			c = HASH[2];
			d = HASH[3];
			e = HASH[4];
			f = HASH[5];
			g = HASH[6];
			h = HASH[7];
 
			for ( var j = 0; j<64; j++) {
				if (j < 16) W[j] = m[j + i];
				else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
 
				T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
				T2 = safe_add(Sigma0256(a), Maj(a, b, c));
 
				h = g;
				g = f;
				f = e;
				e = safe_add(d, T1);
				d = c;
				c = b;
				b = a;
				a = safe_add(T1, T2);
			}
 
			HASH[0] = safe_add(a, HASH[0]);
			HASH[1] = safe_add(b, HASH[1]);
			HASH[2] = safe_add(c, HASH[2]);
			HASH[3] = safe_add(d, HASH[3]);
			HASH[4] = safe_add(e, HASH[4]);
			HASH[5] = safe_add(f, HASH[5]);
			HASH[6] = safe_add(g, HASH[6]);
			HASH[7] = safe_add(h, HASH[7]);
		}
		return HASH;
	}
 
	function str2binb (str) {
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < str.length * chrsz; i += chrsz) {
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
		}
		return bin;
	}
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	}
 
	function binb2hex (binarray) {
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
			hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
		}
		return str;
	}
 
	s = Utf8Encode(s);
	return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
 
}
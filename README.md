Ordr.in Javascript API
======================

A Javascript wrapper for the Restaurant, User, and Order APIs provided by Ordr.in.

Usage
-----

        Ordrin.initialize(api_developer_key, site_domain, [enable JSONP with 1 or true]);
        
        var time = new Date(); // uses Javascript's built-in Date object
        time.setASAP(); // overrides Date properties to ASAP
        var place = new Address(street, street2 [optional], city, zip, state [optional], phone [optional]);
	Address.checkZip();
	Address.checkPhone();
	Address.validate() // runs all checks
        
        var subtotal = new Money("100");
        var tip = new Money("15");
        
        Ordrin.r.deliveryList(time, place, callbackFunction);
        Ordrin.r.deliveryCheck(restaurantID, time.convert, place, callbackFunction);
        Ordrin.r.deliveryFee(restaurantID, subtotal, tip, time, place, callbackFunction);
        Ordrin.r.details(restaurantID, callbackFunction);

	Ordrin.u.makeAcct(email, password, firstName, lastName, callbackFunction);
	Ordrin.u.setCurrAcct(email, password, callbackFunction); // set user account currently in use or "logged in"
	Ordrin.u.getAcct(callbackFunction); // get details on current user
	Ordrin.u.getAddress(addressNickname, callbackFunction);
	Ordrin.u.updateAddress(address, callbackFunction); // Address must be passed using API's built-in Address object
	Ordrin.u.deleteAddress(addressNickname, callbackFunction);
	Ordrin.u.getCard(cardNickname, callbackFunction);
	Ordrin.u.updateCard(cardNickname, nameOnCard, cardNumber, cardSecurityCode, expiryMonth, expiryYear, billAddress, callbackFunction);
	Ordrin.u.deleteCard(cardNickname, callbackFunction);
	Ordrin.u.orderHistory(orderID, callbackFunction); // if orderID left blank, all previous orders returned; ID returns specific details of order
	Ordrin.u.updatePassword(newPassword, callbackFunction);


Notes
----- 
If JSONP is being used, the name of the callback function must be passed in quotation marks as a string and without parentheses.
In the case of a reverse origin proxy being used the callback function's name is not passed as a string; it is passed as a reference and also without parentheses.
		Ordrin.r.deliveryList(time, place, "callback_function");  // JSONP
		Ordrin.r.deliveryList(time, place, callback_function); // reverse origin proxy present
	
Order API in progress.
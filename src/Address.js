/*
 Address Component
*/

// step 1: create address object
  // CHECK: is zip ok? (digits and length 5)
  // CHECK: is city ok? (letters only)
  
// step 2: retrieve JSON data
  // CHECK: is address argument object Address?
  // CHECK: is Date argument object Date?

function Address(street, street2, city, zip, state, phone, nick) { // last three arguments optional w/ Restaurant API in particular
  // look at URL function to encode
  this.nick = nick;
  this.street = street.split(" ").join("+");
  if (street2) { this.street2 = street2.split(" ").join("+"); }
  this.city = city.split(" ").join("+");
  this.zip = zip;
  this.state = state;
  this.phone = phone;
  
  return true;
}

Address.prototype.validate = function() {
  var checkZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/; // regex for Canadian functionality (later to be added): /^[ABCEGHJKLMNPRSTVXY][0-9][A-Z][0-9][A-Z][0-9]$/
  if (!checkZip.test(this.zip)) { error("Invalid zip code; only digits (with total length of 5 or ZIP+4) allowed."); return false; }
  var checkPhone = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  if (!checkPhone.test(this.phone)) { error("Invalid U.S. phone number."); return false; }
  
  var checkLetters = /[A-Za-z]/;
  if (!checkLetters.test(this.city)) { error("Invalid city; only letters allowed."); return false; }
  var checkState = /^([A-Za-z]){2}$/
  if (!checkLetters.test(this.state)) { error("Invalid state; only letters allowed."); return false; }
  
  return true;
}

Address.prototype.ordrin_convertForAPI = function(API) {
  if (API == "r") { return this.zip + "/" + this.city + "/" + this.street; } else { return ""; }
}
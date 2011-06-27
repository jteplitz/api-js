/*
 Address Component
*/

// step 1: create address object
  // CHECK: is zip ok? (digits and length 5)
  // CHECK: is city ok? (letters only)
  
// step 2: retrieve JSON data
  // CHECK: is address argument object Address?
  // CHECK: is Date argument object Date?

function Address(zip, city, street, street2) {
  var checkZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  if (!checkZip.test(zip)) { error("Invalid zip code; only digits (with total length of 5 or ZIP+4) allowed."); return false; } 
  
  var checkCity = /[A-Za-z]/;
  if (!checkCity.test(city)) { error("Invalid city; only letters allowed."); return false; }
  
  // look at URL function to encode
  this.street = street.split(" ").join("+");
  if (street2) { this.street2 = street2.split(" ").join("+"); }
  this.city = city.split(" ").join("+");
  this.zip = zip;
  
  return true;
}

Address.prototype.ordrin_convertForAPI = function() {
  return this.zip + "/" + this.city + "/" + this.street;
}
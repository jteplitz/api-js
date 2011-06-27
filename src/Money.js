/*
 Money Component
 
 Currently just converts dollars to cents for API submission.
*/

function Money(amount) {
  var checkAmt = /^\s*\d+\s*$/;
  if (!checkAmt.test(amount)) { error("Money must be in numerical form."); } else { this.amount = amount; }

  return true;
}

Money.prototype.ordrin_convertForAPI = function() {
  return parseInt(this.amount) * 100;
}
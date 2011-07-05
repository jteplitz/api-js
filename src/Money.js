/*
 Money Component
 
 Currently just converts dollars to cents for API submission.
*/

function Money(amount) {
  var checkAmt = /^\s*\d+\s*$/;
  if (!checkAmt.test(amount)) { Ordrin._errs.push("validation", "money"); } else { this.amount = amount; }
}

Money.prototype.ordrin_convertForAPI = function() {
  return parseInt(this.amount) * 100;
}
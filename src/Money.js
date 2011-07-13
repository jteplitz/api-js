/*
 Money Component
 
 Currently just converts dollars to cents for API submission.
*/

function Money(amount) {
  if (isNaN(parseFloat(amount))) { Ordrin._errs.push("validation - money must be numerical"); } else { this.amount = amount; }
}

Money.prototype.ordrin_convertForAPI = function() {
  return parseFloat(this.amount) * 100;
}
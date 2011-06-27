/*
 DateTime Component: either "ASAP" or format [2 digit month]-[2 digit day]+[2 digit hours (24 hour clock):[2 digit minutes]
 
 Note: ALWAYS use local time!
*/

Date.prototype.ordrin_convertForAPI = function() {
  if (this.asap) { return "ASAP"; } else {
    var month = this.getMonth();
    var date = this.getDate();
    var hours = this.getHours();
    var mins = this.getMinutes();
    
    if (month < 10) { month = "0" + month; } 
    if (date < 10) { date = "0" + date; }
    if (hours < 10) { hours = "0" + hours; } 
    if (mins < 10) { mins = "0" + mins; }
    
    var datetime = month + "-" + date + "+" + hours + ":" + mins;
    return datetime;
  }
}

Date.prototype.setASAP = function() {
  this.asap = 1;
}
/*!
 * Ordr.in JavaScript Library Alpha
 * http://www.ordr.in
 *
 * Copyright 2011
 *
 * Date: Mon June 20 1PM
 * API key: iqR9QxyZ4BGaRMJBVL260g
 *
 * BIG OBJECT: ordrin
 *    ordrin.Restaurants.delList();
 *      .delCheck();
 *      .delFee();
 *      .details();
 *      
 */

// GLOBAL THINGS
function Address() {
  // addr, addr2 (for credit cards only?), city, state, zip
  // + validation
}

function Money() {
  
}

function creditCard() {
  // include own .Address + name, number, cvc, expir date
  // + validation
}


function Order() {
  // POST: /o/[restaurant id] and --
  // tray, tip, deliv date, deliv time, first name, last_name, addr(Address), credit card
}

function Restaurants(apiKey) {
  this.key = apiKey;
  
  this.delList = Restaurants_delList;
  this.delCheck = Restaurants_delCheck;
  this.delFee = Restaurants_delFee;
  this.details = Restaurants_details;
}

function Restaurants_delList(dateTime,postalCode,city,streetAddr) {
  // /dl/[datetime]/[postal code]/[city]/[street address]
}

function Restaurants_delCheck() {
  // /dc/[restaurant id]/[datetime]/[postal code]/[city]/[street address] 
}

function Restaurants_delFee() {
  // /fee/[restaurant id]/[subtotal]/[tip]/[datetime]/[postal code]/[city]/[street address]
}

function Restaurants_details() {
  // /rd/[restaurant id]
}
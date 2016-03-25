'use strict';

let fs = require('fs')
let req = require('sync-request')
const KEY = "AIzaSyDjU72FqvTF9iVJAeaBDak8Hovej9smr40"
const URL = "https://maps.googleapis.com/maps/api/geocode/json?"

let input = JSON.parse(fs.readFileSync('formatted.json', 'utf8'))
let getLocation = (el) => {
  let res = req('GET', URL + "address=" + el.address.formatted_address + "&key=" + KEY)
  let body = JSON.parse(res.getBody('utf8'))
  return body.results[0].geometry.location
}

input.forEach((el) => {el.location = getLocation(el)})
fs.writeFileSync("geo.json", JSON.stringify(input))

const fs = require('fs');
const request = require('sync-request');
const KEY = 'AIzaSyDjU72FqvTF9iVJAeaBDak8Hovej9smr40';
const URL = 'https://maps.googleapis.com/maps/api/geocode/json?';

const input = JSON.parse(fs.readFileSync('formatted.json', 'utf8'));
const getLocation = (el) => {
  const res = request('GET', `${URL}address=${el.address.formatted_address}&key=${KEY}`);
  const body = JSON.parse(res.getBody('utf8'));
  return body.results[0].geometry.location;
};

input.forEach((el) => {
  console.log(`Assigning Geolocation to ${el.name}`);
  el.location = getLocation(el);
});
fs.writeFileSync('final.json', JSON.stringify(input));

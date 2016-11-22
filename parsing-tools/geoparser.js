const fs = require('fs');
const config = require('../config');
const request = require('sync-request');
const KEY = config.maps.apiKey;
const URL = 'https://maps.googleapis.com/maps/api/geocode/json?';

const venues = JSON.parse(fs.readFileSync('formatted.json', 'utf8'));
const venueKeys = Object.keys(venues);

const getLocation = (venue) => {
  const res = request('GET', `${URL}address=${encodeURIComponent(venue.address.formatted_address)}&key=${KEY}`);
  const body = JSON.parse(res.getBody('utf8'));
  return body.results[0].geometry.location;
};
//
venueKeys.forEach((key) => {
  console.log(`Assigning Geolocation to ${venues[key].name}`);
  venues[key].location = getLocation(venues[key]);
});

fs.writeFile('final.json', JSON.stringify(venues));

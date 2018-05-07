const fs = require('fs');
const config = require('./config.js');
const request = require('sync-request');
const log = require('loglevel');
const APIKEY = config.maps.apiKey;
const APIURL = 'https://maps.googleapis.com/maps/api/geocode/json?';
const venues = JSON.parse(fs.readFileSync('formatted.json', 'utf8'));
const venueKeys = Object.keys(venues);

log.enableAll();

const getLocation = (venue) => {
  const res = request(
    'GET', `${APIURL}address=${encodeURIComponent(venue.address.formatted_address)}&key=${APIKEY}`
  );
  const body = JSON.parse(res.getBody('utf8'));
  if (body.results[0]) {
    return body.results[0].geometry.location;
  }
  return { lat: null, lng: null };
};

venueKeys.forEach((key) => {
  venues[key].location = getLocation(venues[key]);
  log.info(`Assigning Geolocation to ${venues[key].name.full}`);
});

fs.writeFile('final.json', JSON.stringify(venues));

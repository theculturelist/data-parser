// Pulls data from Fieldbook, parses it to JSON objects
const fs = require('fs');
const config = require('./config.js');
const Fieldbook = require('fieldbook-client');

const client = new Fieldbook(config.fieldbook);

const formatAddress = (el) => {
  if (el) {
    return `${el.street_number} ${el.route}, ${el.city}, ${el.state_short} ${el.postal_code}`;
  }
  return console.error(`Problem with ${el.name}`) //eslint-disable-line
};

const formatPhoneNumber = (phoneNumber) => {
  let phone;
  switch (phoneNumber) {
    case null:
      console.warn('Missing a Phone Number')  //eslint-disable-line
      return 'None';
    case 0:
      console.warn('Missing a Phone Number')  //eslint-disable-line
      return 'None';
    default:
      phone = phoneNumber.toString();
      return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6, 10)}`;
  }
};

const stripUrlPrefix = (string) => (
  string.split('/').pop()
);

const venueKeyMaker = (name) => (
  name.trim().replace(/[^A-Za-z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()
);

const objectMaker = (array) => {
  const newObject = {};
  array.map((item) => { if (item !== null) { newObject[item] = true; } return false; });
  return newObject;
};

const properName = (string) => {
  if (string !== null) {
    return true;
  }
  return false;
};

const buildObject = (el) => {
  const thumbnailPlaceholder = 'Placeholder-thumb_ahys1p.jpg';
  const widescreenPlaceholder = 'Placeholder-16x9_zpm4cq.jpg';
  const venueKey = venueKeyMaker(el.name);
  const venue = {
    [venueKey]: {
      address: {
        formatted_address: formatAddress(el),
        street_number: el.street_number,
        route: el.route,
        city: el.city,
        state: el.state,
        state_short: el.state_short,
        postal_code: el.postal_code,
      },
      admission: [
        { type: 'Adult', price: el.adult_1, note: el.adult_1_note },
        { type: 'Adult', price: el.adult_2, note: el.adult_2_note },
        { type: 'Seniors', price: el.seniors_1, note: el.seniors_1_note },
        { type: 'Seniors', price: el.seniors_2, note: el.seniors_2_note },
        { type: 'Students', price: el.students_1, note: el.students_1_note },
        { type: 'Students', price: el.students_2, note: el.students_2_note },
        { type: 'Children', price: el.children_1, note: el.children_1_note },
        { type: 'Children', price: el.children_2, note: el.children_2_note },
        { type: 'Children', price: el.children_3, note: el.children_3_note },
        { type: 'Disabled', price: el.disabled, note: el.disabled_note },
        { type: 'Military', price: el.military, note: el.military_note },
        { type: 'Other', price: el.other, note: el.other_note },
      ].filter((admission) => {
        if (admission.note !== 'NULL') { return admission; } return false;
      }),
      description: el.description,
      events: objectMaker([el.event_1, el.event_2, el.event_3, el.event_4]),
      free_days: el.free_days === null ? null : el.free_days,
      hours: {
        monday: el.monday,
        tuesday: el.tuesday,
        wednesday: el.wednesday,
        thursday: el.thursday,
        friday: el.friday,
        saturday: el.saturday,
        sunday: el.sunday,
        closed_on: el.closed_on === null ? null : el.closed_on,
      },
      id: venueKey,
      location: {},
      media: {
        thumbnail: el.image_thumbnail === null ?
          thumbnailPlaceholder : stripUrlPrefix(el.image_thumbnail),
        widescreen: el.image_widescreen === null ?
          widescreenPlaceholder : stripUrlPrefix(el.image_widescreen),
      },
      name: {
        abbreviation: el.abbreviation === null ? null : el.abbreviation,
        full: el.name,
        proper: properName(el.proper),
      },
      parking: el.parking === 0 ? null : el.parking,
      phone: formatPhoneNumber(el.phone_number),
      related_venues: objectMaker([el.related_1, el.related_2]),
      tags: objectMaker([el.tag_1, el.tag_2, el.tag_3, el.tag_4, el.tag_5]),
      website: el.website,
    },
  };
  return venue;
};

const writefileAsJson = (file, name) => {
  const f = JSON.stringify(file);
  fs.writeFileSync(`${name}.json`, f);
  console.log(`File written as ${name}.json`)  //eslint-disable-line
};

const originalVenues = {};

// client.list('venues').then(data => console.log(data));
client.list('venues')
  .then(data =>
    (data.forEach((venue) => {
      Object.assign(originalVenues, buildObject(venue));
    })
  ))
  .then(() => { writefileAsJson(originalVenues, 'formatted');})
  .catch(error => { console.log(`Error: ${error}`); }); //eslint-disable-line

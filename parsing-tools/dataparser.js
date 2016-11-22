// Pulls data from Fieldbook, parses it to JSON objects
const config = require('../config');
const fs = require('fs');
const Fieldbook = require('node-fieldbook');

const book = new Fieldbook({
  username: config.fieldbook.username,
  password: config.fieldbook.password,
  book: config.fieldbook.book,
});

const formatAddress = (el) => {
  if (el) {
    return `${el.street_number} ${el.route}, ${el.city}, ${el.state_short} ${el.postal_code}`;
  }
  return console.error(`Problem with ${el.name}`);
};

const formatPhoneNumber = (phoneNumber) => {
  let phone;
  switch (phoneNumber) {
    case null:
      console.warn('Missing a Phone Number');
      return 'None';
    case 0:
      console.warn('Missing a Phone Number');
      return 'None';
    default:
      phone = phoneNumber.toString();
      return `(${phone.substring(0, 3)})${phone.substring(3, 6)}-${phone.substring(6, 10)}`;
  }
};

const venueKeyMaker = (name) => {
  return name.trim().replace(/[^A-Za-z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
};

const buildObject = (el) => {
  const thumbnailPlaceholder = 'Placeholder-thumb_ahys1p.jpg';
  const widescreenPlaceholder = 'Placeholder-16x9_zpm4cq.jpg';
  const institutionKey = venueKeyMaker(el.name);
  const institution = {
    [institutionKey]: {
      name: el.name,
      abbreviation: el.abbreviation === null ? null : el.abbreviation,
      description: el.description,
      website: el.website,
      media: {
        thumbnail: el.image_thumbnail === null ? thumbnailPlaceholder : el.image_thumbnail,
        widescreen: el.image_widescreen === null ? widescreenPlaceholder : el.image_widescreen,
      },
      free_days: el.free_days === null ? null : el.free_days,
      address: {
        formatted_address: formatAddress(el),
        street_number: el.street_number,
        route: el.route,
        city: el.city,
        state: el.state,
        state_short: el.state_short,
        postal_code: el.postal_code,
      },
      location: {},
      related_venues: el.related_venues === null ? [] : [el.related_venues],
      phone: {
        main: formatPhoneNumber(el.phone_number),
      },
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
      ].filter((admission) => { if (admission.note !== 'NULL') { return admission; } return false; }),
      parking: el.parking === 0 ? null : el.parking,
      tags: [
        el.tag_1,
        el.tag_2,
        el.tag_3,
        el.tag_4,
        el.tag_5].filter((tag) => { if (tag !== null || 0) { return tag; } return false; }),
    },
  };
  return institution;
};

const writefileAsJson = (file, name) => {
  const f = JSON.stringify(file);
  fs.writeFileSync(`${name}.json`, f);
  console.log(`File written as ${name}.json`);
};

const originalVenues = {};

book.getSheet('venues')
  .then(data => {
    return data.forEach((venue) => { Object.assign(originalVenues, buildObject(venue)); });
  })
  .then(data => { writefileAsJson(originalVenues, 'formatted'); })
  .catch(error => { console.log(`Error: ${error}`); });

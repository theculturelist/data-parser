// Builds a json file from a specifically formatted CSV file.
const files = require('fs');
const inputFile = JSON.parse(files.readFileSync('input.json', 'utf8'));
const finalArray = [];

const getFormattedAddress = (el) => {
  if (el) {
    return `${el.street_number} ${el.route}, ${el.city}, ${el.state_short} ${el.postal_code}`;
  }
  return console.error(`Problem with ${el.name}`);
};

const getformattedPhoneNumber = (phoneNumber) => {
  if (phoneNumber === 0) {
    console.warning('Missing a Phone Number');
    return 'None';
  } else if (phoneNumber !== 0) {
    const phone = phoneNumber.toString();
    return `(${phone.substring(0, 3)})${phone.substring(3, 6)}-${phone.substring(6, 10)}`;
  }
  return console.error('Problem with a Phone Number');
};

const buildJSON = (el) => {
  const thumbnailPlaceholder = '/v1455314703/Placeholder-thumb_ahys1p.jpg';
  const widescreenPlaceholder = '/v1455314704/Placeholder-16x9_zpm4cq.jpg';
  const institution = {
    name: el.name,
    abbreviation: el.abbreviation === 0 || null ? null : el.abbreviation,
    description: el.description,
    website: `http://${el.website}`,
    media: {
      thumbnail: el.image_thumbnail === 0 || null ? thumbnailPlaceholder : el.image_thumbnail,
      widescreen: el.image_widescreen === 0 || null ? widescreenPlaceholder : el.image_widescreen,
    },
    free_days: el.free_days === 0 || null ? null : el.free_days,
    address: {
      formatted_address: getFormattedAddress(el),
      street_number: el.street_number,
      route: el.route,
      city: el.city,
      state: el.state,
      state_short: el.state_short,
      postal_code: el.postal_code,
    },
    location: {},
    phone: [{
      number: Number(el.phone_number),
      number_formatted: getformattedPhoneNumber(el.phone_number),
    }],
    hours: {
      monday: el.monday,
      tuesday: el.tuesday,
      wednesday: el.wednesday,
      thursday: el.thursday,
      friday: el.friday,
      saturday: el.saturday,
      sunday: el.sunday,
      closed_on: el.closed_on === 0 || null ? null : el.closed_on,
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
      el.tag_5].filter((tag) => { if (tag !== 'NULL' || 0) { return tag; } return false; }),
  };
  finalArray.push(institution);
};

inputFile.forEach(buildJSON);
console.log('Finished Building');
const finalFile = JSON.stringify(finalArray);
files.writeFileSync('formatted.json', finalFile);
console.log('File Writen as formatted.json');

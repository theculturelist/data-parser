'use strict';
let files = require('fs')
let inputFile = JSON.parse(files.readFileSync('input.json', 'utf8'))
let thumbnail_placeholder = 'http://res.cloudinary.com/theculturelist/image/upload/c_scale,q_61,w_250/v1455314703/Placeholder-thumb_ahys1p.jpg'
let widescreen_placeholder = 'http://res.cloudinary.com/theculturelist/image/upload/c_scale,q_60,w_800/v1455314704/Placeholder-16x9_zpm4cq.jpg'
let final = []

let buildJSON = (element) => {
  let institution = {
    name: element.name,
    abbreviation: element.abbreviation === 0 ? null : element.abbreviation,
    description: element.description,
    website: `http://${element.website}`,
    media: {
      thumbnail: element.image_thumbnail === 0 ? thumbnail_placeholder : element.image_thumbnail,
      widescreen: element.image_widescreen === 0 ? widescreen_placeholder : element.image_widescreen
    },
    free_days: element.free_days === 0 ? null : element.free_days,
    address: {
      formatted_address: `${element.street_number} ${element.route}, ${element.city}, ${element.state_short} ${element.postal_code}`,
      street_number: element.street_number,
      route: element.route,
      city: element.city,
      state: element.state,
      state_short: element.state_short,
      postal_code: element.postal_code
    },
    location: {},
    phone: [{
      line: "main",
      number: Number(element.phone_number),
      number_formatted: `(${element.phone_number.toString().substring(0,3)})${element.phone_number.toString().substring(3,6)}-${element.phone_number.toString().substring(6,10)}`
    }],
    hours: {
      monday: element.monday,
      tuesday: element.tuesday,
      wednesday: element.wednesday,
      thursday: element.thursday,
      friday: element.friday,
      saturday: element.saturday,
      sunday: element.sunday,
      closed_on: element.closed_on == 0 ? null : element.closed_on
    },
    admission: [
      {type: "Adult", price: element.adult_1, note: element.adult_1_note},
      {type: "Adult", price: element.adult_2, note: element.adult_2_note},
      {type: "Seniors", price: element.seniors_1, note: element.seniors_1_note},
      {type: "Seniors", price: element.seniors_2, note: element.seniors_2_note},
      {type: "Students", price: element.students_1, note: element.students_1_note},
      {type: "Students", price: element.students_2, note:element.students_2_note},
      {type: "Children", price: element.children_1, note:element.children_1_note},
      {type: "Children", price: element.children_2, note:element.children_2_note},
      {type: "Children", price: element.children_3, note:element.children_3_note},
      {type: "Disabled", price: element.disabled, note:element.disabled_note},
      {type: "Military", price: element.military, note:element.military_note},
      {type: "Other", price: element.other, note:element.other_note}
    ].filter((o) => { if (o.note !== "NULL") { return o } }),
    parking: element.parking,
    tags: [
      element.tag_1,
      element.tag_2,
      element.tag_3,
      element.tag_4,
      element.tag_5].filter((t) => { if (t !== "NULL" || 0) { return t } })
  }

  final.push(institution)
}

inputFile.forEach(buildJSON)
let finalFile = JSON.stringify(final)
files.writeFileSync("formatted.json", finalFile)

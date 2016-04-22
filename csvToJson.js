const files = require('fs');
const Converter = require('csvtojson').Converter;
const converter = new Converter();

files.createReadStream('./Institutions.csv').pipe(converter);

converter.on('end_parsed', (jsonArray) => {
  const finalFile = JSON.stringify(jsonArray);
  files.writeFileSync('input.json', finalFile);
  console.log('CSV Parsed to JSON');
});

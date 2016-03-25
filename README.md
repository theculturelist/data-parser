### The Culture List Data Converter

This converts a monolithic JSON file into the correct objects.

Currently:
- convert a CSV file from Excel to JSON with an external tool
- Paste that json into the `input.json` file
- run `node dataparser.js`
- run `node geoparser.js` to run the objects through googles location api
- it spits the results into file into `geo.json`
- manually copy paste `geo.json` to `institutions.json` and run a prettifier on it

TODO:

- make the whole thing automagic
- make the geoparser function async

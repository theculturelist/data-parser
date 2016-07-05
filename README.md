### The Culture List Data Converter

This converts a monolithic JSON file into the correct objects.

Current Workflow:
- convert a CSV file from Excel to JSON with an external tool
- Paste that json into the `input.json` file
- run `node dataparser.js`
- run `node geoparser.js` to run the objects through googles location API
- it spits the results into file into `geo.json`
- manually copy paste `geo.json` to institutions file in App

TODO:
- make csvToJson.js work correctly
- make the geoparser function async

### The Culture List Data Parser

Current Workflow:
- run `node dataparser.js` to pull in current data from Fieldbook
- dataparser.js writess to `formatted.json`
- run `node geoparser.js` to run the objects through googles location API
- it spits the results into file into `final.json`
- manually copy paste `final.json` to institutions file in App

TODO:
- make the geoparser function async

const https = require('https');
const csv = require('csv-parser');
const fs = require('fs');
var request = require('sync-request');
const axios = require('axios');

let pId = '7fd15e62915b9cf441818fff';

const configSearchPid = {
    method: 'get',
    url: `https://sandbox.healthgorilla.com/fhir/R4/Patient?given=Test&family=Medistics`,
    headers: {
        Authorization: 'Bearer cc18ad6818e079d65eca3da675497f02'
    },
};
axios(configSearchPid)
    .then(function (response) {
    console.log('resonse +++', response.status);
    console.log(JSON.stringify(response.data));
})
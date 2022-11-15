const https = require("https");
const csv = require("csv-parser");
const fs = require("fs");
const axios = require('axios');
const baseFileService = require('./baseFile');
const uploadFileService = require('./upload');

var request = require("sync-request");

const BASE_URL = 'https://sandbox.healthgorilla.com/fhir/';

const httpClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: 'Bearer ',
        'Content-Type': 'application/json'
    },
});

httpClient.interceptors.request.use((config) => {
    config.headers['Authorization'] = 'Bearer ';
    return config;
});
 
exports.handler = async function (event) {

  //Read all csv file data.
  let baseFileData = await baseFileService.readBaseFile();
  console.log("BaseFile Data "+baseFileData.length);
  
  //Insert all data.
  //let sendFileData = await uploadFileService.uploadFileData(baseFileData);

    for (let index = 0; index < baseFileData.length; index++) {
        //console.log("Data "+baseFileData[index]);
        
        try {
            
              const response = await axios.post(process.env.Post_Url, baseFileData[index], {
                headers: {
                    Authorization: 'Bearer '+process.env.Token,
                },
              });
              
              if (response.status == 201) {

                //console.log(response.headers);
                console.log(response.headers["x-request-id"]);
            
              }
            
        } catch (e) {
            console.log(e)
        }

    }
}
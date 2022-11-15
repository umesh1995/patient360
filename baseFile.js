const AWS = require('aws-sdk');
const fs = require('fs');
const papa = require("papaparse");
const request = require("request");
const { resolve } = require("dns");
const { rejects } = require("assert");
const options = {/* options */};
const S3 = new AWS.S3();
const params = {Bucket: process.env.Bucket_Name, Key: process.env.Key};

const readBaseFile = async function importData(){
  
const url = await S3.getSignedUrlPromise("getObject", params).catch((err) => {console.log("err "+err)});
//console.log("Url "+url);  
    
const parsePromise = new Promise((resolve, rejects) => {
    
const dataStream = request.get(url);
//const dataStream = fs.createReadStream("./report.csv");
const parseStream = papa.parse(papa.NODE_STREAM_INPUT, options);

dataStream.pipe(parseStream);

let data = [];
let header = [];
let count = 0;
parseStream.on("data", chunk => {
    if(count == 0){
        for (let index = 0; index < chunk.length; index++) {
            header.push(chunk[index]);
        }
    }else{

        let firstName = chunk[header.indexOf("First Name")];
        let lastName = chunk[header.indexOf("Last Name")];
        let gender = chunk[header.indexOf('Gender')].toLowerCase();
        let dob = new Date(chunk[header.indexOf('DOB')]).toISOString().split('T')[0];
        let street = chunk[header.indexOf('Address')];
        let city = chunk[header.indexOf('City')];
        let state = chunk[header.indexOf('State')];
        let zip = chunk[header.indexOf('Zip')];
        let phone = chunk[header.indexOf('Phone')]

        const fileRow = {
            name: { given: firstName, family: lastName },
            birthDate: dob,
            gender,
            address: {
                line: [street],
                city,
                state,
                postalCode: zip,
            },
            telecom: {
                system: 'phone',
                value: phone,
            },
            resourceType: 'Patient',
        };
        data.push(fileRow);
    }

    count++;
    
});

parseStream.on("finish", () => {
    // console.log(data);
    // console.log(data.length);
    resolve(data);
});

    });
    return parsePromise.then((data) =>{
        return data;
    })
};

module.exports.readBaseFile = readBaseFile;
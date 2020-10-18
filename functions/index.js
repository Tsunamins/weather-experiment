const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

//firestore
const admin = require('firebase-admin');
admin.initializeApp();

//express
const express = require('express');
const app = express();

//cors
const cors = require('cors')({origin: true});
app.use(cors);

//axios
const axios = require('axios');

//env
require('dotenv').config();
require('dotenv').config({path: '../.env'})




app.get('/', (req, res) => {
    const date = new Date();

    res.send(`
      <!doctype html>
      <head>
        <title>Weather</title>
      </head>
      <body>
        <p>A Weather Experiment, a page for example:
          <span id="date">${date}</span></p>
        <button onClick="refresh(this)">Refresh</button>
      </body>
    </html>`);
  });


  app.get('/miamiweather', (req, res) => {
    const key = process.env.API_KEY
    let data = '';

    const config = {
      method: 'get',
      url: `http://api.weatherapi.com/v1/current.json?key=${key}&q=Miami`,
      headers: { 
        'Content-Type': 'application/json'
      }
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.json({weather: response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
    
  });

  exports.app = functions.https.onRequest(app);


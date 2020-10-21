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

//fetch
const fetch = require('node-fetch');

  //env
require('dotenv').config({path: '../.env'})



//as in http://localhost:5001/weather-experiment-e343d/us-central1/app
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

// as in : http://localhost:5001/weather-experiment-e343d/us-central1/app/miamiweather
  app.get('/miamiweather', async (req, res) => {
    const key = process.env.API_KEY
 
    const weather_response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${key}&q=Miami`)
    const weather_data = await weather_response.json()

    
      const temp = weather_data.current.temp_f
      const wind_speed = weather_data.current.wind_mph
      const wind_direction = weather_data.current.wind_dir
      const localtime = weather_data.location.localtime
      const localtime_e = weather_data.location.localtime_epoch

      const data = {
        temp: temp,
        wind_speed: wind_speed,
        wind_direction: wind_direction,
        localtime: localtime,
        localtime_e: localtime_e
      }
     
        // write to specific document next
        // next create route or function to retrieve data from a specific document
        const writeResult = await admin.firestore().collection('weather').doc("current").set({
            temp: temp,
            wind_speed: wind_speed,
            wind_direction: wind_direction,
            localtime: localtime,
            localtime_e: localtime_e
        });


        res.json({result: `data: ${writeResult} added.`});

    
  });

  exports.app = functions.https.onRequest(app);


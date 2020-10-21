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
      console.log(localtime_e)

      //this isn't needed just for reference point, remove later or maybe use for comparisons
      const data = {
        temp: temp,
        wind_speed: wind_speed,
        wind_direction: wind_direction,
        localtime: localtime,
        localtime_e: localtime_e
      }

      // get existing data, will prob want ot move to a separate file
      // Note: best to create collection/document in the firestore 
      // emulator/admin first to retrieve properly due to function of set()
      const weatherRef = admin.firestore().collection('weather').doc('current');
      const doc = await weatherRef.get();
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
      }

      //check if any updates have occured, in this example checking value of localtime_e
      if(data.localtime_e === doc.data().localtime_e){
        console.log("no change")
      } else {
        console.log("change")
        console.log("old: ", data.localtime_e )
        console.log("new: ", doc.data().localtime_e)
      }


      // so next would be, in the event there is a change
      // would want to find the change, in this case I'll just call some other endpoint
      // in the weather api
      // take the 'updated records'/the alternative endpoint and route them to the DOM
      // parallel idea would be to on a detected change, find the changed/new records in officeR
      // once those records were identified, idea would be to process data for salesforce
      // call salesforce auth and update/create records by whatever means
      // as example for now create a route 
      

    
      
     
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


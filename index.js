import express from "express";
import axios from "axios";
import dotenv from "dotenv"

dotenv.config();

const app = express()
const port = 3000;

let currentWeatherData = []
const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.post("/forecast", async (req, res) => {
    let forecastIndex = parseInt(req.body["day"]);
    let templateData = {...currentWeatherData[forecastIndex]};

    console.log(templateData);
    res.render("new-day.ejs", { data: templateData });
});

app.post("/location", async (req, res) => {
    let latLng = req.body["latLng"];

    const API_KEY = process.env.WEATHER_API_KEY;
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latLng}&days=3&aqi=yes&alerts=no`;

    try {
        let result = await axios.get(API_URL);
        let data = result.data;

        currentWeatherData = [];
        pushWeatherData(req.body["locMain"], req.body["locSecondary"], data["current"], currentWeatherData);
        
        data["forecast"]["forecastday"].forEach(day => {
            pushWeatherData(req.body["locMain"], req.body["locSecondary"], day["day"], currentWeatherData);
        });

        let templateData = {...currentWeatherData[0]};

        for (let i = 0; i < currentWeatherData.length; i++) {            
            templateData[`${i+1}T`] = currentWeatherData[i].temperature;
            templateData[`${i}D`] = weekday[(new Date().getDay() + i) % 7];
        }

        res.render("new-data.ejs", { data: templateData });
    } catch (error) {
        console.log(error);
    }
});

app.post("/autocomplete", async (req, res) => {
    const limit = 5;
    const API_KEY = process.env.GEOAPIFY_API_KEY;
    const BASE_URL = "https://api.geoapify.com/v1/geocode/search"
    const PARAMS = `?text=${encodeURIComponent(req.body["text"])}&lang=en&limit=${limit}&format=json&apiKey=${API_KEY}`;

    try {
        let result = await axios.get(BASE_URL + PARAMS);
        res.json(result.data);
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


function WeatherObjectGenerator(main, secondary, conditionCode, temperature, windSpeed, humidity, aqiIndex, pm2) {
    this.main = main;
    this.secondary = secondary;
    this.condition = getConditionString(conditionCode);
    this.temperature = Math.round(temperature);
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.aqiRating = getAQIRating(aqiIndex);
    this.pm2 = pm2.toFixed(2);
};

const pushWeatherData = (main, secondary, data, weatherList) => {
    let suffixAvg = "avg";
    let suffixMax = "max";

    if (data["temp_c"]) {
        suffixAvg = "";
        suffixMax = "";
    }

    weatherList.push(new WeatherObjectGenerator(
        main, 
        secondary,
        data["condition"]["code"],
        data[`${suffixAvg}temp_c`],
        data[`${suffixMax}wind_kph`],
        data[`${suffixAvg}humidity`],
        data["air_quality"]["us-epa-index"],
        data["air_quality"]["pm2_5"]
    ));
};

const getConditionString = (conditionCode) => {
    return "Mist";
};

const getAQIRating = (aqiIndex) => {
    return "Good";
};

// [
//     1000, 1003, 1006, 1009, 1030, 1063,
//     1066, 1069, 1072, 1087, 1114, 1117,
//     1135, 1147, 1150, 1153, 1168, 1171,
//     1180, 1183, 1186, 1189, 1192, 1195,
//     1198, 1201, 1204, 1207, 1210, 1213,
//     1216, 1219, 1222, 1225, 1237, 1240,
//     1243, 1246, 1249, 1252, 1255, 1258,
//     1261, 1264, 1273, 1276, 1279, 1282
//   ]
  
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
    this.aqiColor = getAQIColor(aqiIndex);
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
    return conditionJSON.find((condition) => condition.code === conditionCode).condition;
};

const getAQIRating = (aqiIndex) => {
    switch (aqiIndex) {
        case 1:
            return "Good";
            break;
        case 2:
             return "Moderate";
            break;
        case 3:
            return "Unhealthy for sensitive";
            break;
        case 4:
            return "Unhealthy";
            break;
        case 5:
            return "Very Unhealthy";
            break;
        case 6:
            return "Hazardous";
            break;
    }
};

const getAQIColor = (aqiIndex) => {
    switch (aqiIndex) {
        case 1:
            return "green";
            break;
        case 2:
             return "yellow";
            break;
        case 3:
            return "orange";
            break;
        case 4:
            return "red";
            break;
        case 5:
            return "purple";
            break;
        case 6:
            return "maroon";
            break;
    }
}

let conditionJSON = [
    { code: 1000, condition: 'Clear' },
    { code: 1003, condition: 'Partly cloudy' },
    { code: 1006, condition: 'Cloudy' },
    { code: 1009, condition: 'Overcast' },
    { code: 1030, condition: 'Mist' },
    { code: 1063, condition: 'Patchy rain' },
    { code: 1066, condition: 'Patchy snow' },
    { code: 1069, condition: 'Patchy sleet' },
    { code: 1072, condition: 'Patchy freezing drizzle' },
    { code: 1087, condition: 'Thundery outbreaks' },
    { code: 1114, condition: 'Blowing snow' },
    { code: 1117, condition: 'Blizzard' },
    { code: 1135, condition: 'Fog' },
    { code: 1147, condition: 'Freezing fog' },
    { code: 1150, condition: 'Patchy light drizzle' },
    { code: 1153, condition: 'Light drizzle' },
    { code: 1168, condition: 'Freezing drizzle' },
    { code: 1171, condition: 'Heavy freezing drizzle' },
    { code: 1180, condition: 'Patchy light rain' },
    { code: 1183, condition: 'Light rain' },
    { code: 1186, condition: 'Moderate rain' },
    { code: 1189, condition: 'Moderate rain' },
    { code: 1192, condition: 'Heavy rain' },
    { code: 1195, condition: 'Heavy rain' },
    { code: 1198, condition: 'Light freezing rain' },
    { code: 1201, condition: 'Moderate freezing rain' },
    { code: 1204, condition: 'Light sleet' },
    { code: 1207, condition: 'Moderate sleet' },
    { code: 1210, condition: 'Patchy light snow' },
    { code: 1213, condition: 'Light snow' },
    { code: 1216, condition: 'Patchy moderate snow' },
    { code: 1219, condition: 'Moderate snow' },
    { code: 1222, condition: 'Patchy heavy snow' },
    { code: 1225, condition: 'Heavy snow' },
    { code: 1237, condition: 'Ice pellets' },
    { code: 1240, condition: 'Light rain shower' },
    { code: 1243, condition: 'Moderate rain shower' },
    { code: 1246, condition: 'Torrential rain shower' },
    { code: 1249, condition: 'Light sleet showers' },
    { code: 1252, condition: 'Moderate sleet showers' },
    { code: 1255, condition: 'Light snow showers' },
    { code: 1258, condition: 'Moderate snow showers' },
    { code: 1261, condition: 'Light showers of ice pellets' },
    { code: 1264, condition: 'Moderate showers of ice pellets' },
    { code: 1273, condition: 'Patchy light rain' },
    { code: 1276, condition: 'Moderate rain with thunder' },
    { code: 1279, condition: 'Patchy light snow' },
    { code: 1282, condition: 'Moderate snow' }
]
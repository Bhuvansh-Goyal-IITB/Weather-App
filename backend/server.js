import express from "express"
import axios from "axios"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = 3000

app.use(cors({origin: "https://weather-app-au0t.onrender.com"}))
app.use(express.urlencoded({extended: false}))

app.post("/weather", async (req, res) => {
    if (!parseFloat(req.body["lat"])) return

    const BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
    try {

        let result = await axios.get(BASE_URL, {
            params: {
                lat: req.body["lat"],
                lon: req.body["lon"],
                units: "metric",
                appid: process.env.OPENWEATHER_API_KEY
            }
        })

        res.json(result.data)
    } catch (error) {
        console.log(error)
    }
})

app.post("/aqi", async (req, res) => {
    if (!parseFloat(req.body["lat"])) return

    const BASE_URL = "https://api.openweathermap.org/data/2.5/air_pollution"
    try {

        let result = await axios.get(BASE_URL, {
            params: {
                lat: req.body["lat"],
                lon: req.body["lon"],
                appid: process.env.OPENWEATHER_API_KEY
            }
        })

        res.json(result.data)
    } catch (error) {
        console.log(error)
    }
})

app.post("/autocomplete", async (req, res) => {
    if (req.body["text"] === null) return
    
    const BASE_URL = "https://api.geoapify.com/v1/geocode/search"
 
    try {
        let result = await axios.get(BASE_URL, {
            params: {
                text: req.body["text"],
                lang: "en",
                limit: 5,
                format: "json",
                apiKey: process.env.GEOAPIFY_API_KEY
            }
        })
        res.json(result.data)
    } catch (error) {
        res.status(500)
        console.log(error)
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
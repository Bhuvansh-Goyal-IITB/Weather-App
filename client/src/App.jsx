import { useEffect, useLayoutEffect, useState } from "react"
import Aqi from "./components/Aqi"
import Container from "./components/Container"
import Location from "./components/Location"
import Searchbar from "./components/Searchbar"
import Weather from "./components/Weather"
import { fetchAqiData, fetchWeatherData, aqiObject } from "./api/utility"
import Loader from "./components/Loader"


const loadNewLocationData = async (data, setData, setLoading, setLoadText) => {
  let [lat, lon, main, secondary] = data

  let weatherData = await fetchWeatherData(lat, lon)
  let aqiData = await fetchAqiData(lat, lon)

  if (weatherData === null || aqiData === null) setLoadText("Error connecting to backend")

  setData({
    temp: parseInt(weatherData["main"]["temp"]),
    condition: weatherData["weather"][0]["main"],
    wind: parseInt(weatherData["wind"]["speed"]),
    humidity: parseInt(weatherData["main"]["humidity"]),
    place: main,
    country: secondary,
    aqi: aqiObject[parseInt(aqiData["list"][0]["main"]["aqi"])]
  })

  setLoading(false)
}

function App() {
  const [loadText, setLoadText] = useState("Search for a location")
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [weatherData, setWeatherData] = useState({})
  
  useEffect(() => {
    setLoadText("Loading...")
    setIsLoading(true)
    loadNewLocationData(data, setWeatherData, setIsLoading, setLoadText)
  }, [data])

  useEffect(() => {
    setLoadText("Search for a location")
  }, [])

  return (
    <div className="flex flex-col gap-3 justify-center items-center bg-slate-800 w-full h-screen">
      <Searchbar 
        setData={setData}
      />
      <Container>
        {isLoading ? <Loader text={loadText} /> : (
          <>
            <Weather 
              temp={weatherData.temp}
              condition={weatherData.condition ?? "Mist"}
              wind={weatherData.wind ?? "13"}
              humidity={weatherData.humidity ?? "70"}
            />
            <Location 
              place={weatherData.place ?? "Powai"}
              country={weatherData.country ?? "India"}
            />      
            <Aqi
              aqiCondition={weatherData.aqi?.condition ?? "Good"}
              color={weatherData.aqi?.color ?? "green"}
            />
          </>
        )}
        
      </Container>
    </div>
  )
}

export default App

import { useEffect, useLayoutEffect, useState } from "react"
import Aqi from "./components/Aqi"
import Container from "./components/Container"
import Location from "./components/Location"
import Searchbar from "./components/Searchbar"
import Weather from "./components/Weather"
import { fetchAqiData, fetchWeatherData, aqiObject } from "./api/utility"
import Loader from "./components/Loader"


const loadNewLocationData = async (data, setData, setLoading) => {
  let [lat, lon, main, secondary] = data

  let weatherData = await fetchWeatherData(lat, lon)
  let aqiData = await fetchAqiData(lat, lon)

  setData({
    temp: parseInt(weatherData["main"]["temp"]),
    condition: weatherData["weather"][0]["main"],
    wind: parseInt(weatherData["wind"]["speed"]),
    humidity: parseInt(weatherData["main"]["humidity"]),
    place: main,
    country: secondary,
    aqi: aqiObject[parseInt(aqiData["list"][0]["main"]["aqi"])]
  })

  console.log(lat)

  setLoading(false)
}

function App() {
  const [isLoading, setIsLoading] = useState(null)
  const [data, setData] = useState([])
  const [weatherData, setWeatherData] = useState({})

  useEffect(() => {
    setIsLoading(true)
    loadNewLocationData(data, setWeatherData, setIsLoading)
  }, [data])

  useEffect(() => {
    setIsLoading(null)
  }, [])

  return (
    <div className="flex flex-col gap-3 justify-center items-center bg-slate-800 w-full h-screen">
      <Searchbar 
        setData={setData}
      />
      <Container>
        {(isLoading===null || isLoading) ? <Loader firstTime= {isLoading === null} /> : (
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

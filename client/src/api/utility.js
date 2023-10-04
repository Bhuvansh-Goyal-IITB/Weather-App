const fetchWeatherData = async (lat, lon) => {
    try {
        let reqData = new URLSearchParams()
        reqData.append("lat", lat)
        reqData.append("lon", lon)

        const result = await fetch("http://localhost:3000/weather", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: reqData.toString()
        });

        return result.json()
    } catch (error) {
        console.log(error)
        return null
    }
}

const fetchAqiData = async (lat, lon) => {
    try {
        let reqData = new URLSearchParams()
        reqData.append("lat", lat)
        reqData.append("lon", lon)

        const result = await fetch("http://localhost:3000/aqi", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: reqData.toString()
        });

        return result.json()
    } catch (error) {
        console.log(error)
        return null
    }
}

const fetchAutocompleteResults = async (location) => {
    if (location.length < 3) return []

    try {
        let reqData = new URLSearchParams()
        reqData.append("text", location)

        const result = await fetch("http://localhost:3000/autocomplete", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: reqData.toString()
        });

        return result.json()
    } catch (error) {
        console.log(error)
        return null
    }
}

const displayTextToSend = (formattedAddress) => {
    let parts = formattedAddress.split(",").map((part) => {
        return part.trim();
    });

    let main = parts[0].split("-").map((part) => {
        return part.trim();
    })[0];
    let secondary = parts.at(-1);

    return [main, secondary];
};

const debounce = (callback, delay) => {
    let prevTimer
    
    return (...args) => {
        clearTimeout(prevTimer)
        prevTimer = setTimeout(() => {
            callback(...args)
        }, delay)
    }
}

const aqiObject = {
    1: {
      condition: "Good",
      color: "green"
    },
    2: {
      condition: "Fair",
      color: "yellow"
    },
    3: {
      condition: "Moderate",
      color: "orange"
    },
    4: {
      condition: "Poor",
      color: "red"
    },
    5: {
      condition: "Very Poor",
      color: "purple"
    }
  }

export {
    fetchAutocompleteResults, 
    displayTextToSend, 
    debounce,
    fetchWeatherData,
    fetchAqiData,
    aqiObject
}
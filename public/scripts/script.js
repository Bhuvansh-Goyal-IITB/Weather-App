const input = document.querySelector("input#locSearch");
const dropDownContainer = document.querySelector(".dropdown-menu");

document.addEventListener("click", (e) => {
    if (e.target === dropDownContainer || e.target.parentElement === dropDownContainer) return;
    if (e.target != input) hideDropDown(dropDownContainer);
});


input.addEventListener("focus", (e) => {
    if (e.target.value.length >= 3) {
        showDropDown(dropDownContainer);
    }
});

input.addEventListener("input", async (e) => {
    if (e.target.value.length < 3) {
        hideDropDown(dropDownContainer);
        return;
    }

    clearDropDown(dropDownContainer);
    showDropDown(dropDownContainer);

    try {
        let reqData = new URLSearchParams();
        reqData.append("text", e.target.value);

        const result = await fetch("/autocomplete", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: reqData.toString()
        });

        let data = await result.json();

        data["results"].forEach(place => {
            let newDiv = divCreator(place.formatted);
            newDiv.addEventListener("click", (e) => {
                input.blur();
                input.value = "";
                hideDropDown(dropDownContainer);

                let displayText = displayTextToSend(place.formatted)
                updatePageLocation(`${place.lat},${place.lon}`, displayText[0], displayText[1]);
            });
            newDiv.id = `${place.lat},${place.lon},${displayTextToSend(place.formatted)}`;
            dropDownContainer.appendChild(newDiv);
        });

        // let testing = []
        // for (let index = 0; index < 5; index++) {
        //     testing[index] = 0;
        // }

        // testing.forEach(place => {
        //     let newDiv = divCreator("Indian Institute of Technology Bombay, Powai, Mumbai - 400076, MH, India");
        //     newDiv.addEventListener("click", (e) => {
        //         input.blur();
        //         input.value = "";
        //         hideDropDown(dropDownContainer);

        //         updatePageLocation("19.13,72.92", "Powai", "India");
        //     });
        //     dropDownContainer.appendChild(newDiv);
        // });
    } catch (error) {
        console.log(error);
    }
});

const forecastCardUI = () => {
    let forecastCards = Array.from(document.querySelectorAll(".forecast-card"));
    let currentCard = forecastCards.find((card) => {
        return card.classList.contains("selected")
    });

    forecastCards.forEach((card) => {
        card.addEventListener("click", (e) => {
            if (e.target == currentCard) return;
            else {
                currentCard.classList.remove("selected");
                currentCard = e.target;
                currentCard.classList.add("selected");

                loadForecastData(4);
            }
        });
    });
}

forecastCardUI();

const loadForecastData = async (forecastIndex) => {
    // load data for different dates
}


const updatePageLocation = async (latLng, locMain, locSecondary) => {
    try {
        let data = new URLSearchParams();
        data.append("latLng", latLng);
        data.append("locMain", locMain);
        data.append("locSecondary", locSecondary);

        let result = await fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: data.toString()
        });

        let html = await result.text();
        document.querySelector(".container").innerHTML = html;
        
        forecastCardUI();
    } catch (error) {
        console.log(error);
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

const divCreator = (content) => {
    let div = document.createElement("div");
    div.innerHTML = content;
    div.classList.add("dropdown-item");
    return div;
};  

const clearDropDown = (dropDownContainer) => {
    while (dropDownContainer.firstChild) {
        dropDownContainer.removeChild(dropDownContainer.firstChild);
    }
};

const showDropDown = (dropDownContainer) => {
    dropDownContainer.classList.add("active");
};

const hideDropDown = (dropDownContainer) => {
    dropDownContainer.classList.remove("active");
};
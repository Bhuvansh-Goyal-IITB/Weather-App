import { useEffect, useId, useState } from "react"
import Dropdown from "./Dropdown"
import DropdownItem from "./DropdownItem"
import { debounce } from "../api/utility"
import { fetchAutocompleteResults } from "../api/utility"
import uniqid from "uniqid"

const fetchAutocompleteDebounce = debounce(async (location, setAutocomplete) => {
    let data = await fetchAutocompleteResults(location)
    setAutocomplete(data["results"] ?? [])
}, 200)

function Searchbar({setData}) {

    const [location, setLocation] = useState("")
    const [isVisible, setIsVisible] = useState(false)
    const [autoComplete, setAutocomplete] = useState([])

    useEffect(() => {
        fetchAutocompleteDebounce(location, setAutocomplete)
    }, [location])

    useEffect(() => {
        const input = document.getElementById("search")
        document.addEventListener("click", (e) => {
            if (!e.target.classList.contains("dropdown-item") && e.target.tagName != "INPUT") {
                setIsVisible(false)
            }
        })
        input.addEventListener("focusin", (e) => {
            setIsVisible(true)
        })
    })

    return (
        <div className="relative">
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="text-xl px-4 font-appfont bg-slate-200 rounded-sm shadow-sm p-2 placeholder:text-opacity-80 outline-none mb-5" type="text" name="" id="search" placeholder="Location" />
            <Dropdown
                isVisible={isVisible}
            >
                {autoComplete.map((result) => (
                    <DropdownItem 
                        key={uniqid()}
                        setData={setData}
                        id={uniqid()}
                        location={result.formatted}
                        lat={result.lat}
                        long={result.lon}
                        userInput={location}
                        setInput={setLocation}
                    />
                ))}
            </Dropdown>
        </div>
    )
} 

export default Searchbar
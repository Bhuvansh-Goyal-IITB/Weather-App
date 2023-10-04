import { useEffect } from "react"
import { displayTextToSend } from "../api/utility"

function DropdownItem({location, userInput, id, lat, long, setData, setInput}) {

    useEffect(() => {
        const item = document.getElementById(String(id))
        
        let index = location.toLowerCase().search(userInput.toLowerCase())

        let finalOutput = null

        if (index > -1) {
            finalOutput = ""
            finalOutput += location.substring(0, index)
            finalOutput += `<strong>${location.substring(index, index + userInput.length)}</strong>`
            finalOutput += location.slice(index + userInput.length)
        }

        item.innerHTML = finalOutput || location
    }, [userInput])

    const handleClick = (e) => {
        setData([lat, long, ...displayTextToSend(location)])
        setInput("")
    }

    return (
        <>
            <div id={id} onClick={handleClick} className="dropdown-item text-left hover:bg-slate-900 hover:text-white p-2 pl-3">{location}</div>
        </>
    )
}

export default DropdownItem
import { useEffect, useState } from "react"

function Dropdown({children, isVisible}) {

    return (
        <>
            <div className={`overflow-hidden absolute z-10 shadow-md w-full top-12 bg-slate-300 rounded-sm transition-all dropdown ${isVisible ? "show" : ""}`} id="dropdown">
                {children}
            </div>
        </>
    )
} 

export default Dropdown
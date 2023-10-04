function Weather({temp, condition, humidity, wind}) {
    return (
        <div className="cursor-default grid grid-cols-3 grid-rows-2 bg-slate-200 shadow-md rounded-md p-2 hover:scale-[1.01] transition-all">
            <div className="text-4xl text-center pb-0 p-2 col-span-2">{condition}</div>
            <div className="text-4xl row-span-2 flex justify-center items-center px-2">{temp}<span>°C</span></div>
            <div className="flex gap-5 p-1 justify-center items-center col-span-2">
                <div className="flex gap-1"><p><i className="fa-solid fa-droplet"></i></p><p>{humidity}%</p></div>
                <div className="flex gap-1"><p><i className="fa-solid fa-wind"></i></p><p>{wind} <span>km/h</span></p></div>
            </div>
        </div>
    )
}

export default Weather
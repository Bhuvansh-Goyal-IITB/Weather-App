function Aqi({aqiCondition, color}) {
    return (
        <div className={`${color} rounded-md shadow-md flex flex-col justify-center items-center text-xl p-2 py-4 hover:scale-[1.01] hover:cursor-default transition-all`}>
            <div className="text-3xl">Air Quality</div>
            <div className="text-slate-700">{aqiCondition}</div>
        </div>
    )
}

export default Aqi
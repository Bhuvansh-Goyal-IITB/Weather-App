function Location({place, country}) {
    return (
        <div className="bg-slate-900 text-white col-start-2 row-span-full rounded-md shadow-md p-4 hover:scale-[1.01] hover:cursor-default transition-all h-full">
            <div className="text-5xl">{place}</div>
            <div className="text-3xl">{country}</div>
        </div>
    )
}

export default Location
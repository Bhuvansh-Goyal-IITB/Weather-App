function Loader({firstTime}) {
    return (
        <>
            <div className="row-span-full col-span-full text-2xl px-20 py-10">
                {firstTime ? "Search for a location" : "Loading..."}
            </div>
        </>
    )
}

export default Loader
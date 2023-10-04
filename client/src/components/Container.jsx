function Container({children}) {
    return (
        <div className="grid grid-rows-2 grid-cols-2 gap-2 font-appfont bg-slate-300 p-2 rounded-md">
            {children}
        </div>
    )
}

export default Container
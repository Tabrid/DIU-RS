

function BatteryStatus() {
    const data = Array.from({ length: 6 }, (_, index) => index + 1);
  return (
    <div className="p-2">
            <h1 className="text-xl font-semibold text-center my-3 ">Battery Status</h1>
            <div className="grid grid-cols-3 gap-10">
                {data.map((item) => (
                   <div key={item} className="  bg-base-100 shadow-xl flex p-2">
                   <div className="w-1/2 radial-progress text-xl flex flex-col justify-center items-center text-cyan-600" style={{ "--value": "70", "--size": "12rem", "--thickness": "5px" }} role="progressbar"><h1>70%</h1> <h1>Battery Status</h1></div>
                   <div className="card-body w-1/2">
                     <h2 className="card-title">Vehicle No: 0{item}</h2>
                     <p>Battery Health : Good</p>

                   </div>
                 </div>
                ))}
            </div>
    </div>
  )
}

export default BatteryStatus
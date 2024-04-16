
function GetOffer() {
  return (
    <div className="flex justify-center items-center min-h-screen">

      <div className=" grid grid-cols-2 gap-16 ">
        <div className="btn w-48 h-36 bg-slate-400 flex flex-col shadow-2xl">
          <h1 className="font-semibold text-2xl">DAILY</h1>
          <h1 className="capitalize">package</h1>
        </div>
        <div className="btn w-48 h-36 bg-slate-400 flex flex-col shadow-2xl">
          <h1 className="font-semibold text-2xl">WEEKLY</h1>
          <h1 className="capitalize">package</h1>
        </div>
        <div className="btn w-48 h-36 bg-slate-400 flex flex-col shadow-2xl">
          <h1 className="font-semibold text-2xl">15 DAYS</h1>
          <h1 className="capitalize">package</h1>
        </div>
        <div className="btn w-48 h-36 bg-slate-400 flex flex-col shadow-2xl">
          <h1 className="font-semibold text-2xl">MONTHLY</h1>
          <h1 className="capitalize">package</h1>
        </div>
      </div>

    </div>
  )
}

export default GetOffer
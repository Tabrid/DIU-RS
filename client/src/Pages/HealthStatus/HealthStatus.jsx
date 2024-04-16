


const HealthStatus = () => {

    return (
        <div className='flex justify-center mt-10'>
            <div className="grid grid-cols-2 gap-10"><div className="radial-progress text-xl flex flex-col justify-center items-center text-orange-600" style={{ "--value": "70", "--size": "12rem", "--thickness": "5px" }} role="progressbar"><h1>70F</h1> <h1>Heart Rate</h1></div>
                <div className="radial-progress text-xl flex flex-col justify-center items-center text-red-700" style={{ "--value": "70", "--size": "12rem", "--thickness": "5px" }} role="progressbar"><h1>70F</h1> <h1>Heart Rate</h1></div>
                <div className="radial-progress text-xl flex flex-col justify-center items-center text-cyan-600" style={{ "--value": "70", "--size": "12rem", "--thickness": "5px" }} role="progressbar"><h1>70F</h1> <h1>Heart Rate</h1></div></div>
        </div>
    )
}

export default HealthStatus;

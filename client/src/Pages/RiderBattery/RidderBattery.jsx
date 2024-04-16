

const RidderBattery = () => {
    return (
        <div className="flex justify-center items-center my-10">
             <div className="  bg-base-100 shadow-xl flex justify-center  p-10">
                   <div className="w-48 h-48"><div className="w-full h-full radial-progress text-xl flex flex-col justify-center items-center text-cyan-600" style={{ "--value": "70", "--size": "12rem", "--thickness": "5px" }} role="progressbar"><h1>70%</h1> <h1>Battery Status</h1></div></div>
                   <div className="card-body w-1/2">
                     <strong>Battery Health : Good</strong>
                    <strong>Charging Status : charging</strong>
                    <strong>Charging Time : 2 hours</strong>
                    <strong>Charging Station : 2</strong>
                   </div>
                 </div>
        </div>
    );
};

export default RidderBattery;
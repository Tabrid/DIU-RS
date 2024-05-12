import ReactApexChart from 'react-apexcharts';

const RidderBattery = () => {
  // Assuming dates is an array of objects with `x` and `y` properties


  

  return (
    <div className="flex-col flex justify-center items-center my-10">
      <div className=" grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-5"> <iframe
      width="450"
      height="260"
      style={{ border: '1px solid #cccccc' }}
      src="https://thingspeak.com/channels/2525591/widgets/851440"
      allowFullScreen
      title="ThingSpeak Widget"
    ></iframe>
     <iframe
      width="450"
      height="260"
      style={{ border: '1px solid #cccccc' }}
      src="https://thingspeak.com/channels/2525591/widgets/851441"
      allowFullScreen
      title="ThingSpeak Widget 2"
    ></iframe></div>
      <div className="   flex justify-center  p-10">

        <div className=" w-full flex gap-5 lg:flex-row flex-col">
          <div className="border border-gray-300 rounded-md p-4 mb-4 w-48 h-24 bg-red-300">
            <strong className="block mb-2">Battery Health:</strong>
            <span>Good</span>
          </div>
          <div className="border border-gray-300 rounded-md p-4 mb-4 w-48 h-24 bg-orange-300">
            <strong className="block mb-2">Charging Status:</strong>
            <span>charging</span>
          </div>
          <div className="border border-gray-100 rounded-md p-4 mb-4 w-48 h-24 bg-amber-300">
            <strong className="block mb-2">Charging Time:</strong>
            <span>2 hours</span>
          </div>
          <div className="border border-gray-300 rounded-md p-4 w-48 h-24 bg-emerald-300">
            <strong className="block mb-2">Charging Station:</strong>
            <span>2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RidderBattery;
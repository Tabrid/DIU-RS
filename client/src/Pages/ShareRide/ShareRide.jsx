import { useEffect, useRef, useState } from 'react';
import Map, { Layer, Marker, Source } from 'react-map-gl';

import "mapbox-gl/dist/mapbox-gl.css";
import toast from 'react-hot-toast';
function ShareRide() {
  const [riderData, setRiderData] = useState(null);
  const [selected, setSelected] = useState(null);
  const mapRef = useRef();
  const [viewport, setViewport] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  const mapboxAccessToken = "pk.eyJ1Ijoicml5YWRoMTgxMCIsImEiOiJjbHVmdzZtNXUwbm1tMmxvZXgxbTZkZTBzIn0.ZKL7nnBAQryksHFvmNl3YQ";
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setViewport({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    })
  }, [])

  useEffect(() => {
    fetch("/api/users/riders")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRiderData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [source, setSource] = useState('')
  const [sourceChange, setSourceChange] = useState(false)
  const [destinationChange, setDestinationChange] = useState(false)
  const [addressList, setAddressList] = useState([]);
  const [destination, setDistination] = useState('');
  const [sourceCoordinates, setSourceCoordinates] = useState({});
  const [destinationCoordinates, setDestinationCoordinates] = useState({});
  const [directionData, setDirectionData] = useState(null);
  const [pointData, setPointData] = useState(null);
  const [showSit, setShowSit] = useState(false);
  const [availableSit, setAvailableSit] = useState(0);
  const [rider, setRider] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [fare,setfare] = useState(null);

  // Function to handle click on a seat
  const handleSeatClick = (seat) => {
    // Check if the seat is already selected
    const isSeatSelected = selectedSeats.includes(seat);
    // Toggle selection state
    if (isSeatSelected) {
      // Remove seat from selectedSeats if already selected
      setSelectedSeats(selectedSeats.filter(selectedSeat => selectedSeat !== seat));
    } else {
      // Add seat to selectedSeats if not selected
      setSelectedSeats([...selectedSeats, seat]);
    }
  };
  const handleRouteClick = (index) => {
    setSelectedRoute(index);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAddressList()
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [source, destination]);


  const getAddressList = async () => {
    setAddressList([]);
    const query = sourceChange ? source : destination;
    console.log(query);
    const res = await fetch(`/api/data/address?q=${query}`, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    const result = await res.json();
    console.log(result);
    setAddressList(result)

  }

  const onSourceAddressClick = async (item) => {
    setSource(item.location_name);
    setAddressList([]);
    setSourceChange(false);

    try {

      setSourceCoordinates({
        lng: item.longitude,
        lat: item.latitude,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const onDestinationAddressClick = async (item) => {
    setDistination(item.location_name);
    setAddressList([]);
    setDestinationChange(false);
    try {

      setDestinationCoordinates({
        lat: item.latitude,
        lng: item.longitude
        ,
        // lng: result.features[0].geometry.coordinates[0],
        // lat: result.features[0].geometry.coordinates[1],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (sourceCoordinates) {
      mapRef.current?.flyTo({
        center: [sourceCoordinates.lng, sourceCoordinates.lat],
        duration: 2500,
      });
    }
  }, [sourceCoordinates]);

  useEffect(() => {
    if (destinationCoordinates) {
      mapRef.current?.flyTo({
        center: [destinationCoordinates.lng, destinationCoordinates.lat],
        duration: 2500,
      });
    }
    
  }, [destinationCoordinates]);

  const getDirectionRoute = async () => {
    const formData = {
      point1: source,
      point2: destination,
      routes: selectedRoute,
      map:selected

    }
    console.log(formData);
    try {
      const response = await fetch('https://diu-rs.onrender.com/api/findRoute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch direction route');
      }

      const data = await response.json();
      console.log(data);
      setDirectionData(data.coordinates);
      setPointData(data.points);
      setfare(data.fair)
      // setDistance(data.shortestRoute.distance);
      // Handle success, such as showing a success message or redirecting
    } catch (error) {
      console.error('Error fetching direction route:', error);
     
      // Handle errors, such as showing an error message to the user
    }
  };
  const onRiderClick = async (id) => {
    setSelectedItem(id === selectedItem ? null : id);
    setShowSit(true);
    setRider(id);
    fetch(`/api/users/riders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableSit(data);
        console.log(data.availableSit[0].sit);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  const Payment = async () => {
    const type = 'share';
    const order = {
      rider: rider,
      startLocationName: source,
      endLocationName: destination,
      startLocation: sourceCoordinates,
      endLocation: destinationCoordinates,
      directionData: directionData,
      type: type,
      selectedSeats:selectedSeats,
      fare:fare
    }
      console.log(order);
    try {
      const response = await fetch("/api/data/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      window.location.replace(data.url);
    } catch (error) {
      console.error("Fetch error:", error);
      // Handle the error here, e.g., display a message to the user
    }
  }


  return (
    <div className="lg:px-20 px-[0px]">
      <div className="hero min-h-screen ">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className='lg:w-1/2 w-full'>
            {
              viewport.lat && viewport.lng ? <Map
                className='relative'
                ref={mapRef}
                mapboxAccessToken={mapboxAccessToken}
                initialViewState={{
                  longitude: viewport.lng,
                  latitude: viewport.lat,
                  zoom: 14
                }}
                style={{ width: 400, height: 400 }}
                mapStyle="mapbox://styles/riyadh1810/cluis3e8e000z01pb18gi58iu"
              >
                <Marker
                  longitude={viewport.lng}
                  latitude={viewport.lat}
                  anchor="bottom" >
                  <span className="label-text">my location</span>
                  <img src="./pin.png"
                    className='w-10 h-10'
                  />
                </Marker>
                {
                  sourceCoordinates.lat && sourceCoordinates.lng ? <Marker
                    longitude={sourceCoordinates.lng}
                    latitude={sourceCoordinates.lat}
                    anchor="bottom" >
                    <span className="label-text">start</span>
                    <img src="./pin.png"
                      className='w-10 h-10'
                    />
                  </Marker> : null
                }
                {
                  destinationCoordinates.lat && destinationCoordinates.lng ? <Marker
                    longitude={destinationCoordinates.lng}
                    latitude={destinationCoordinates.lat}
                    anchor="bottom" >
                    <span className="label-text">destination</span>
                    <img src="./pin.png"
                      className='w-10 h-10'
                    />
                  </Marker> : null
                }
                {directionData ? (
                  <Source type="geojson" data={{
                    type: 'Feature', geometry:
                      { type: 'LineString', coordinates: directionData }
                  }}>
                    <Layer
                      type="line"
                      layout={{ 'line-join': 'round', 'line-cap': 'square' }}
                      paint={{ 'line-color': '#0462d4', 'line-width': 4 }}
                    />
                  </Source>
                ) : null}
                {
                  pointData ? pointData?.map((item, index) => (
                    <Marker
                      key={index}
                      longitude={item.longitude}
                      latitude={item.latitude}
                      anchor="bottom" >
                      <img src="./pin.png"
                        className='w-10 h-10'
                      />
                    </Marker>
                  )) : null
                }




              </Map> : null
            }
            {
              fare&& selectedSeats ? <div className='text-center absolute'>
                <h2 className='text-2xl font-bold'>fare:{fare * selectedSeats.length}tk</h2>
                
              </div> : null
            }
          </div>
          <div className='lg:w-1/2 w-full'>
            <div className=''>
              <div className='relative'>
                <label className='text-gray-400 text-[13px]'>Where From?</label>
                <input type="text"
                  className='bg-white p-1 
                border-[1px] w-full 
                rounded-md outline-none
                focus:border-yellow-300 text-[14px]'
                  value={source}
                  onChange={(e) => {
                    setSource(e.target.value);
                    setSourceChange(true);
                    setDestinationChange(false)
                  }}
                />

                {addressList && sourceChange ?
                  <div className='shadow-md p-1 rounded-md
            absolute w-full bg-white z-20'>
                    {addressList?.map((item, index) => (
                      <h2 key={index} className='p-3 hover:bg-gray-100
                cursor-pointer'
                        onClick={() => { onSourceAddressClick(item) }}
                      >{item.location_name} </h2>
                    ))}
                  </div> : null}
              </div>
              <div className='relative'>
                <label className='text-gray-400 text-[13px]'>Where To?</label>
                <input type="text"
                  className='bg-white p-1 
                border-[1px] w-full 
                rounded-md outline-none
                focus:border-yellow-300 text-[14px]'
                  value={destination}
                  onChange={(e) => { setDistination(e.target.value); setDestinationChange(true); setSourceChange(false) }}
                />

                {addressList && destinationChange ?
                  <div className='shadow-md p-1 rounded-md
            absolute w-full bg-white'>
                    {addressList?.map((item, index) => (
                      <h2 key={index} className='p-3 hover:bg-gray-100
                cursor-pointer'
                        onClick={() => { onDestinationAddressClick(item) }}
                      >{item.location_name}</h2>
                    ))}
                  </div> : null}


              </div>
            </div>
            <div className='flex gap-3 my-5'>
              <div
                className={`p-3 cursor-pointer border border-black rounded-md ${selectedRoute === 1 ? 'bg-blue-500' : ''}`}
                onClick={() => handleRouteClick(1)}
              >
                Routes 1
              </div>
              <div
                className={`p-3 cursor-pointer border border-black rounded-md ${selectedRoute === 2 ? 'bg-blue-500' : ''}`}
                onClick={() => handleRouteClick(2)}
              >
                Routes 2
              </div>
              <div
                className={`p-3 cursor-pointer border border-black rounded-md ${selectedRoute === 3 ? 'bg-blue-500' : ''}`}
                onClick={() => handleRouteClick(3)}
              >
                Routes 3
              </div>
            </div>
            <div className='flex gap-3'>
              <div
                className={`p-3 w-1/2 text-center border border-black rounded-md ${selected === 'forward' ? 'bg-blue-500' : ''
                  }`}
                onClick={() => {setSelected('forward') }}
              >
                Forward
              </div>
              <div
                className={`p-3 w-1/2 text-center border border-black rounded-md ${selected === 'back' ? 'bg-blue-500' : ''
                  }`}
                onClick={() => {setSelected('back')}}
              >
                Back
              </div>
            </div>
            <div className='w-full p-3 border border-black rounded-md text-center mt-3 cursor-pointer' onClick={getDirectionRoute}>
              Get Direction
            </div>
            <div className=''>
              <div className='grid grid-cols-3 gap-10'>
                {riderData?.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      onRiderClick(item._id);
                    }}
                    className={`btn w-24 h-36 p-3 border-[1px] border-gray-200 my-2 rounded-md ${selectedItem === item._id ? 'bg-blue-500 hover:bg-blue-500 text-white' : ''
                      }`}
                  >
                    <img src='https://i.ibb.co/b1vHnHL/image.png' className='w-20 h-20' />
                    
                  </div>
                ))}
              </div>

              {
                showSit && availableSit ? (
                  <div className='p-3 border-[1px] border-gray-200 my-2 rounded-md grid grid-cols-2 gap-3'>
                    <div
                      className={`p-3 w-full text-center border border-black rounded-md ${selectedSeats.includes('01') ? 'bg-blue-500' : ''
                        } ${availableSit.availableSit[0].available === false ? 'cursor-not-allowed' : '' } `}
                      onClick={() => handleSeatClick('01')}
                    >
                      Seat 1
                    </div>
                    <div
                      className={`cursor-not-allowed p-3 w-full  border border-black rounded-md flex justify-center `}

                    >
                      <img className='w-7 h-7' src="https://i.ibb.co/CvXpckN/image.png" alt="" />
                    </div>
                    <div
                      className={`p-3 w-full text-center border border-black rounded-md ${selectedSeats.includes('02') ? 'bg-blue-500' : ''
                        } ${availableSit.availableSit[1].available === false ? 'cursor-not-allowed' : '' }`}
                      onClick={() => handleSeatClick('02')}
                    >
                      Seat 2
                    </div>
                    <div
                      className={`p-3 w-full text-center border border-black rounded-md ${selectedSeats.includes('03') ? 'bg-blue-500' : ''
                        } ${availableSit.availableSit[2].available === false ? 'cursor-not-allowed' : '' }`}
                      onClick={() => handleSeatClick('03')}
                    >
                      Seat 3
                    </div>
                  </div>
                ) : null
              }

            </div>
            <button className='btn w-full mt-5' onClick={Payment}>Confirm Now</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ShareRide

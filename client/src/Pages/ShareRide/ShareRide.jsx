import { useEffect, useRef, useState } from 'react';
import Map, { Layer, Marker, Source } from 'react-map-gl';

import "mapbox-gl/dist/mapbox-gl.css";
function ShareRide() {
  const [riderData, setRiderData] = useState(null);

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
  const [distance, setDistance] = useState(0);
  const [showSit, setShowSit] = useState(false);
  const [sit, setSit] = useState(0);
  const [availableSit, setAvailableSit] = useState(0);
  const [rider , setRider] = useState(null);


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
    if (sourceCoordinates.lat && sourceCoordinates.lng && destinationCoordinates.lat && destinationCoordinates.lng) {
      getDirectionRoute();
    }
  }, [destinationCoordinates]);

  const getDirectionRoute = async () => {
    const formData = {
      startLocation: source,
      destinationLocation: destination
    }
    try {
      const response = await fetch('http://localhost:5000/api/findRoute', {
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
      setDirectionData(data.routeCoordinates);
      setPointData(data.shortestRoute.route);
      setDistance(data.shortestRoute.distance);
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
        console.log(data , id);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  const Payment = async () => {
    const order = {
      rider: rider,
      startLocationName: source,
      endLocationName: destination,
      startLocation: sourceCoordinates,
      endLocation: destinationCoordinates,
      distance: distance,
      sit: sit
    }

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
    <div className="px-20">
      <div className="hero min-h-screen ">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className='w-1/2'>
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
                style={{ width: 600, height: 400 }}
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
              directionData?.routes ? <div className='text-center absolute'>
                <h2 className='text-2xl font-bold'>Distance: {directionData?.routes[0]?.distance} meters</h2>
                <h2 className='text-2xl font-bold'>Duration: {directionData?.routes[0]?.duration} seconds</h2>
              </div> : null
            }
          </div>
          <div className='w-1/2'>
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
            <div className='flex justify-center items-center'>
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
                    <div>
                      <h2 className='text-[18px] font-bold'>{item.distance}</h2>
                      <h2 className='text-[18px] font-bold mt-2'>{item.price} tk</h2>
                    </div>
                  </div>
                ))}
              </div>

              {
                showSit && availableSit ? (
                  <div className='w-24 h-36 p-3 border-[1px] border-gray-200 my-2 rounded-md'>
                    <h2 className='text-[18px] font-bold'>Sit: 0{availableSit.availableSit}</h2>
                    <input
                      type='number'
                      value={sit}
                      onChange={(e) => {
                        let newValue = parseInt(e.target.value);
                        if (newValue < 0) {
                          newValue = 0;
                        } else if (newValue > availableSit.availableSit) {
                          newValue = availableSit.availableSit;
                        }
                        setSit(newValue);
                      }}
                      className='w-full h-14 p-1 border-[1px] border-gray-200 rounded-md'
                    />
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

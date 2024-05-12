import { useEffect, useRef, useState } from 'react';
import Map, { Layer, Marker, Source } from 'react-map-gl';

import "mapbox-gl/dist/mapbox-gl.css";
function PersonalRide() {
  const mapRef = useRef();
  const [viewport, setViewport] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const mapboxAccessToken = "pk.eyJ1Ijoicml5YWRoMTgxMCIsImEiOiJjbHVmdzZtNXUwbm1tMmxvZXgxbTZkZTBzIn0.ZKL7nnBAQryksHFvmNl3YQ";
  const MAPBOX_DRIVING_ENDPOINT = "https://api.mapbox.com/directions/v5/mapbox/driving/";
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setViewport({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    })
  }, [])


  const [source, setSource] = useState('DIU Smart City')
  const [sourceChange, setSourceChange] = useState(false)
  const [riderData, setRiderData] = useState(null);
  const [destinationChange, setDestinationChange] = useState(false)
  const [addressList, setAddressList] = useState([]);
  const [destination, setDistination] = useState('');
  const [rider, setRider] = useState(null);
  const [fare , setFare ] = useState(null);
  const [sourceCoordinates, setSourceCoordinates] = useState({
    lat: 23.87701757428925,
    lng: 90.32016843933931
  });
  const [destinationCoordinates, setDestinationCoordinates] = useState({});
  const [directionData, setDirectionData] = useState(null);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAddressList()
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [destination]);

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
  const getAddressList = async () => {
    setAddressList([]);
    const query = destination;
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

    if (sourceCoordinates && destinationCoordinates) {
      getDirectionRoute();
    }
  }, [destinationCoordinates]);

  const getDirectionRoute = async () => {

    try {
      const res = await fetch(
        `${MAPBOX_DRIVING_ENDPOINT}${sourceCoordinates.lng},${sourceCoordinates.lat};${destinationCoordinates.lng},${destinationCoordinates.lat}?overview=full&geometries=geojson&access_token=${mapboxAccessToken}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await res.json();
      console.log(result);
      console.log(result?.routes[0]?.geometry?.coordinates);
      setDirectionData(result);
      const distance = result?.routes[0]?.distance;
      if (distance<300) {
        setFare(10)
      }
      else if (distance < 600) {
        setFare(20)
      }
      else if (distance < 900) {
        setFare(30)
      }
      else{
        setFare(40)
      }
    } catch (error) {
      console.error('Error fetching direction route:', error);
    }
  };
  const onRiderClick = async (id) => {
    setSelectedItem(id === selectedItem ? null : id);
    setRider(id);
  }
  const Payment = async () => {
    
    const type = "personal";
    const order = {
      rider: rider,
      startLocationName: source,
      endLocationName: destination,
      startLocation: sourceCoordinates,
      endLocation: destinationCoordinates,
      selectedSeats:[ '01', '02','03' ],
      directionData: directionData.routes[0]?.geometry?.coordinates,
      type: type,
      fare:fare
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
                {directionData?.routes ? (
                  <Source type="geojson" data={{
                    type: 'Feature', geometry:
                      { type: 'LineString', coordinates: directionData?.routes[0]?.geometry?.coordinates }
                  }}>
                    <Layer
                      type="line"
                      layout={{ 'line-join': 'round', 'line-cap': 'square' }}
                      paint={{ 'line-color': '#0462d4', 'line-width': 4 }}
                    />
                  </Source>
                ) : null}
              </Map> : null
            }
            {
              fare ? <h1 className='text-3xl font-bold'>Fare:{fare} tk</h1>:null
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
                  disabled
                />
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
                    <img src='https://i.ibb.co/CvXpckN/image.png' className='w-20 h-20' />
                  </div>
                ))}
              </div>

            </div>
            <button className='btn w-full mt-5' onClick={Payment}>Confirm Now</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default PersonalRide

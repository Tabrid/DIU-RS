
import { useEffect, useRef, useState } from 'react';
import Navbar from './Components/Navbar/Navbar'
import Map, { Layer, Marker, Source } from 'react-map-gl';

import "mapbox-gl/dist/mapbox-gl.css";
function App() {
  const mapRef = useRef();
  const [viewport, setViewport] = useState({});
  const mapboxAccessToken = "pk.eyJ1Ijoicml5YWRoMTgxMCIsImEiOiJjbHVmdzZtNXUwbm1tMmxvZXgxbTZkZTBzIn0.ZKL7nnBAQryksHFvmNl3YQ";
  const MAPBOX_RETRIVE_URL = 'https://api.mapbox.com/search/searchbox/v1/retrieve/';
  const MAPBOX_DRIVING_ENDPOINT = "https://api.mapbox.com/directions/v5/mapbox/driving/";
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setViewport({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    })
  }, [])


  const [source, setSource] = useState('')
  const [sourceChange, setSourceChange] = useState(false)
  const [destinationChange, setDestinationChange] = useState(false)
  const [addressList, setAddressList] = useState([]);
  const [destination, setDistination] = useState('');
  const [sourceCoordinates, setSourceCoordinates] = useState({});
  const [destinationCoordinates, setDestinationCoordinates] = useState({});
  const [directionData, setDirectionData] = useState(null);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAddressList()
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [source, destination]);


  const getAddressList = async () => {
    setAddressList([]);
    const query = sourceChange ? source : destination;
    const res = await fetch(`http://localhost:5000/api?q=${query}`, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    const result = await res.json();
    console.log(result);
    setAddressList(result)

  }

  const onSourceAddressClick = async (item) => {
    setSource(item.full_address);
    setAddressList([]);
    setSourceChange(false);

    try {
      const res = await fetch(`${MAPBOX_RETRIVE_URL}${item.mapbox_id}?session_token=${mapboxAccessToken}&access_token=${mapboxAccessToken}`);
      const result = await res.json();

      setSourceCoordinates({
        lng: 91.97103148566597,
        lat: 22.463930001630906
        // lng: result.features[0].geometry.coordinates[0],
        // lat: result.features[0].geometry.coordinates[1],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const onDestinationAddressClick = async (item) => {
    setDistination(item.full_address);
    setAddressList([]);
    setDestinationChange(false);
    try {
      const res = await fetch(`${MAPBOX_RETRIVE_URL}${item.mapbox_id}?session_token=${mapboxAccessToken}&access_token=${mapboxAccessToken}`);
      const result = await res.json();

      setDestinationCoordinates({
        lat:22.46018927786971,
        lng:91.97106489520495
,
        // lng: result.features[0].geometry.coordinates[0],
        // lat: result.features[0].geometry.coordinates[1],
      });
      console.log(result);
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
      console.log(result.routes);
      setDirectionData(result);
    } catch (error) {
      console.error('Error fetching direction route:', error);
    }
  };





  return (
    <>
      <Navbar />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className='w-1/2'>
            {
              viewport.lat && viewport.lng ? <Map
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
              directionData?.routes ? <div className='text-center'>
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

                {addressList?.suggestions && sourceChange ?
                  <div className='shadow-md p-1 rounded-md
            absolute w-full bg-white z-20'>
                    {addressList?.suggestions.map((item, index) => (
                      <h2 key={index} className='p-3 hover:bg-gray-100
                cursor-pointer'
                        onClick={() => { onSourceAddressClick(item) }}
                      >{item.full_address} </h2>
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

                {addressList?.suggestions && destinationChange ?
                  <div className='shadow-md p-1 rounded-md
            absolute w-full bg-white'>
                    {addressList?.suggestions.map((item, index) => (
                      <h2 key={index} className='p-3 hover:bg-gray-100
                cursor-pointer'
                        onClick={() => { onDestinationAddressClick(item) }}
                      >{item.full_address}</h2>
                    ))}
                  </div> : null}

                  
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default App

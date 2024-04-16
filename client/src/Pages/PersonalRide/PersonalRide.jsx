import { useEffect, useRef, useState } from 'react';
import Map, { Layer, Marker, Source } from 'react-map-gl';

import "mapbox-gl/dist/mapbox-gl.css";
import { rickshaw } from '../../Data/Data';
function PersonalRide() {
  const mapRef = useRef();
  const [viewport, setViewport] = useState({});
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


  const [source, setSource] = useState('CUET Main Gate')
  const [sourceChange, setSourceChange] = useState(false)
  const [destinationChange, setDestinationChange] = useState(false)
  const [addressList, setAddressList] = useState([]);
  const [destination, setDistination] = useState('');
  const [sourceCoordinates, setSourceCoordinates] = useState({
        lat: 22.46018927786971,
        lng:91.97106489520495});
  const [destinationCoordinates, setDestinationCoordinates] = useState({});
  const [directionData, setDirectionData] = useState(null);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAddressList()
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [ destination]);


  const getAddressList = async () => {
    setAddressList([]);
    const query = destination;
    console.log(query);
    const res = await fetch(`http://localhost:5000/api?q=${query}`, {
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
        lng:item.longitude
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
    } catch (error) {
      console.error('Error fetching direction route:', error);
    }
  };


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
                {
                  rickshaw.map((item, index) => (
                    <div key={index} className='btn w-24 h-36 p-3 border-[1px] border-gray-200 my-2 rounded-md'>
                      <img src={item.img} className='w-20 h-20' />
                      <div>
                        <h2 className='text-[18px] font-bold'>{item.distance}</h2>
                        <h2 className='text-[18px] font-bold mt-2'>{item.price} tk</h2>
                      </div>
                    </div>
                  
                  ))
                }
              </div>

            </div>
            <button className='btn w-full mt-5'>Confirm Now</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default PersonalRide

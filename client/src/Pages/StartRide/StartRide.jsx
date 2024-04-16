import { useEffect, useRef, useState } from "react";
import Map, { Layer, Marker, Source } from 'react-map-gl';
import { useLocation } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";

const StartRide = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const MAPBOX_DRIVING_ENDPOINT = "https://api.mapbox.com/directions/v5/mapbox/driving/";
    const transactionId = query.get("transactionId");
    const mapboxAccessToken = "pk.eyJ1Ijoicml5YWRoMTgxMCIsImEiOiJjbHVmdzZtNXUwbm1tMmxvZXgxbTZkZTBzIn0.ZKL7nnBAQryksHFvmNl3YQ";
    const mapRef = useRef();
    const [viewport, setViewport] = useState({});
    const [data, setData] = useState({});
    const [directionData, setDirectionData] = useState(null);
    const [directionRouteRider, setDirectionRouteRider] = useState(null);
    const [reviewPermission, setReviewPermission] = useState(false);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setViewport({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            })
            console.log(position.coords.latitude, position.coords.longitude);
        })
    }, [])

    useEffect(() => {
      
            fetch(`/api/ride/rides/${transactionId}`)
                .then(response => response.json())
                .then(data => {
                    setData(data);
                    console.log(data);
                })
        
        if (data?.startLocationName && data?.endLocationName) {
            getDirectionRoute();
        }
      
    }, [transactionId, data])





    const getDirectionRoute = async () => {

        try {
            const res = await fetch(
                `${MAPBOX_DRIVING_ENDPOINT}${data?.startLocation.lng},${data?.startLocation.lat};${data?.startLocation.lng},${data?.endLocation.lat}?overview=full&geometries=geojson&access_token=${mapboxAccessToken}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const result = await res.json();
            setDirectionData(result);
            getDirectionRouteRider();
        } catch (error) {
            console.error('Error fetching direction route:', error);
        }
    };

    const getDirectionRouteRider = async () => {

        try {
            const res = await fetch(
                `${MAPBOX_DRIVING_ENDPOINT}${data?.user.location.lng},${data?.user.location.lat};${data?.rider.location.lng},${data?.rider.location.lat}?overview=full&geometries=geojson&access_token=${mapboxAccessToken}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const result = await res.json();
            setDirectionRouteRider(result);
            console.log(result);
        } catch (error) {
            console.error('Error fetching direction route:', error);
        }
    };

    return (
        <div>

            <div className="hero min-h-screen ">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    {
                        data?.status=="pending" ? <div className="w-1/2">

                        {
                            viewport.lat && viewport.lng ? <Map
                                ref={mapRef}
                                mapboxAccessToken={mapboxAccessToken}
                                initialViewState={{
                                    longitude: 91.97106489520495,
                                    latitude: 22.46018927786971,
                                    zoom: 14
                                }}
                                style={{ width: 600, height: 400 }}
                                mapStyle="mapbox://styles/mapbox/streets-v12"
                            >
                                {
                                    viewport.lat && viewport.lng ? <Marker
                                        longitude={viewport.lng}
                                        latitude={viewport.lat}
                                        anchor="bottom" >
                                        <span className="label-text">Your Location</span>
                                        <img src="./pin.png"
                                            className='w-10 h-10'
                                        />
                                    </Marker> : null
                                }

                                {
                                    data?.startLocation.lat && data?.startLocation.lng ? <Marker
                                        longitude={data.startLocation.lng}
                                        latitude={data.startLocation.lat}
                                        anchor="bottom" >
                                        <span className="label-text">start</span>
                                        <img src="./pin.png"
                                            className='w-10 h-10'
                                        />
                                    </Marker> : null
                                }
                                {
                                    data?.endLocation.lat && data?.endLocation.lng ? <Marker
                                        longitude={data.endLocation.lng}
                                        latitude={data.endLocation.lat}
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

                    </div> : <div className="w-1/2"> {
                            viewport.lat && viewport.lng ? <Map
                                ref={mapRef}
                                mapboxAccessToken={mapboxAccessToken}
                                initialViewState={{
                                    longitude: 91.97106489520495,
                                    latitude: 22.46018927786971,
                                    zoom: 14
                                }}
                                style={{ width: 600, height: 400 }}
                                mapStyle="mapbox://styles/mapbox/streets-v12"
                            >
                                {
                                    viewport.lat && viewport.lng ? <Marker
                                        longitude={viewport.lng}
                                        latitude={viewport.lat}
                                        anchor="bottom" >
                                        <span className="label-text">Your Location</span>
                                        <img src="./pin.png"
                                            className='w-10 h-10'
                                        />
                                    </Marker> : null
                                }

                                {
                                    data?.startLocation.lat && data?.startLocation.lng ? <Marker
                                        longitude={data?.user.location.lng}
                                        latitude={data?.user.location.lat}
                                        anchor="bottom" >
                                        <span className="label-text">user</span>
                                        <img src="./pin.png"
                                            className='w-10 h-10'
                                        />
                                    </Marker> : null
                                }
                                {
                                    data?.rider.location.lat && data?.rider.location.lng ? <Marker
                                        longitude={data.endLocation.lng}
                                        latitude={data.endLocation.lat}
                                        anchor="bottom" >
                                        <span className="label-text">rider</span>
                                        <img src="./pin.png"
                                            className='w-10 h-10'
                                        />
                                    </Marker> : null
                                }
                                {directionRouteRider?.routes ? (
                                    <Source type="geojson" data={{
                                        type: 'Feature', geometry:
                                            { type: 'LineString', coordinates: directionRouteRider?.routes[0]?.geometry?.coordinates }
                                    }}>
                                        <Layer
                                            type="line"
                                            layout={{ 'line-join': 'round', 'line-cap': 'square' }}
                                            paint={{ 'line-color': '#0462d4', 'line-width': 4 }}
                                        />
                                    </Source>
                                ) : null}

                            </Map> : null
                        }</div>
                        
                    }
                    <div className="w-1/2">
                        <h1 className="text-5xl font-bold">{data.startLocationName} To {data.endLocationName}</h1>
                        {
                            directionData?.routes ? <div className='my-3 '>
                                <h2 className='text-2xl font-bold'>Distance: {directionData?.routes[0]?.distance} meters</h2>
                                <h2 className='text-2xl font-bold'>Duration: {directionData?.routes[0]?.duration} seconds</h2>
                            </div> : null
                        }
                        <h1 className="rounded-lg shadow-2xl text-xl font-extralight bg-blue-800 w-32 text-white text-center">PENDING</h1>
                        <h1 className="rounded-lg shadow-2xl text-xl font-extralight bg-blue-800 w-32 text-white text-center">Start</h1>
                        <h1 className="rounded-lg shadow-2xl text-xl font-extralight bg-blue-800 w-32 text-white text-center">Complete</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartRide;
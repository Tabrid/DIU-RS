import { useEffect, useRef, useState } from "react";
import Map, { Layer, Marker, Source } from 'react-map-gl';
import { useLocation } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import { toast } from 'react-hot-toast';
import { useAuthContext } from "../../Context/AuthContext";

const StartRide = () => {
    const { authUser } = useAuthContext();
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
    const [refresh, setRefresh] = useState(false);
    const [rating, setRating] = useState(0);
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

    }, [transactionId, data, refresh])





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
    const start = async () => {
        try {
            const res = await fetch(
                `/api/ride/rides/start/${data._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setRefresh(!refresh);
            const result = await res.json();
            toast.success('Ride started');
        } catch (error) {
            console.error('Error fetching direction route:', error);
        }
    }
    const complete = async () => {
        try {
            const res = await fetch(
                `/api/ride/rides/end/${data._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setRefresh(!refresh);
            const result = await res.json();
            toast.success('Ride completed');
        } catch (error) {
            console.error('Error fetching direction route:', error);
        }
    }
    const handleRatingChange = (e) => {
        // Get the value of the selected rating
        const selectedRating = parseInt(e.target.value);
        setRating(selectedRating);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const comment = e.target.comment.value;
        const riderId = data.rider._id;
        const userId = data.user._id;
        const rideId = data._id;
        const formData = {
            rating,
            comment,
            riderId,
            userId,
            rideId
        }
        fetch('/api/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                setRefresh(!refresh);
                toast.success('Review Submitted');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    return (
        <div>
            {
                data?.status == "pending" ? <div className="hero min-h-screen ">
                    {
                        data?.end == "pending" ? <div className="hero-content flex-col lg:flex-row-reverse">
                            {
                                data?.start != "pending" ? <div className="w-1/2">

                                    {
                                        viewport.lat && viewport.lng ? <Map
                                            ref={mapRef}
                                            mapboxAccessToken={mapboxAccessToken}
                                            initialViewState={{
                                                longitude: 90.32016843933931,
                                                latitude: 23.87701757428925,
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
                                            {data?.directionData ? (
                                                <Source type="geojson" data={{
                                                    type: 'Feature', geometry:
                                                        { type: 'LineString', coordinates: data?.directionData }
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
                                            longitude: 90.32016843933931,
                                            latitude: 23.87701757428925,
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
                                                <span className="label-text">End Loacation</span>
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
                                    data.type == 'share' ? <h1 className="text-5xl font-bold">Fare:{data.fare * data.selectedSeats.length}tk</h1> : <h1 className="text-5xl font-bold">Fare:{data.fare}tk</h1>
                                }
                                {
                                    directionData?.routes ? <div className='my-3 '>
                                        <h2 className='text-2xl font-bold'>Distance: {directionData?.routes[0]?.distance} meters</h2>
                                        <h2 className='text-2xl font-bold'>Duration: {directionData?.routes[0]?.duration} seconds</h2>
                                    </div> : null
                                }
                                {
                                    data?.start == "pending" ? <h1 className="text-2xl font-bold">Waiting for rider to start</h1> : null
                                }
                                {
                                    authUser.role == 'Rider' ? <div>
                                        {
                                            data?.start == "pending" ? <button onClick={start} className="rounded-lg p-2 shadow-2xl text-xl font-extralight bg-blue-800 w-32 text-white text-center">Start</button>
                                                : null
                                        }
                                        {
                                            data?.start != "pending" ? <button onClick={complete} className="rounded-lg p-2 shadow-2xl text-xl font-extralight bg-blue-800 w-32 text-white text-center">Complete</button> : null
                                        }
                                    </div> : null
                                }
                            </div>
                        </div> : <div>
                            {
                                authUser.role == "User" ? <div>
                                    <h1 className="text-2xl font-bold w-full text-center">Review Rider</h1>

                                    <form onSubmit={handleSubmit} className="flex-col gap-5 mt-3">
                                        <textarea name="comment" className="w-full h-32 p-2 rounded-lg shadow-2xl" placeholder="Write review here"></textarea>
                                        <div className="rating">
                                            <input value='1' type="radio" name="rating-1" className="mask mask-star" onChange={handleRatingChange} />
                                            <input value='2' type="radio" name="rating-1" className="mask mask-star" onChange={handleRatingChange} />
                                            <input value='3' type="radio" name="rating-1" className="mask mask-star" onChange={handleRatingChange} />
                                            <input value='4' type="radio" name="rating-1" className="mask mask-star" onChange={handleRatingChange} />
                                            <input value='5' type="radio" name="rating-1" className="mask mask-star" onChange={handleRatingChange} />
                                        </div>
                                        <button type="submit" className="btn w-full">Submit</button>
                                    </form>
                                </div> : <div className="min-h-screen flex justify-center items-center">
                                    <h1>Waiting for user Review</h1>
                                </div>
                            }
                        </div>
                    }
                </div> : <div className="hero min-h-screen "> <h1 className="text-8xl font-bold">COMPLETE</h1></div>
            }
        </div>
    );
};

export default StartRide;
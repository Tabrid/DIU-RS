import { Map, Marker } from "react-map-gl"
import { useRef } from "react";
import { address } from '../../Data/Data';
import { useMediaQuery } from 'react-responsive';

function RoadMap() {
    const mapRef = useRef();
    const location = {
        lat: 23.875675672131138,
        lng: 90.32076051993644,
    }
    const isSmallScreen = useMediaQuery({ query: '(max-width: 767px)' }); // Define your small screen size here
    const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' }); // Define your large screen size here
    const mapboxAccessToken = "pk.eyJ1Ijoicml5YWRoMTgxMCIsImEiOiJjbHVmdzZtNXUwbm1tMmxvZXgxbTZkZTBzIn0.ZKL7nnBAQryksHFvmNl3YQ";
    return (
         <div className="flex justify-center items-center lg:min-h-screen">
            {!isSmallScreen && location.lat && location.lng && (
                <div >
                    <Map
                        className="relative"
                        ref={mapRef}
                        mapboxAccessToken={mapboxAccessToken}
                        initialViewState={{
                            longitude: location.lng,
                            latitude: location.lat,
                            zoom: 16
                        }}
                        style={{ width: 1024, height: 500 }}
                        mapStyle="mapbox://styles/riyadh1810/cluis3e8e000z01pb18gi58iu"
                    >
                        {address &&
                            address.map((item, index) => (
                                <Marker key={index} longitude={item.longitude} latitude={item.latitude} anchor="bottom">
                                    <span className="label-text">{item.location_name}</span>
                                    <img src="./pin.png" className="w-10 h-10" />
                                </Marker>
                            ))}
                    </Map>
                </div>
            )}

            {!isLargeScreen && location.lat && location.lng && (
                <div >
                    <Map
                        className="relative"
                        ref={mapRef}
                        mapboxAccessToken={mapboxAccessToken}
                        initialViewState={{
                            longitude: location.lng,
                            latitude: location.lat,
                            zoom: 16
                        }}
                        style={{ width: 400, height: 1000 }}
                        mapStyle="mapbox://styles/riyadh1810/cluis3e8e000z01pb18gi58iu"
                    >
                        {address &&
                            address.map((item, index) => (
                                <Marker key={index} longitude={item.longitude} latitude={item.latitude} anchor="bottom">
                                    <span className="label-text">{item.location_name}</span>
                                    <img src="./pin.png" className="w-10 h-10" />
                                </Marker>
                            ))}
                    </Map>
                </div>
            )}
        </div>
    )
}

export default RoadMap
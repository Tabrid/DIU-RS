import { Map, Marker } from "react-map-gl"
import { useRef } from "react";
import { address } from '../../Data/Data';

function RoadMap() {
    const mapRef = useRef();
    const location = {
        lat: 22.46018927786971,
        lng: 91.97106489520495,
    }

    const mapboxAccessToken = "pk.eyJ1Ijoicml5YWRoMTgxMCIsImEiOiJjbHVmdzZtNXUwbm1tMmxvZXgxbTZkZTBzIn0.ZKL7nnBAQryksHFvmNl3YQ";
    return (
        <div className="flex justify-center items-center"><div >
            {
                location.lat && location.lng ? <Map
                    className='relative'
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


                    {
                        address ? address?.map((item, index) => (
                            <Marker
                                key={index}
                                longitude={item.longitude}
                                latitude={item.latitude}
                                anchor="bottom" >
                                <span className="label-text">{item.location_name}</span>
                                <img src="./pin.png"
                                    className='w-10 h-10'
                                />
                            </Marker>
                        )) : null
                    }

                </Map> : null
            }

        </div></div>
    )
}

export default RoadMap
import { useSearchParams } from "react-router-dom";
import { GeoJSON } from "react-leaflet";
import L from "leaflet";
import GeoJsonMap from "../../components/GeoJsonMap";
import ToiletsLayer from "../../components/layers/ToiletsLayer"
import Accessible_ParkingLayer from "../../components/layers/Accessible_ParkingLayer"
import ElevatorsLayer from "../../components/layers/ElevatorsLayer"
import "./MapPage.css";


export default function MapPage() {
    const [params] = useSearchParams();
    const start = params.get("start");
    const destination = params.get("destination");


    return(
        <div className="mapLayout">
            <div className="mapTopBar">
                <span>
                    <strong>Start:</strong> {start || "-"}
                </span>
                <span>
                    <strong>Ziel:</strong> {destination || "-"}
                </span>
            </div>

            <div className="mapArea">
                <GeoJsonMap>
                    <ToiletsLayer>
                        {({ geoJson, error }) => (
                            <>
                                {error && (
                                    <div style={{ padding:8 }}>
                                        Error loading toilets: {String(error.message || error)}
                                    </div>
                                )}
                            {geoJson && (
                                <GeoJSON
                                    data={geoJson}
                                    pointToLayer={(_, latlng) =>
                                        L.circleMarker(latlng, {
                                        radius: 7,
                                        color: "#2563eb",
                                        weight: 2,
                                        fillColor: "#2563eb",
                                        fillOpacity: 0.9,
                                        })
                                    }
                                    />
                                )}
                            </>
                        )}
                    </ToiletsLayer>
                    <Accessible_ParkingLayer>
                        {({ geoJson, error }) => (
                            <>
                                {error && (
                                    <div style={{ padding:8 }}>
                                        Error loading accessible parking: {String(error.message || error)}
                                    </div>
                                )}
                                {geoJson && (
                                    <GeoJSON
                                    data={geoJson}
                                    pointToLayer={(_, latlng) =>
                                        L.circleMarker(latlng, {
                                        radius: 7,
                                        color: "#dc2626",
                                        weight: 2,
                                        fillColor: "#dc2626",
                                        fillOpacity: 0.9,
                                        })
                                    }
                                    />
                                )}
                            </>
                        )}
                    </Accessible_ParkingLayer>
                    <ElevatorsLayer>
                        {({ geoJson, error }) => (
                            <>
                            {error && (
                                <div style={{ padding: 8 }}>
                                Error loading elevators: {String(error.message || error)}
                                </div>
                            )}
                            {geoJson && (
                                <GeoJSON
                                data={geoJson}
                                pointToLayer={(_, latlng) =>
                                    L.circleMarker(latlng, {
                                    radius: 7,
                                    color: "#16a34a",
                                    weight: 2,
                                    fillColor: "#16a34a",
                                    fillOpacity: 0.9,
                                    })
                                }
                                />
                            )}
                            </>
                        )}
                        </ElevatorsLayer>
                </GeoJsonMap>
            </div>
        </div>
    );
} 
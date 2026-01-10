import { useSearchParams } from "react-router-dom";
import GeoJsonMap from "../../components/GeoJsonMap";
import ToiletsLayer from "../../components/layers/ToiletsLayer"
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
                <ToiletsLayer>
                    {({ geoJson, error }) => (
                        <>
                            {error && (
                                <div style={{ padding:8 }}>
                                    Error loading toilets: {String(error.message || error)}
                                </div>
                            )}
                            <GeoJsonMap geoJson={geoJson} />
                        </>
                    )}
                </ToiletsLayer>
            </div>
        </div>
    );
} 
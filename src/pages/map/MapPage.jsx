import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GeoJSON, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import GeoJsonMap from "../../components/GeoJsonMap";
import "./MapPage.css";

// Marker Icons
const startIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const endIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});


function MapContent({ routeData, filters, onFilterChange }) {
    const map = useMap();
    console.log(routeData)

    // Karte auf Route zentrieren
    if (routeData?.route) {
        const coords = routeData.route.geometry.coordinates;
        const latLngs = coords.map(([lon, lat]) => [lat, lon]);
        
        if (latLngs.length > 0) {
            const bounds = L.latLngBounds(latLngs);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    // POI Farben
    const getPoiStyle = (poiType) => {
        const styles = {
            toilet: { color: "#011030", fillColor: "#2563eb" },
            elevator: { color: "#013614", fillColor: "#16a34a" },
            parking: { color: "#420000", fillColor: "#dc2626" }
        };
        return styles[poiType] || { color: "#6b7280", fillColor: "#6b7280" };
    };
 
    return (
        <>
            {/* Route */}
            {routeData?.route && (
                <>
                    <Polyline 
                        positions={routeData.route.geometry.coordinates.map(([lon, lat]) => [lat, lon])}
                        color="#bd0612"
                        weight={5}
                        opacity={0.8}
                    />
                    <Marker 
                        position={[routeData.start.coords[1], routeData.start.coords[0]]}
                        icon={startIcon}
                    />
                    <Marker 
                        position={[routeData.destination.coords[1], routeData.destination.coords[0]]}
                        icon={endIcon}
                    />
                </>
            )}

            {/* POIs (gefiltert) */}
            {routeData?.pois && (
                <GeoJSON
                    key={routeData?.pois?.features?.map(f => f.id ?? f.properties?.id ?? '').join('|')}
                    data={routeData.pois}
                    pointToLayer={(feature, latlng) => {
                        const style = getPoiStyle(feature.properties.poi_type);
                        return L.circleMarker(latlng, {
                            radius: 7,
                            weight: 2,
                            fillOpacity: 0.9,
                            ...style
                        });
                    }}
                    onEachFeature={(feature, layer) => {
                        const type = feature.properties.poi_type;
                        const labels = {
                            toilet: "🚻 Toilette",
                            elevator: "🛗 Aufzug",
                            parking: "♿ Behindertenparkplatz"
                        };
                        layer.bindPopup(labels[type] || "POI");
                    }}
                />
            )}

            {/* Route Info */}
            {routeData?.route && (
                <div className="route-info">
                    <p>
                        <strong>{(routeData.route.properties.distance / 1000).toFixed(2)} km</strong>
                        {' · '}
                        <strong>{Math.round(routeData.route.properties.duration / 60)} min</strong>
                    </p>
                </div>
            )}
        </>
    );
}

export default function MapPage() {
    const [params] = useSearchParams();
    const start = params.get("start");
    const destination = params.get("destination");

    const [routeData, setRouteData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        show_toilets: true,
        show_elevators: true,
        show_parking: true
    });

// Route laden beim Mount
    useEffect(() => {
        if (start && destination) {
            planRoute();
        }
    }, [start, destination, filters]);

    async function planRoute() {
        setLoading(true);
        setError(null);

        try{
            const res = await fetch("http://127.0.0.1:5000/api/plan-route", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    start: start,
                    destination: destination,
                    ...filters
                })
            })
            const data = await res.json()
            setRouteData(data);
        } catch (err) {
            setError("Fehler beim Laden der Route");
            console.error(err);
        } finally {     
            setLoading(false);
        }  
    }

    function toggleFilter(filterName) {
        const newFilters = {
            ...filters,
            [filterName]: !filters[filterName]
        };
        setFilters(newFilters);
        console.log({newFilters})
        // Route mit neuen Filtern neu laden
        // if (start && destination) {
        //    planRoute()
        //     fetch("http://127.0.0.1:5000/api/plan-route", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             start: start,
        //             destination: destination,
        //             ...newFilters
        //         })
        //     })
        //         .then(res => res.json())
        //         .then(data => {
        //             if (!data.error) {
        //                 setRouteData(data);
        //             }
        //         });
        //}
    }

    return (
        <div className="mapLayout">
            {/* Top Bar */}
            <div className="mapTopBar">
                <div>
                    <strong>Start:</strong> {start || "-"}
                </div>
                <div>
                    <strong>Ziel:</strong> {destination || "-"}
                </div>
            </div>

            {/* Filter Controls */}
            <div className="mapFilters" role="group" aria-label="POI-Filter">
                <label>
                    <input
                        type="checkbox"
                        checked={filters.show_toilets}
                        onChange={() => toggleFilter('show_toilets')}
                        aria-label="Toiletten anzeigen"
                    />
                    <span>🚻 Toiletten</span>
                </label>
                
                <label>
                    <input
                        type="checkbox"
                        checked={filters.show_elevators}
                        onChange={() => toggleFilter('show_elevators')}
                        aria-label="Aufzüge anzeigen"
                    />
                    <span>🛗 Aufzüge</span>
                </label>
                
                <label>
                    <input
                        type="checkbox"
                        checked={filters.show_parking}
                        onChange={() => toggleFilter('show_parking')}
                        aria-label="Behindertenparkplätze anzeigen"
                    />
                    <span>♿ Parkplätze</span>
                </label>
            </div>

            {/* Map */}
            <div className="mapArea">
                {loading && <div className="loading">Route wird berechnet...</div>}
                {error && <div className="error">{error}</div>}
                
                <GeoJsonMap>
                    {routeData && (
                        <MapContent 
                            routeData={routeData} 
                            filters={filters}
                            onFilterChange={toggleFilter}
                        />
                    )}
                </GeoJsonMap>
            </div>
        </div>
    );
}

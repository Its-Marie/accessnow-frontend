import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GeoJSON, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import GeoJsonMap from "../../components/GeoJsonMap";
import "./MapPage.css";

// Function to create popup content based on facility type
function createPopupContent(feature) {
  const props = feature.properties;
  let content = '<div style="font-family: Arial, sans-serif; min-width: 200px;">';
  
  if (props.poi_type === 'parking' || (props.anzahl && props.bezeichnung)) {
    // Parking facility
     content += `
      <h3 style="margin: 0 0 10px 0; color: #dc2626; font-size: 16px;">♿ Accessible Parking</h3>
      <div style="line-height: 1.6; font-size: 14px;">
        ${props.bezeichnung ? `<p style="margin: 5px 0;"><strong>Type:</strong> ${props.bezeichnung}</p>` : ''}
        ${props.standort ? `<p style="margin: 5px 0;"><strong>Location:</strong> ${props.standort}</p>` : ''}
        ${props.plz ? `<p style="margin: 5px 0;"><strong>Postal Code:</strong> ${props.plz}</p>` : ''}
        ${props.ortsteil ? `<p style="margin: 5px 0;"><strong>District:</strong> ${props.ortsteil}</p>` : ''}
        ${props.bemerkung ? `<p style="margin: 5px 0;"><strong>Hours:</strong> ${props.bemerkung}</p>` : ''}
        ${props.anzahl ? `<p style="margin: 5px 0;"><strong>Spaces:</strong> ${props.anzahl}</p>` : ''}
      </div>
    `;

  } else if (props.poi_type === 'elevator' || 
             (props.tags && (props.tags.highway === 'elevator' || props.tags.amenity === 'elevator'))) {    
    // Elevator
    const tags = props.tags;
    content += `
      <h3 style="margin: 0 0 10px 0; color: #16a34a;">🛗 Elevator</h3>
      <div style="line-height: 1.6;">
        ${tags.name ? `<p><strong>Location:</strong> ${tags.name}</p>` : ''}
        ${tags.level ? `<p><strong>Levels:</strong> ${tags.level}</p>` : ''}
        ${tags.wheelchair ? `<p><strong>Wheelchair Accessible:</strong> ${tags.wheelchair === 'yes' ? 'Yes ✓' : 'No'}</p>` : ''}
        ${tags.bicycle ? `<p><strong>Bicycle Access:</strong> ${tags.bicycle === 'yes' ? 'Yes ✓' : 'No'}</p>` : ''}
        ${props.operator ? `<p><strong>Operator:</strong> ${props.operator}</p>` : ''}
      </div>
    `;
    } else if (props.poi_type === 'toilet' || props.modelltyp || props.vertrag) {
    // Toilet
    content += `
      <h3 style="margin: 0 0 10px 0; color: #2563eb; font-size: 16px;">🚻 Public Toilet</h3>
      <div style="line-height: 1.6; font-size: 14px;">
        ${props.standort ? `<p style="margin: 5px 0;"><strong>Location:</strong> ${props.standort}</p>` : ''}
        ${props.bezirk ? `<p style="margin: 5px 0;"><strong>District:</strong> ${props.bezirk}</p>` : ''}
        ${props.modelltyp ? `<p style="margin: 5px 0;"><strong>Type:</strong> ${props.modelltyp}</p>` : ''}
        ${props.oeffnungszeiten ? `<p style="margin: 5px 0;"><strong>Hours:</strong> ${props.oeffnungszeiten}</p>` : '<p style="margin: 5px 0;"><strong>Hours:</strong> 24/7</p>'}
        ${props.nutzungsentgelt !== null && props.nutzungsentgelt !== undefined ? `<p style="margin: 5px 0;"><strong>Fee:</strong> €${props.nutzungsentgelt}</p>` : ''}
        ${props.betreiber ? `<p style="margin: 5px 0;"><strong>Operator:</strong> ${props.betreiber}</p>` : ''}
        <p style="margin: 5px 0;"><strong>Accessible:</strong> ${props.barrierefrei === 'ja' ? 'Yes ✓' : 'No'}</p>
        ${props.wickeltisch ? `<p style="margin: 5px 0;"><strong>Changing Table:</strong> ${props.wickeltisch === 'ja' ? 'Yes ✓' : 'No'}</p>` : ''}
      </div>
    `;
  }

  content += '</div>';
  return content;
}

function onEachFeatureWithPopup(feature, layer) {
    const popupContent = createPopupContent(feature);
    layer.bindPopup(popupContent);
}

// Calculate the distance between a point and a line (route)
function getDistanceToRoute(pointCoords, routeCoords) {
    let minDistance = Infinity;
    
    // Iterate through all route segments
    for (let i = 0; i < routeCoords.length - 1; i++) {
        const segmentStart = L.latLng(routeCoords[i][1], routeCoords[i][0]);
        const segmentEnd = L.latLng(routeCoords[i + 1][1], routeCoords[i + 1][0]);
        const point = L.latLng(pointCoords[1], pointCoords[0]);
        
        // Calculate distance to segment (simple approach using start/end points)
        const distToStart = point.distanceTo(segmentStart);
        const distToEnd = point.distanceTo(segmentEnd);
        const segmentDist = Math.min(distToStart, distToEnd);
        
        minDistance = Math.min(minDistance, segmentDist);
    }
    
    return minDistance;
}

// Filter POIs based on distance to route
function filterPOIsByDistance(pois, routeCoords, maxDistance = 350) {
    if (!pois || !routeCoords) return pois;
    
    const filteredFeatures = pois.features.filter(feature => {
        const poiCoords = feature.geometry.coordinates;
        const distance = getDistanceToRoute(poiCoords, routeCoords);
        return distance <= maxDistance;
    });
    
    return {
        ...pois,
        features: filteredFeatures
    };
}
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

    // Center map on route
    if (routeData?.route) {
        const coords = routeData.route.geometry.coordinates;
        const latLngs = coords.map(([lon, lat]) => [lat, lon]);
        
        if (latLngs.length > 0) {
            const bounds = L.latLngBounds(latLngs);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    // POI colors
    const getPoiStyle = (poiType) => {
        const styles = {
            toilet:   { color: "#1d4ed8", fillColor: "#2563eb", dashArray: "0" },     // solid
            elevator: { color: "#166534", fillColor: "#16a34a", dashArray: "6 3" },   // dashed
            parking:  { color: "#991b1b", fillColor: "#dc2626", dashArray: "2 4" }    // dotted-ish
        };
        return styles[poiType] || { color: "#6b7280", fillColor: "#6b7280", dashArray: "0" };
        };

    // Filter POIs within 400m radius
    const filteredPOIs = routeData?.route && routeData?.pois 
        ? filterPOIsByDistance(
            routeData.pois, 
            routeData.route.geometry.coordinates, 
            400 // Distance in meters
          )
        : routeData?.pois;
 
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

            {routeData?.pois && (
                <GeoJSON
                    key={filteredPOIs?.features?.map(f => f.id ?? f.properties?.id ?? '').join('|')}
                    data={filteredPOIs}
                    pointToLayer={(feature, latlng) => {
                        const style = getPoiStyle(feature.properties.poi_type);
                        return L.circleMarker(latlng, {
                            radius: 8,
                            weight: 3,
                            fillOpacity: 0.9,
                            ...style
                        });
                    }}
                    onEachFeature={(feature, layer) => {
                        const popupContent = createPopupContent(feature);
                        layer.bindPopup(popupContent);
                    }}
                />
            )}

            {/* Route Info */}
            {routeData?.route && (
                <div className="route-info">
                    <p>
                        <strong>{(routeData.route.properties.distance / 1000).toFixed(2)} km</strong>
                    </p>
                </div>
            )}
            {/* Screen reader route summary */}
            {routeData?.route && filteredPOIs?.features && (
            <div aria-live="polite" className="sr-only">
                Route found. Distance {(routeData.route.properties.distance / 1000).toFixed(2)} kilometers.{" "}
                {filteredPOIs.features.length} accessible places along the route.
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
            setError("We couldn’t calculate the route. Please check the addresses and try again.");
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
            <div className="mapTopBar">
                <div>
                    <strong>Start:</strong> {start || "-"}
                </div>
                <div>
                    <strong>Ziel:</strong> {destination || "-"}
                </div>
            </div>

            <div className="mapFilters" role="group" aria-label="Map filters">
                <label className="filterItem">
                    <input
                        type="checkbox"
                        checked={filters.show_toilets}
                        onChange={() => toggleFilter('show_toilets')}
                    />
                    <span className="filterBadge filterBadge--toilet" aria-hidden="true">
                        🚻
                    </span>
                    <span className="filterText">
                        <span className="filterTitle">Toilets</span>
                    </span>
                </label>
                
                
                <label className="filterItem">
                    <input
                        type="checkbox"
                        checked={filters.show_elevators}
                        onChange={() => toggleFilter("show_elevators")}
                    />
                    <span className="filterBadge filterBadge--elevator" aria-hidden="true">
                    🛗
                    </span>
                    <span className="filterText">
                    <span className="filterTitle">Elevators</span>
                    </span>
                </label>

                <label className="filterItem">
                    <input
                    type="checkbox"
                    checked={filters.show_parking}
                    onChange={() => toggleFilter("show_parking")}
                    />
                    <span className="filterBadge filterBadge--parking" aria-hidden="true">
                    ♿
                    </span>
                    <span className="filterText">
                    <span className="filterTitle">Accessible parking</span>
                    </span>
                </label>
                <p className="filtersHint">
                    Shown within 400 m of your route.
                </p>
            </div>

            {/* Map */}
            <div className="mapArea">
                {loading && <div className="loading">Loading route. This may take a few seconds.</div>}
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

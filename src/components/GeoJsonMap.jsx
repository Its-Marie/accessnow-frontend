import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FixLeafletSize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [map]);

  return null
}
export default function GeoJsonMap({
  center= [52.52, 13.405],
  zoom = 13,
  geoJson,
}) {
   return (
    <MapContainer
      center={center}     
      zoom={zoom}
      minZoom={2}
      maxZoom={22}
      scrollWheelZoom
      className="leafletMap"
    >
      <FixLeafletSize />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
        maxZoom={22}
      />
      {geoJson && (
        <GeoJSON
          data={geoJson}
          onEachFeature={(feature, layer) => {
            const name = feature?.properties?.name;
            const wheelchair = feature?.properties?.wheelchair;
            if (name) {
              layer.bindPopup(
                `<b>${name}</b>${wheelchair ? `<br/>Wheelchair: ${wheelchair}`:""}`
              );
            }
          }}
        />
      )}
    </MapContainer>
  );
}
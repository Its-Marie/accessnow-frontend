import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GeoJSON, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import GeoJsonMap from "../../components/GeoJsonMap";
import { useTranslation } from "react-i18next";
import "./MapPage.css";
import { API_BASE } from "../../config/api";

function createPopupContent(feature, t) {
  const props = feature.properties;
  let content = '<div style="font-family: Arial, sans-serif; min-width: 200px;">';

  if (props.poi_type === 'parking' || (props.anzahl && props.bezeichnung)) {
    content += `
      <h3 style="margin: 0 0 10px 0; color: #dc2626; font-size: 16px;">♿ ${t("map.popup.parking")}</h3>
      <div style="line-height: 1.6; font-size: 14px;">
        ${props.bezeichnung ? `<p style="margin: 5px 0;"><strong>${t("map.popup.type")}:</strong> ${props.bezeichnung}</p>` : ''}
        ${props.standort ? `<p style="margin: 5px 0;"><strong>${t("map.popup.location")}:</strong> ${props.standort}</p>` : ''}
        ${props.plz ? `<p style="margin: 5px 0;"><strong>${t("map.popup.postalCode")}:</strong> ${props.plz}</p>` : ''}
        ${props.ortsteil ? `<p style="margin: 5px 0;"><strong>${t("map.popup.district")}:</strong> ${props.ortsteil}</p>` : ''}
        ${props.bemerkung ? `<p style="margin: 5px 0;"><strong>${t("map.popup.hours")}:</strong> ${props.bemerkung}</p>` : ''}
        ${props.anzahl ? `<p style="margin: 5px 0;"><strong>${t("map.popup.spaces")}:</strong> ${props.anzahl}</p>` : ''}
      </div>
    `;
  } else if (
    props.poi_type === 'elevator' ||
    (props.tags && (props.tags.highway === 'elevator' || props.tags.amenity === 'elevator'))
  ) {
    const tags = props.tags;
    content += `
      <h3 style="margin: 0 0 10px 0; color: #16a34a;">🛗 ${t("map.popup.elevator")}</h3>
      <div style="line-height: 1.6;">
        ${tags.name ? `<p><strong>${t("map.popup.location")}:</strong> ${tags.name}</p>` : ''}
        ${tags.level ? `<p><strong>${t("map.popup.levels")}:</strong> ${tags.level}</p>` : ''}
        ${tags.wheelchair ? `<p><strong>${t("map.popup.wheelchair")}:</strong> ${tags.wheelchair === 'yes' ? t("map.popup.yes") : t("map.popup.no")}</p>` : ''}
        ${tags.bicycle ? `<p><strong>${t("map.popup.bicycle")}:</strong> ${tags.bicycle === 'yes' ? t("map.popup.yes") : t("map.popup.no")}</p>` : ''}
        ${props.operator ? `<p><strong>${t("map.popup.operator")}:</strong> ${props.operator}</p>` : ''}
      </div>
    `;
  } else if (props.poi_type === 'toilet' || props.modelltyp || props.vertrag) {
    content += `
      <h3 style="margin: 0 0 10px 0; color: #2563eb; font-size: 16px;">🚻 ${t("map.popup.toilet")}</h3>
      <div style="line-height: 1.6; font-size: 14px;">
        ${props.standort ? `<p style="margin: 5px 0;"><strong>${t("map.popup.location")}:</strong> ${props.standort}</p>` : ''}
        ${props.bezirk ? `<p style="margin: 5px 0;"><strong>${t("map.popup.district")}:</strong> ${props.bezirk}</p>` : ''}
        ${props.modelltyp ? `<p style="margin: 5px 0;"><strong>${t("map.popup.type")}:</strong> ${props.modelltyp}</p>` : ''}
        ${props.oeffnungszeiten ? `<p style="margin: 5px 0;"><strong>${t("map.popup.hours")}:</strong> ${props.oeffnungszeiten}</p>` : `<p style="margin: 5px 0;"><strong>${t("map.popup.hours")}:</strong> 24/7</p>`}
        ${props.nutzungsentgelt !== null && props.nutzungsentgelt !== undefined ? `<p style="margin: 5px 0;"><strong>${t("map.popup.fee")}:</strong> €${props.nutzungsentgelt}</p>` : ''}
        ${props.betreiber ? `<p style="margin: 5px 0;"><strong>${t("map.popup.operator")}:</strong> ${props.betreiber}</p>` : ''}
        <p style="margin: 5px 0;"><strong>${t("map.popup.accessible")}:</strong> ${props.barrierefrei === 'ja' ? t("map.popup.yes") : t("map.popup.no")}</p>
        ${props.wickeltisch ? `<p style="margin: 5px 0;"><strong>${t("map.popup.changingTable")}:</strong> ${props.wickeltisch === 'ja' ? t("map.popup.yes") : t("map.popup.no")}</p>` : ''}
      </div>
    `;
  }

  content += '</div>';
  return content;
}

function onEachFeatureWithPopup(feature, layer, t) {
  const popupContent = createPopupContent(feature, t);
  layer.bindPopup(popupContent);
}

// Calculate the distance between a point and a line (route)
function getDistanceToRoute(pointCoords, routeCoords) {
  let minDistance = Infinity;

  for (let i = 0; i < routeCoords.length - 1; i++) {
    const segmentStart = L.latLng(routeCoords[i][1], routeCoords[i][0]);
    const segmentEnd = L.latLng(routeCoords[i + 1][1], routeCoords[i + 1][0]);
    const point = L.latLng(pointCoords[1], pointCoords[0]);

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

function MapContent({ routeData, radiusMeters, t }) {
  const map = useMap();
  console.log(routeData);

  if (routeData?.route) {
    const coords = routeData.route.geometry.coordinates;
    const latLngs = coords.map(([lon, lat]) => [lat, lon]);

    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  const getPoiStyle = (poiType) => {
    const styles = {
      toilet:   { color: "#1d4ed8", fillColor: "#2563eb", dashArray: "0" },
      elevator: { color: "#166534", fillColor: "#16a34a", dashArray: "6 3" },
      parking:  { color: "#991b1b", fillColor: "#dc2626", dashArray: "2 4" }
    };
    return styles[poiType] || { color: "#6b7280", fillColor: "#6b7280", dashArray: "0" };
  };

  const filteredPOIs = routeData?.route && routeData?.pois
    ? filterPOIsByDistance(
        routeData.pois,
        routeData.route.geometry.coordinates,
        radiusMeters
      )
    : routeData?.pois;

  return (
    <>
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

      {filteredPOIs && (
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
            onEachFeatureWithPopup(feature, layer, t);
          }}
        />
      )}

      {routeData?.route && (
        <div className="route-info">
          <p>
            <strong>{(routeData.route.properties.distance / 1000).toFixed(2)} km</strong>
          </p>
        </div>
      )}

      {routeData?.route && filteredPOIs?.features && (
        <div aria-live="polite" className="sr-only">
          {t("map.routeSummary", {
            distance: (routeData.route.properties.distance / 1000).toFixed(2),
            count: filteredPOIs.features.length
          })}
        </div>
      )}
    </>
  );
}

export default function MapPage() {
  const { t } = useTranslation("common");

  const [params] = useSearchParams();
  const start = params.get("start");
  const destination = params.get("destination");

  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const needs = user?.needs;
      return {
        show_toilets: needs?.toilets ?? true,
        show_elevators: needs?.elevators ?? true,
        show_parking: needs?.accessible_parking ?? true
      };
    } catch {
      return {
        show_toilets: true,
        show_elevators: true,
        show_parking: true
      };
    }
  });

  const [radiusMeters, setRadiusMeters] = useState(400);

  useEffect(() => {
    if (start && destination) {
      planRoute();
    }
  }, [start, destination, filters]);

  async function planRoute() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/plan-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: start,
          destination: destination,
          ...filters
        })
      });
      const data = await res.json();
      setRouteData(data);
    } catch (err) {
      setError(t("map.errorRoute"));
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
    console.log({ newFilters });
  }

  return (
    <main className="mapLayout">
      <div className="mapTopBar">
        <div>
          <strong>{t("map.start")}:</strong> {start || "-"}
        </div>
        <div>
          <strong>{t("map.destination")}:</strong> {destination || "-"}
        </div>
      </div>

      <div className="mapFilters" role="group" aria-label={t("map.filters.groupLabel")}>
        <details className="filtersSheet" open>
          <summary className="filtersSheetSummary">
            {t("map.filters.groupLabel")}
            <span className="filtersSheetMeta" aria-hidden="true">
              {radiusMeters} m
              </span>  
          </summary>

          <div className="filtersSheetBody">
            <label className="filterItem">
              <input
                type="checkbox"
                checked={filters.show_toilets}
                onChange={() => toggleFilter('show_toilets')}
              />
              <span className="markerDot markerDot--toilet" aria-hidden="true" />
              <span className="filterIcon" aria-hidden="true">🚻</span>
              <span className="filterText">
                <span className="filterTitle">{t("map.filters.toilets")}</span>
              </span>
            </label>

            <label className="filterItem">
              <input
                type="checkbox"
                checked={filters.show_elevators}
                onChange={() => toggleFilter("show_elevators")}
              />
              <span className="markerDot markerDot--elevator" aria-hidden="true" />
              <span className="filterIcon" aria-hidden="true">🛗</span>
              <span className="filterText">
                <span className="filterTitle">{t("map.filters.elevators")}</span>
              </span>
              <span className="filterBadge filterBadge--elevator" aria-hidden="true"></span>
            </label>

            <label className="filterItem">
              <input
                type="checkbox"
                checked={filters.show_parking}
                onChange={() => toggleFilter("show_parking")}
              />
              <span className="markerDot markerDot--parking" aria-hidden="true" />
              <span className="filterIcon" aria-hidden="true">♿</span>
              <span className="filterText">
                <span className="filterTitle">{t("map.filters.parking")}</span>
              </span>
              <span className="filterBadge filterBadge--parking" aria-hidden="true"></span>
            </label>

            <p className="filtersHint" id="radius-hint">
              {t("map.filters.shownWithin", { distance: radiusMeters })}
            </p>

            <details className="filtersExpander">
              <summary className="filtersExpanderSummary">{t("map.filters.adjustDistance")}</summary>

              <div className="radiusControls" role="group" aria-label={t("map.filters.distanceFromRoute")}>
                <label className="radiusRow">
                  <span className="radiusLabel">{t("map.filters.distance")}</span>
                  <input
                    type="range"
                    min={100}
                    max={1200}
                    step={50}
                    value={radiusMeters}
                    onChange={(e) => setRadiusMeters(Number(e.target.value))}
                    aria-describedby="radius-hint"
                  />
                </label>

                <label className="radiusRow">
                  <span className="radiusLabel">{t("map.filters.meters")}</span>
                  <input
                    className="radiusNumber"
                    type="number"
                    min={100}
                    max={1200}
                    step={50}
                    value={radiusMeters}
                    onChange={(e) => setRadiusMeters(Number(e.target.value))}
                    aria-describedby="radius-hint"
                    inputMode="numeric"
                  />
                </label>

                <div className="radiusActions">
                  <button
                    type="button"
                    className="radiusReset"
                    onClick={() => setRadiusMeters(400)}
                  >
                    {t("map.filters.reset", { value: 400 })}
                  </button>

                  <span className="radiusCurrent" aria-live="polite">
                    {t("map.filters.current", { value: radiusMeters })}
                  </span>
                </div>
              </div>
            </details>
          </div>
        </details>
      </div>

      <div className="mapArea">
        {loading && <div className="loading">{t("map.loading")}</div>}
        {error && <div className="error">{error}</div>}

        <GeoJsonMap>
          {routeData && (
            <MapContent
              routeData={routeData}
              radiusMeters={radiusMeters}
              t={t}
            />
          )}
        </GeoJsonMap>
      </div>
    </main>
  );
}
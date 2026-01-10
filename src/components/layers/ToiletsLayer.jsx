import { useEffect, useState } from "react"

export default function ToiletsLayer({children}) {
    const [geoJson, setGeoJson] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const url =
        "https://gdi.berlin.de/services/wfs/toiletten?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=toiletten&SRSNAME=EPSG:4326&OUTPUTFORMAT=application/json"
        
        let cancelled = false;

        fetch(url)
        .then((res) => {
            if(!res.ok) throw new Error(`WFS request failed: ${res.status}`);
            return res.json();
        })
        .then((data) => {
            if (cancelled) return;
            setGeoJson(data);
        })
        .catch((e) => {
            if (cancelled) return;
            console.error(e);
            setError(e);
        });

        return () => {
            cancelled = true;
        };
     }, []);

     if (typeof children !=="function") {
        return null;
     }
    
     return children({geoJson, error});

}
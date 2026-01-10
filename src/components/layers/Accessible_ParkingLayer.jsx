import { useEffect, useState } from "react"

export default function AccessibleParkingLayer({children}) {
    const [geoJson, setGeoJson] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const url = "http://127.0.0.1:5000/api/accessible_parking";

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
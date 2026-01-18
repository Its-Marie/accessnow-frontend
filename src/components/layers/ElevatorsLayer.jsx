import { useEffect,useState } from "react";

export default function ElevatorsLayer({children}) {
    const [geoJson, setGeoJson] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {   
        let cancelled = false;
        
        fetch("http://127.0.0.1:5000//api/elevators")
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json();
            })
            .then((data) => {
                if (!cancelled) setGeoJson(data);
            })
            .catch((err) => {
                if(!cancelled) setError(err);
            });
        return () => {
            cancelled = true;
        };
    }, []);
    return children({ geoJson, error});
}
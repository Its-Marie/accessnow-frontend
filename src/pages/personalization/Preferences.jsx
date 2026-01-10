import { Link, useLocation } from "react-router-dom"

export default function Preferences () {
    const location = useLocation()
    return(
        <>
            <h1>Preferences</h1>
            <h2>{location.pathname}</h2>
            <Link to="/">Home</Link>
        </>
        
    )
}
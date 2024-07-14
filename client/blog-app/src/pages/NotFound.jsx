import React from "react";
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div style={{ marginTop: "60px"}}>
            <h1>Page does not exist</h1>
            <Link to={ "/" }></Link>
        </div>
    );
}

export default NotFound;
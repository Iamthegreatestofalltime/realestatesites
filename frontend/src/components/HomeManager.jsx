import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';

function HomeManager () {
    return (
        <div>
            <h1>
                Home manager page
            </h1>
            <Link to="/home">
                <button>Home Page</button>
            </Link>
            <Link to="/addhome">
                <button>Add Home</button>
            </Link>
        </div>
    );
}

export default HomeManager;
import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import ListingForm from "./ListingForm";

function AddHome() {
    return(
        <div>
            <Link to="/home">
                <button className="homebuttonlistingform">Home</button>
            </Link>
            <div className="AddHomeDiv">
                <h3>
                    Add your home
                </h3>
                <ListingForm/>
            </div>
        </div>
    );
}

export default AddHome;
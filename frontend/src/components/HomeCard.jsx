import React from "react";
import { Link } from "react-router-dom";
import '../App.css';

function HomeCard({ home, className }) {
    const imageUrl = home.images && home.images[0] ? `https://myrealestatesite-7ca87f3d6001.herokuapp.com/${home.images[0]}` : ''; // Defaulting to the first image

    return (
        <div className={`HomePreviewCard ${className}`}>
            <img className="listingimagefront" src={imageUrl} alt="Home preview" />
            <div className="HomeCardText">
                <p className="PricePreview">${home.price}+</p>
                <div>
                    <p>{home.beds} beds</p>
                    <p>{home.baths} baths</p>
                    <p>{home.squareFeet} square feet</p>
                </div>
                <p>Location: {home.address}</p>
                <Link to={`/home/${home._id}`}>View Details</Link>
            </div>
        </div>
    );
}

export default HomeCard;
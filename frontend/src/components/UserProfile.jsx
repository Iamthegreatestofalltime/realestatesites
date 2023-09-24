import React, { useEffect, useState } from "react";
import jwt from 'jsonwebtoken';
import '../App.css';
import HomeCard from "./HomeCard";
import HousePlace from '../assets/HousePlace.jpg';
import {Link} from 'react-router-dom';

function UserProfile() {
    const [homes, setHomes] = useState([]);
    const [savedHomes, setSavedHomes] = useState([]);

    const getUserIdFromToken = () => {
        try {
            const token = localStorage.getItem('authToken');
            const decoded = jwt.decode(token); 
            return decoded.id; // Note that the property in the decoded token for user's ID is "id" not "userId"
        } catch (error) {
            return null;
        }
    };

    const userId = getUserIdFromToken();

    useEffect(() => {
        if (userId) {
            // Fetch user's listings
            fetch(`http://localhost:5000/api/homes?userId=${userId}`)
                .then(res => res.json())
                .then(data => {
                    setHomes(data);
                })
                .catch(err => console.error("Error fetching homes:", err));

            // Fetch user's saved listings
            fetch(`http://localhost:5000/api/saved-listings`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setSavedHomes(data);
                })
                .catch(err => console.error("Error fetching saved homes:", err));
        }
    }, [userId]); 

    return (
        <div>
            <div className="NavDiv">
            <img className="Logo" src={HousePlace} alt="HousePlaceLogo" />
            <Link to="/addhome">
                <button className="SellButton">Sell</button>
            </Link>
            <Link to="/addhome">
                <button className="RentButton">Rent</button>
            </Link>
            <Link to="/home">
                <button className="UserProfileHomeButton">Home</button>
            </Link>
            </div>
            <h1 className="ProfileTitles">Your Listings:</h1>
            <div className="listings-container">
                {homes.map(home =>
                    <div className="listing-item" key={home._id}>
                        <HomeCard className="createdlistingsprofile" home={home} />
                    </div>
                )}
            </div>
            <h1 className="ProfileTitles">Saved Listings:</h1>
            <div className="listings-container">
                {savedHomes.map(home =>
                    <div className="listing-item" key={home._id}>
                        <HomeCard className="savedlistingsprofile" home={home} />
                    </div>
                )}
            </div>
        </div>
    );    
}

export default UserProfile;
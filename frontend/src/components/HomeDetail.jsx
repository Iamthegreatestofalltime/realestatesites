import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import jwt from 'jsonwebtoken'; 

function HomeDetail() {
    const [home, setHome] = useState(null);
    const { id } = useParams();
    // State to determine if the listing is saved
    const [isSaved, setIsSaved] = useState(false);
    const [contactDetails, setContactDetails] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
        user_email: '',     // New field
        user_password: ''   // New field
    });

    const handleContactChange = e => {
        const { name, value } = e.target;
        setContactDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleContactSubmit = e => {
        e.preventDefault();
        console.log("Submitting contact details:", contactDetails);
        axios.post(`http://localhost:5000/api/contact-lister/${id}`, contactDetails, {
            headers: { /* any headers if needed */ }
        }).then(response => {
            console.log("Response from server:", response.data);
            alert('Message sent successfully');
        }).catch(error => {
            alert('Error sending message');
            console.log("Home state:", home);
            console.log("Contact details state:", contactDetails);
            console.error('Error sending the message:', error.message);
        });
    };

    const toggleSave = () => {
        if (isSaved) {
            unsaveListing();
        } else {
            saveListing();
        }
    };

    // Update functions to modify the isSaved state after action
    const saveListing = () => {
        const token = localStorage.getItem('authToken');
        axios.post('http://localhost:5000/api/save-listing', { listingId: id }, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(() => {
            alert('Listing saved!');
            setIsSaved(true); // Set saved state to true
        })
        .catch(error => console.error('Error saving the listing:', error.message));
    };

    const unsaveListing = () => {
        const token = localStorage.getItem('authToken');
        axios.delete(`http://localhost:5000/api/unsave-listing/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(() => {
            alert('Listing unsaved!');
            setIsSaved(false); // Set saved state to false
        })
        .catch(error => console.error('Error unsaving the listing:', error.message));
    };

    const getUserIdFromToken = () => {
        try {
            const token = localStorage.getItem('authToken');
            const decoded = jwt.decode(token); 
            return decoded.id; // Note that the property in the decoded token for user's ID is "id" not "userId"
        } catch (error) {
            return null;
        }
    };

    const currentUserId = getUserIdFromToken();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/homes/${id}`)
            .then(response => {
                setHome(response.data);
            })
            .catch(error => {
                console.error('Error fetching home details:', error.message);
            });
    }, [id]);

    const handleDelete = () => {
        const token = localStorage.getItem('authToken');
    
        axios.delete(`http://localhost:5000/api/homes/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            alert('Listing deleted successfully');
            window.location.href = '/home'; // redirect to home or another suitable page after deletion
        })
        .catch(error => {
            alert('Error deleting listing');
            console.error('Error deleting the listing:', error.message);
        });
    };    

    if (!home) {
        return <p>Loading...</p>;
    }

    let x = Math.round((home.price * 0.8) / 120);

    return (
        <div className="HomeDetailsCard">
            <div className="detailstopdiv">
                <Link to="/home">
                    <button className="homeicondetails">
                        Home
                    </button>
                </Link>
                <Link to="/addhome">
                    <button className="SellButtonDetails">Sell</button>
                </Link>
                <Link to="/addhome">
                    <button className="RentButtonDetails">Rent</button>
                </Link>
                <button className="savebuttondetails" onClick={toggleSave}>{isSaved ? 'Unsave Listing' : 'Save Listing'}</button>
                {home.userId && home.userId === currentUserId && (
                    <>
                        <Link to={`/edit-listing/${id}`}>
                            <button className="editlistingdetails">Edit Listing</button>
                        </Link>
                        <button className="DeleteListingDetails" onClick={handleDelete}>Delete Listing</button>
                    </>
                )}
            </div>
            <div className="ContactFormPopup">
                    <form onSubmit={handleContactSubmit}>
                        <h1 className="ContactFormTitle">Contact Lister</h1>
                        <input 
                            className="nameforminput"
                            type="text" 
                            placeholder="Name"
                            name="name"
                            value={contactDetails.name}
                            onChange={handleContactChange}
                        />
                        <input 
                            className="phoneforminput"
                            type="text" 
                            placeholder="Phone"
                            name="phone"
                            value={contactDetails.phone}
                            onChange={handleContactChange}
                        />
                        <input 
                            className="emailforminput"
                            type="email" 
                            placeholder="Your Email"
                            name="user_email"
                            value={contactDetails.user_email}
                            onChange={handleContactChange}
                        />
                        <textarea 
                            className="messageforminput"
                            placeholder="Message"
                            name="message"
                            value={contactDetails.message}
                            onChange={handleContactChange}
                        />
                        <button className="contactbutton" type="submit">Contact</button>
                    </form>
                </div>
            <div className="HomeDetailsOuterContainer">
                <div className="HomeDetailsImagesContainer">
                    <div className="HomeDetailsMainImageContainer">
                        <img className="HomeDetailsMainImage" src={`http://localhost:5000/${home.images[0]}`} alt="Main Home" />
                    </div>
                    <div className="HomeDetailsSubImagesContainer">
                        {home.images.slice(1, 5).map((img, index) => (
                            <div key={index} className="HomeDetailsSubImageContainer">
                                <img className="HomeDetailsSubImage" src={`http://localhost:5000/${img}`} alt={`Home ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="textdiv">
                <h1 className="detailsprice">${Number(home.price).toLocaleString()}</h1>
                <p className="addresstextstylingdetails">{home.address}, {home.city}, {home.zipcode}</p>
                <p className="estpaymenttext">Your payment est.:${x}/mo</p>
                <p className="Bedsdetailstext">{home.beds} Beds</p>
                <p className="BathsDetailstext">{home.baths} Baths</p>
                <p className="SqftDetailstext">{home.squareFeet} sqft</p>
                <h1>What's Special</h1>
                <div className="features-container">
                    {home.features.map((feature, index) => (
                        <div className="feature-box" key={index}>
                            {feature}
                        </div>
                    ))}
                </div>
                <h1>Description</h1>
                <div className="descriptiondiv">
                    <p className="descriptiontext">{home.description}</p>
                </div>
            </div>
        </div>
    );
}

export default HomeDetail;
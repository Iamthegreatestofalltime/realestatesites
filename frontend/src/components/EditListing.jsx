import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import ListingForm from './ListingForm';

function EditListing() {
    const [home, setHome] = useState(null);
    const { homeId } = useParams();

    useEffect(() => {
        const fetchHomeDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/homes/${homeId}`);
                setHome(response.data);
            } catch (error) {
                console.error('Error fetching home details:', error.message);
            }
        };

        fetchHomeDetails();
    }, [homeId]);

    if (!home) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <ListingForm home={home} homeId={home._id} />
        </div>
    );
}

export default EditListing;
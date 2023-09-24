import React, { useEffect, useState } from "react";
import HomeCard from "./HomeCard";

function HomePreview() {
    const [homes, setHomes] = useState([]);

    useEffect(() => {
        // Fetching the first 10 homes
        fetch("http://localhost:5000/api/homes?limit=10")
            .then(res => res.json())
            .then(data => setHomes(data))
            .catch(err => console.error("Error fetching homes:", err));
    }, []);

    return (
        <div className="home-preview-container">
            <div className="scroll-container">
                {homes.map(home => <HomeCard key={home._id} home={home} />)}
            </div>
        </div>
    );
}

export default HomePreview;
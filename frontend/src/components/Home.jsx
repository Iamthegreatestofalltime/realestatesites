import React, {useState} from "react";
import { Link } from "react-router-dom";
import HomePreview from "./HomePreview";
import HomeCard from "./HomeCard";
import axios from "axios";
import HousePlace from '../assets/HousePlace.jpg';

function Home() {
    const [search, setSearch] = useState("");
    const [homes, setHomes] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("authToken")));
    const [isHovering, setIsHovering] = useState(false);


    const handleSearch = async (e) => {
        e.preventDefault();
        console.log("button submitted");
    
        try {
            const response = await axios.get(`http://localhost:5000/api/search?q=${search}`);
            console.log("we in the try frontend block");
            setHomes(response.data); // With axios, you can directly access .data
        } catch (err) {
            console.log("frontend catch block");
            console.error("Error fetching homes:", err);
        }
    }     

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        window.location.href = "/home"; // Redirecting to home after logout
    };    

    return (
        <div className="Home">
            <div className="NavDiv">
            <div className="logout-area">
                <div className="profile-button">Profile</div>
                <div className="profile-dropdown">
                    {isAuthenticated ? (
                        <>
                            <Link to="/userprofile">My Profile</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login">Log in</Link>
                    )}
                </div>
            </div>
            <img className="Logo" src={HousePlace} alt="HousePlaceLogo" />
            <Link to="/addhome">
                <button className="SellButton">Sell</button>
            </Link>
            <Link to="/addhome">
                <button className="RentButton">Rent</button>
            </Link>
            </div>
            <div>
                <img src="https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2023/07/1920w_nationalbrand.webp" alt="background" className="backgroundimagesearch"/>
                <div className="searchdiv">
                    <form onSubmit={handleSearch}>
                        <input className="searchbar" type="text" value={search} placeholder="search homes" onChange={(e) => setSearch(e.target.value)}/>
                        <button className="searchbutton" type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="searchbuttonss">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
            <div className="search-results">
                {homes.map((home, index) => (
                    <div>
                        <HomeCard className="searchresult" key={home._id} home={home} />
                    </div>
                ))}
            </div>
            <div className="HomePreviewbackpartdiv">
                <h3>Recommended Homes</h3>
                <HomePreview />
            </div>
            <section className="optionssection">
                <div>
                    <div className="buyhomeservicediv">
                        <img className="serviceimages" src="https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2022/07/Buy_a_home.png" alt="home" />
                        <div className="servicetextdiv">
                            <h1 className="ServiceMainText">Buy a home</h1>
                            <p className="ServiceSubText">Find your place with an immersive photo experience and the most listings, including things you won’t find anywhere else.</p>
                            <button className="servicebuttons">Browse Homes</button>
                        </div>
                    </div>
                    <div className="sellservicediv">
                        <img className="serviceimages" src="https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2022/07/Sell_a_home.png" alt="sell" />
                        <div className="servicetextdiv">
                            <h1 className="ServiceMainText">Sell a home</h1>
                            <p className="ServiceSubText">No matter what path you take to sell your home, we can help you navigate a successful sale.</p>
                            {isAuthenticated ? (
                                <Link to="/addhome">
                                    <button className="servicebuttons">Sell Home</button>
                                </Link>
                            ) : (
                                <Link to="/login">
                                    <button className="servicebuttons">Login</button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <section className="customerreviews">
                <div>
                    <h1 className="reviewsTitlePage">What our customers have to say</h1>
                    <div className="review1">
                        <img className="reviewimage" src="https://photos.zillowstatic.com/fp/6fbee74e987085d9d4f648b54d91a0da-p_e.jpg" alt="house" />
                        <div className="noimagereview">
                            <p className="stars">★★★★★</p>
                            <h3 className="reviewTitle">A Seamless Experience!</h3>
                            <p className="reviewstext">I was initially overwhelmed with the idea of buying my first home, but this platform made the process incredibly seamless. The detailed listings, virtual tours, and the agent support ensured that I found the perfect home within my budget. The neighborhood insights were the cherry on top! Highly recommend to anyone in the home market.</p>
                        </div>
                    </div>
                    <div className="review2">
                        <img className="reviewimage" src="https://photos.zillowstatic.com/fp/c1246b380a58939f4f755532fdca6bd8-p_e.jpg" alt="house" />
                        <div className="noimagereview">
                            <p className="stars">★★★★★</p>
                            <h3 className="reviewTitle">Sold in No Time!</h3>
                            <p className="reviewstext">Selling my home was a breeze thanks to this amazing platform. The ease with which I could list my property, the exposure it got, and the assistance from top-notch agents led to a quick sale at a great price. The communication and transparency throughout the process were commendable. Five stars well-deserved!</p>
                        </div>
                    </div>
                    <div className="review3">
                        <img className="reviewimage" src="https://photos.zillowstatic.com/fp/9e76c058880c378bce1a685ce0435891-p_e.jpg" alt="house" />
                        <div className="noimagereview">
                            <p className="stars">★★★★★</p>
                            <h3 className="reviewTitle">The Ultimate Home Shopping Experience!</h3>
                            <p className="reviewstext">This platform is a game-changer in the real estate market. I was able to explore homes in different neighborhoods without leaving my couch, and the detailed filters helped narrow down my search effortlessly. The customer support was stellar, always ready to answer my questions. I found my dream home and couldn’t be happier. Highly recommend!</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="socialssection">
                <div className="socialsdiv">
                    <h4 className="socialstitle">Follow us on our socials!</h4>
                    <img className="instalogo" src="https://pluspng.com/img-png/instagram-logo-eps-png-instagram-logo-1784.png" alt="instagram logo" />
                    <img className="facelogo" src="https://louisville.edu/mcconnellcenter/images/facebook_logos_PNG19748.png/image" alt="Facebook logo" />
                    <img className="tiktoklogo" src="https://logodownload.org/wp-content/uploads/2019/08/tiktok-logo-icon.png" alt="Tiktok logo" />
                    <img className="xlogo" src="https://i.pinimg.com/originals/40/49/12/404912f7919262c4b8bcbec085a55f60.png" alt="X/Twitter logo" />
                </div>
            </section>
        </div>
    );
}

export default Home;
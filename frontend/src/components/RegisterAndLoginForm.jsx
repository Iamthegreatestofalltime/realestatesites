import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "./UserContext.jsx";

export default function RegisterAndLoginForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');  // For error handling
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');
    const [email, setEmail] = useState('');
    const { setUsername: setLoggedInUsername, setId, setToken } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = isLoginOrRegister === 'register' 
        ? { username, password, email }  // include email in the payload for registration
        : { username, password };  // keep as is for login

        const url = isLoginOrRegister === 'register' 
            ? 'https://myrealestatesite-7ca87f3d6001.herokuapp.com/register' 
            : 'https://myrealestatesite-7ca87f3d6001.herokuapp.com/login';

        try {
            const response = await axios.post(url, payload);
            
            if (response && response.data) {
                if (isLoginOrRegister === 'login' && response.data.token) {
                    setToken(response.data.token);
                    localStorage.setItem("authToken", response.data.token);
                    setLoggedInUsername(username);
                    setId(response.data.id);
                    navigate("/home");
                } else if (isLoginOrRegister === 'register') {
                    // Handle registration response, e.g. display a confirmation message or auto-login the user.
                    setIsLoginOrRegister('login');  // Switch to login after successful registration
                }
            } else {
                setError("Unexpected server response. Please try again.");
            }
    
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    }

    return(
        <div className="loginpage">
            <form onSubmit={handleSubmit}>
                <div className="logindivstuff">
                        {isLoginOrRegister === 'register' && (
                            <div>
                                <h1 className="loginregistertitletext">Register</h1>
                            </div>
                        )}
                        {isLoginOrRegister === 'login' && (
                            <div>
                                <h1 className="loginregistertitletext">Login</h1>
                            </div>
                        )}
                    <input value={username} 
                        className="UsernameField"
                        onChange={e => setUsername(e.target.value)} 
                        type="text" 
                        placeholder="Username" 
                    />
                    {isLoginOrRegister === 'register' && (
                        <input value={email}
                            className="emailfieldregister"
                            onChange={e => setEmail(e.target.value)}
                            type="email" 
                            placeholder="Email" 
                            required
                        />
                    )}
                    <input value={password} 
                        className="passwordfieldregister"
                        type="password" 
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password" 
                    />
                    <button className="registerloginbutton">
                        {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                    </button>
                    <div className="registerswitchloginstuff">
                        {isLoginOrRegister === 'register' && (
                            <div>
                                Already a member?
                                <button className="switchbutton" onClick={() => setIsLoginOrRegister('login')}>
                                    Login here
                                </button>
                            </div>
                        )}
                        {isLoginOrRegister === 'login' && (
                            <div>
                                Don't have an account?
                                <button className="switchbutton" onClick={() => setIsLoginOrRegister('register')}>
                                    Register
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
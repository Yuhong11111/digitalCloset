import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function HomePage() {
    const navigate = useNavigate();

    // const testBackendConnection = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:8000/');
    //         alert(response.data.message);
    //     } catch (error) {
    //         alert('Failed to connect to backend');
    //     }
    // };
    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <button
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '10px 20px',
                    backgroundColor: 'blue',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
                onClick={() => navigate('/login')}
            >
                Log in/Sign in
            </button>
            <h1>Welcome to the Digital Closet</h1>
            {/* <button onClick={testBackendConnection}>Test Backend Connection</button> */}
        </div>
    );
}

export default HomePage;
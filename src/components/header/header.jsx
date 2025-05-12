import React from 'react';
import styles from './header.module.css'
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

function Header() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch(`${API}/logout`, {
            method: 'GET',
            credentials: 'include'
        });
        navigate('/');
    };

    return(
        <div className={styles.source}>
            <div className={styles.titleContainer}>
                Insta-Fit
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={handleLogout}>
                    Log Out
                </button>
            </div>
        </div>
    );
}

export default Header;
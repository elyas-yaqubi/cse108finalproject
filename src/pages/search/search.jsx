import { useState } from 'react';
import styles from './search.module.css';
import { Sidebar, Header, FollowBar } from '../../components/index.js';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === '') {
            setResults([]);
            return;
        }

        try {
            const response = await axios.post(`${API}/searchUsers`, { query: value }, { withCredentials: true });
            setResults(response.data.results);
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleFollow = async (userId, isFollowing) => {
        try {
            if (isFollowing) {
                await axios.post(`${API}/unfollow`, { targetId: userId }, { withCredentials: true });
            } else {
                await axios.post(`${API}/follow`, { targetId: userId }, { withCredentials: true });
            }

            setResults(prev =>
                prev.map(user =>
                    user.userId === userId ? { ...user, isFollowing: !isFollowing } : user
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}><Header /></div>
            <div className={styles.body}>
                <div className={styles.sidebar}><Sidebar /></div>
                <div className={styles.contentContainer}>
                    <div className={styles.pad}>
                        <div className={styles.content}>
                            <input
                                className={styles.searchBar}
                                placeholder='Enter a username'
                                value={query}
                                onChange={handleChange}
                            />
                            {results.map((user) => (
                                <div key={user.userId} className={styles.resultContainer}>
                                    <div className={styles.iconContainer}>
                                        {user.profileImage ? (
                                            <img
                                                src={`data:image/jpeg;base64,${user.profileImage}`}
                                                alt="Profile"
                                                className={styles.imgPreview}
                                                style={{ height: '100px', width: '100px', borderRadius: '50%' }}
                                            />
                                        ) : (
                                            <div style={{ color: 'white' }}>No Image</div>
                                        )}
                                    </div>
                                    <div className={styles.dataContainer}>
                                        <div className={styles.padding}>
                                            <div className={styles.username}>{user.username}</div>
                                        </div>
                                        <div className={styles.padding}>
                                            <button
                                                className={styles.followButton}
                                                onClick={() => handleToggleFollow(user.userId, user.isFollowing)}
                                            >
                                                {user.isFollowing ? 'Unfollow' : 'Follow'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.followBar}><FollowBar /></div>
            </div>
        </div>
    );
}

export default Search;

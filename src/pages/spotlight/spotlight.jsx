import styles from './spotlight.module.css'
import { loadPosts } from './useSpotlight.js';
import { Sidebar, Header, FollowBar } from '../../components/index.js';
import { useState, useEffect } from 'react';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const API = import.meta.env.VITE_API_URL;

function Spotlight() {
    const postList = loadPosts();
    const [likedPosts, setLikedPosts] = useState({});
    const [likeCounts, setLikeCounts] = useState({});

    useEffect(() => {
        if (postList?.posts) {
            setLikedPosts(Object.fromEntries(postList.posts.map(p => [p.postId, p.liked])));
            setLikeCounts(Object.fromEntries(postList.posts.map(p => [p.postId, p.likeCnt])));
        }
    }, [postList]); 

    const toggleLike = async (postId) => {
        // API Call: Add/Remove a like from post in the database
        const res = await fetch(`${API}/toggleLike`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId }),
        });

        if (res.ok) {
            const data = await res.json();
            setLikedPosts(prev => ({ ...prev, [postId]: data.liked }));
            setLikeCounts(prev => ({ ...prev, [postId]: prev[postId] + (data.liked ? 1 : -1)}));
        }
    };

    return(
        <div className={styles.container}>     
            <div className={styles.header}>
                <Header />
            </div>
            <div className={styles.body}>
                <div className={styles.sidebar}>
                    <Sidebar />
                </div>
                <div className={styles.content}>
                    <div className={styles.pad}>
                        {/* Create post card for all post elements returned */}
                        {postList && postList.posts.map((post, index) => (
                            <div key={index} className={styles.postCard}>
                                {/* Image + post data */}
                                <img src={`data:image/png;base64,${post.image}`} alt={`Post ${index}`} />
                                <p className={styles.paragraph}>{post.description}</p>
                                <p>Likes: {likeCounts[post.postId] ?? post.likeCnt}</p>

                                {/* Like button */}
                                <button className={styles.button} onClick={() => toggleLike(post.postId)}>
                                    {likedPosts[post.postId] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </button>

                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.followBar}>
                    <FollowBar />
                </div>
            </div>
        </div>
    )
}

export default Spotlight
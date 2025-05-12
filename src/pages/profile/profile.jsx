import { useEffect, useState } from 'react'
import styles from './profile.module.css'
import { loadData, loadPosts } from './useProfile.js';
import { Sidebar, Header, FollowBar } from '../../components/index.js';

const API = import.meta.env.VITE_API_URL;

function Profile() {
    // Collect users data and every post made by them
    const userData = loadData();
    const postList = loadPosts();

    // Bio change helpers
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState(userData?.data?.[3] || '');


    useEffect(() => {
        if (userData?.data) setBio(userData.data[3]);
    }, [userData]);

    const handleBioSave = async () => {
        setIsEditing(false);

        try {
            //API Call: Change users bio content in database
            const res = await fetch(`${API}/updateBio`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ bio }),
            });

            if (!res.ok) { console.error('Failed to update bio'); }
        } catch (err) {
            console.error('Error updating bio:', err);
        }
    };

    console.log(postList);

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
                        <div className={styles.profileHeader}>
                            <div className={styles.iconContainer} onClick={() => document.getElementById('profileUpload').click()}>
                                {userData?.profileImage ? (
                                    // Display image if availabe
                                    <img src={`data:image/png;base64,${userData.profileImage}`} alt="Profile" className={styles.profileImage}/>
                                ) : (
                                    // Default to text if no image
                                    <p style={{ color: 'white', textAlign: 'center' }}>Upload</p>
                                )}

                                {/* Allow user to click on profile element to upload a custom image */}
                                <input type="file" id="profileUpload" accept="image/png" style={{ display: 'none' }} onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    const formData = new FormData();
                                    formData.append('image', file);

                                    //API Call: Store new profile picture in database
                                    const res = await fetch(`${API}/uploadProfilePicture`, {
                                        method: 'POST',
                                        credentials: 'include',
                                        body: formData,
                                    });

                                    // Refresh page to show picture if upload success
                                    if (res.ok) {window.location.reload();}
                                    else {alert('Failed to upload profile picture')};
                                    }}
                                />
                            </div>
                            <div className={styles.statsContainer}>
                                {/* Render userdata if userData exists, otherwirse skip (false) */}
                                <div>{userData && <p>{userData.data[0]}</p>}</div>
                                <div>{userData && <p>Post Count: {userData.data[6]}</p>}</div>
                                <div>{userData && <p>{userData.data[1]} {userData.data[2]}</p>}</div>
                                <div>{userData && <p>Followers: {userData.data[4]} Following: {userData.data[5]}</p>}</div>
                            </div>
                        </div>
                        <div className={styles.bioContainer} onClick={() => setIsEditing(true)}>
                            {userData && !isEditing ? (<p>{bio}</p>):(
                            <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} onBlur={handleBioSave} autoFocus />)}
                        </div>
                        <div className={styles.postContainer}>
                            {/* Generate post cards for every element in post list */}
                            {postList && postList.posts.map((post, index) => (
                                <div key={index} className={styles.postCard}>
                                    <img src={`data:image/png;base64,${post.image}`} alt={`Post ${index}`} />
                                    <p>{post.description}</p>
                                    <p>Likes: {post.likeCnt}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.followBar}>
                    <FollowBar />
                </div>
            </div>
        </div>
    )
}

export default Profile
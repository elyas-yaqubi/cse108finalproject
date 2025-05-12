import { useRef, useState } from 'react'
import styles from './camera.module.css'
import { Sidebar, Header, FollowBar } from '../../components/index.js';

const API = import.meta.env.VITE_API_URL;

function Camera() {
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        const formData = new FormData();
        const file = fileInputRef.current.files[0];
        const description = document.querySelector('textarea').value;

        if (!file || !description) {
            alert("Image and description are required.");
            return;
        }

        formData.append('image', file);
        formData.append('description', description);

        try {
            const response = await fetch(`${API}/api/upload`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const text = await response.text();
            if (response.ok) {
                alert("Image uploaded successfully!");
                setImagePreview(null); // Clear preview
            } else {
                alert(`Upload failed: ${text}`);
            }

        } catch (err) {
            console.error("Upload error:", err);
            alert("Something went wrong during upload.");
        }
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleClick = () => {
        fileInputRef.current.click(); // Open file picker
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
                <div className={styles.contentContainer}>
                    <div className={styles.content}>
                        <form className={styles.form} onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                            <input ref={fileInputRef} type="file" name="image" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} required />
                            <div onClick={handleClick} className={styles.imgInput}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className={styles.imgPreview} />
                                ) : (
                                    "Click to upload an image"
                                )}
                            </div>

                            <textarea className={styles.description} type="description" placeholder="Write a description!" required></textarea>
                            <button className={styles.postBtn} type="submit"> Post Image</button>
                        </form>
                    </div>
                </div>
                <div className={styles.followBar}>
                    <FollowBar />
                </div>
            </div>
        </div>
    )
}

export default Camera
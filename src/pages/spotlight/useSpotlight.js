import { useState, useEffect } from 'react'
const API = import.meta.env.VITE_API_URL;

export function loadPosts() {
    // Set postList to fetchPosts return values
    const [postList, returnPosts] = useState(null);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // API call: get 12 random posts from the database to display on the spotlight
                const response = await fetch(`${API}/getRandomPosts`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({}) // no username = use current_user
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }

                // return all retrieved posts
                const data = await response.json();
                returnPosts(data)
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
        }, []);

    // return all retrieved posts
    return postList;
}

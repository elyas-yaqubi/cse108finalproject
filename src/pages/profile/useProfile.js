import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_URL;

export function loadData() {
    // Set userData to fetchUserInfo return values
    const [userData, returnData] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                //API call: Get current user info from database (Fname, Lname, Username, etc...)
                const response = await fetch(`${API}/getInfo`, {
                    method: 'POST',
                    credentials: 'include',
                });

                if(!response.ok){ throw new Error('Failed to fetch use data'); }

                // Return all retrieved user info
                const result = await response.json();
                returnData(result);
            } catch (err) {
                console.error(err);
            }
        }

        // Return all retrieved user info
        fetchUserInfo();
    }, []);

    return userData;
}

export function loadPosts() {
    // Set postList to returnPosts return values
    const [postList, returnPosts] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // API call: Fetch all posts by currect user
                const response = await fetch(`${API}/getPosts`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({}) // no username = use current_user
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }

                // Return list of posts by current user
                const data = await response.json();
                returnPosts(data)
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
        }, []);

    // Return list of posts by current user
    return postList;
}
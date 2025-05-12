const API = import.meta.env.VITE_API_URL;

export async function createNewUser(firstName, lastName, username, password) {
    try {
        const response = await fetch(`${API}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({firstName, lastName, username, password})
        });
    } catch (error) {
        console.error('Sign up error', error);
        return false;
    }
}
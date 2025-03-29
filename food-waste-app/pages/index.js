
import { useEffect, useState } from 'react';

export default function Home() {
    const [menu, setMenu] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMenuData() {
            try {
                const response = await fetch('/api/menu');
                if (!response.ok) {
                    throw new Error('Failed to fetch menu');
                }
                const data = await response.json();
                setMenu(data);
            } catch (error) {
                setError(error.message);
            }
        }
        fetchMenuData();
    }, []);

    return (
        <div>
            <h1>Valentine Hall Dinner Menu</h1>
            {error && <p>Error: {error}</p>}
            {menu ? (
                <pre>{JSON.stringify(menu, null, 2)}</pre>
            ) : (
                <p>Loading menu...</p>
            )}
        </div>
    );
}

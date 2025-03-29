// pages/index.js
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
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Valentine Hall Dinner Menu</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {menu ? (
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    {menu.days.map((day, index) => (
                        <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                            <h2 style={{ textAlign: 'center' }}>{day.date}</h2>
                            {day.menu_items.map((item, i) => (
                                <div key={i} style={{ padding: '5px 0' }}>
                                    {item.is_section_title ? (
                                        <h3 style={{ marginBottom: '5px', borderBottom: '1px solid #ccc' }}>{item.text}</h3>
                                    ) : (
                                        <p>{item.food?.name || 'Unnamed Dish'}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: 'center' }}>Loading menu...</p>
            )}
        </div>
    );
}

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function Home() {
    const [menu, setMenu] = useState(null);
    const [error, setError] = useState(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [selectedMeal, setSelectedMeal] = useState('Breakfast');

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
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>Valentine Hall Menu</h1>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}
            {menu ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                            <button 
                                key={meal} 
                                onClick={() => setSelectedMeal(meal)} 
                                style={{
                                    padding: '10px 20px',
                                    margin: '0 5px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    backgroundColor: selectedMeal === meal ? '#007bff' : '#ddd',
                                    color: selectedMeal === meal ? '#fff' : '#000',
                                    cursor: 'pointer'
                                }}
                            >
                                {meal}
                            </button>
                        ))}
                    </div>
                    <Swiper 
                        spaceBetween={10} 
                        slidesPerView={1} 
                        navigation 
                        modules={[Navigation]}
                        style={{ marginBottom: '20px' }}
                        onSlideChange={(swiper) => setSelectedDayIndex(swiper.activeIndex)}
                    >
                        {menu.days.map((day, index) => (
                            <SwiperSlide key={index}>
                                <h2 style={{ textAlign: 'center' }}>{day.date}</h2>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div style={{ 
                        padding: '20px', 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
                    }}>
                        {menu.days[selectedDayIndex]?.menu_items
                            .filter(item => item.meal === selectedMeal)
                            .map((item, i) => (
                                <div key={i} style={{ padding: '5px 0' }}>
                                    {item.is_section_title ? (
                                        <h3 style={{ marginBottom: '5px', borderBottom: '1px solid #ccc' }}>{item.text}</h3>
                                    ) : (
                                        <p>{item.food?.name || 'Unnamed Dish'}</p>
                                    )}
                                </div>
                            ))}
                    </div>
                </>
            ) : (
                <p style={{ textAlign: 'center' }}>Loading menu...</p>
            )}
        </div>
    );
}

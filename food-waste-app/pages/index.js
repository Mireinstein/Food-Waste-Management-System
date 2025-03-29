import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function Home() {
    const [menu, setMenu] = useState(null);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('Breakfast');
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    useEffect(() => {
        async function fetchMenuData() {
            try {
                const response = await fetch(`/api/${selectedTab.toLowerCase()}-menu`);
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
    }, [selectedTab]);  

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        setSelectedDayIndex(0); 
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                {['Breakfast', 'Lunch', 'Dinner'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        style={{
                            padding: '10px 20px',
                            margin: '0 10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            backgroundColor: selectedTab === tab ? '#007bff' : '#f9f9f9',
                            color: selectedTab === tab ? '#fff' : '#000',
                            cursor: 'pointer',
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

            {menu ? (
                <>
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
                        {menu.days[selectedDayIndex]?.menu_items.map((item, i) => (
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

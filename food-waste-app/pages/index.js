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
    const [availableFoodOptions, setAvailableFoodOptions] = useState([]); // Array to store all available food items
    const [selectedFoodOptions, setSelectedFoodOptions] = useState([]); // Array to store selected food items
    const [showSuggestion, setShowSuggestion] = useState(false); // To toggle the display of suggestion box

    useEffect(() => {
        async function fetchMenuData() {
            try {
                const response = await fetch(`/api/${selectedTab.toLowerCase()}-menu`);
                if (!response.ok) {
                    throw new Error('Failed to fetch menu');
                }
                const data = await response.json();
                setMenu(data);
                // Set available food options when data is fetched
                setAvailableFoodOptions(getAvailableFoodOptions(data));
            } catch (error) {
                setError(error.message);
            }
        }
        fetchMenuData();
    }, [selectedTab]);  // Fetch new data whenever the selectedTab changes

    const getAvailableFoodOptions = (menuData) => {
        // Flatten all menu items for the selected day
        const items = menuData.days[selectedDayIndex]?.menu_items || [];
        return items.filter(item => item.food).map(item => item.food.name);
    };

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        setSelectedDayIndex(0);  // Reset day index when changing tabs
    };

    const toggleItemSelection = (itemName) => {
        setSelectedFoodOptions(prevState => {
            if (prevState.includes(itemName)) {
                // If the item is already selected, remove it
                return prevState.filter(item => item !== itemName);
            } else {
                // If the item is not selected, add it to the array
                return [...prevState, itemName];
            }
        });
    };

    const handleSuggestMealClick = () => {
        setShowSuggestion(true);
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
                            <div
                                key={i}
                                style={{
                                    padding: '5px 0',
                                    cursor: 'pointer',
                                    backgroundColor: selectedFoodOptions.includes(item.food?.name) ? '#e0f7fa' : 'transparent',
                                    borderRadius: '5px',
                                    transition: 'background-color 0.3s',
                                }}
                                onClick={() => toggleItemSelection(item.food?.name)}
                            >
                                {item.is_section_title ? (
                                    <h3 style={{ marginBottom: '5px', borderBottom: '1px solid #ccc' }}>{item.text}</h3>
                                ) : (
                                    <p>{item.food?.name || 'Unnamed Dish'}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Suggest Meal Button */}
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button
                            onClick={handleSuggestMealClick}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                fontSize: '16px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                            }}
                        >
                            Suggest Meal
                        </button>
                    </div>

                    {/* Display suggestion box with available and selected options */}
                    {showSuggestion && (
                        <div style={{
                            marginTop: '20px',
                            padding: '20px',
                            borderRadius: '8px',
                            backgroundColor: '#f1f1f1',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #ddd',
                        }}>
                            <h3 style={{ textAlign: 'center' }}>Suggested Meal</h3>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Available Food Options:</strong>
                                <pre>{JSON.stringify(availableFoodOptions, null, 2)}</pre>
                            </div>
                            <div>
                                <strong>Selected Food Options:</strong>
                                <pre>{JSON.stringify(selectedFoodOptions, null, 2)}</pre>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p style={{ textAlign: 'center' }}>Loading menu...</p>
            )}
        </div>
    );
}

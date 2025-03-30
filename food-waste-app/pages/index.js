import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";



export default function Home() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Breakfast");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [availableFoodOptions, setAvailableFoodOptions] = useState([]);
  const [selectedFoodOptions, setSelectedFoodOptions] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [mealPlan, setMealPlan] = useState("");
  const [plateImage, setPlateImage] = useState(null); // Variable to store plate picture
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const Header = () => (
    <header style={{
        padding: '20px',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        fontSize: '24px',
        fontWeight: 'bold',
        backgroundColor: '#007bff',
        color: 'white',
        width: '100%',
        position: 'relative',
        marginBottom: '40px',
        top: '0',
    }}>
        FoodBack
    </header>
);

  useEffect(() => {
    async function fetchMenuData() {
      try {
        const response = await fetch(`/api/${selectedTab.toLowerCase()}-menu`);
        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }
        const data = await response.json();
        setMenu(data);
        setAvailableFoodOptions(getAvailableFoodOptions(data));
      } catch (error) {
        setError(error.message);
      }
    }
    fetchMenuData();
  }, [selectedTab]);

  const getAvailableFoodOptions = (menuData) => {
    const items = menuData.days[selectedDayIndex]?.menu_items || [];
    return items.filter((item) => item.food).map((item) => item.food.name);
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setSelectedDayIndex(0);
  };

  const toggleItemSelection = (itemName) => {
    setSelectedFoodOptions((prevState) =>
      prevState.includes(itemName)
        ? prevState.filter((item) => item !== itemName)
        : [...prevState, itemName]
    );
  };

  const handleSuggestMealClick = async () => {
    try {
      const response = await fetch("/api/getMealPlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ availableFoodOptions, selectedFoodOptions }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch meal plan");
      }

      const data = await response.json();
      setMealPlan(data.mealPlan);
      setShowSuggestion(true);
    } catch (error) {
      setError(error.message);
    }
  };

  // Start video capture
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error("Error accessing the camera", err);
      setError("Unable to access camera.");
    }
  };

  // Capture image from video feed
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL("image/png");
    setPlateImage(image); // Store captured image in state
  };

  return (
    <div id="home"
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "100%",
        padding: "0 20px", // Reduced padding to narrow the layout
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
        <Header />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {["Breakfast", "Lunch", "Dinner"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            style={{
              padding: "10px 40px",
              margin: "0 10px",
              border: "1px solid #ccc",
              borderRadius: "0px",
              backgroundColor: selectedTab === tab ? "#007bff" : "#f9f9f9",
              color: selectedTab === tab ? "#fff" : "#000",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>
      )}

      {menu ? (
        <>
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            navigation
            modules={[Navigation]}
            style={{ width: "100%", marginBottom: "20px" }} // Ensured swiper takes full width
            onSlideChange={(swiper) => setSelectedDayIndex(swiper.activeIndex)}
          >
            {menu.days.map((day, index) => (
              <SwiperSlide key={index}>
                <h2 style={{ textAlign: "center" }}>{day.date}</h2>
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "0px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              width: "100%", // Ensured menu is centered within the available width
              maxWidth: "600px", // Maximum width to limit unnecessary whitespace
            }}
          >
            {menu.days[selectedDayIndex]?.menu_items.map((item, i) =>
              item.is_section_title ? (
                <h3
                  key={i}
                  style={{
                    marginBottom: "5px",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "0px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {item.text}
                </h3>
              ) : (
                <div
                  key={i}
                  style={{
                    padding: "10px 0",
                    cursor: "pointer",
                    borderBottom: selectedFoodOptions.includes(item.food?.name)
                      ? "3px solid #007bff"
                      : "3px solid transparent",
                    transition: "border-bottom 0.3s ease-in-out",
                  }}
                  onClick={() =>
                    item.food?.name && toggleItemSelection(item.food.name)
                  }
                >
                  <p>{item.food?.name || "Unnamed Dish"}</p>
                </div>
              )
            )}
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={handleSuggestMealClick}
              style={{
                padding: "10px 20px",
                border: "none",
                backgroundColor: "#007bff",
                color: "#fff",
                fontSize: "16px",
                borderRadius: "0px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Suggest Meal
            </button>
          </div>

          {showSuggestion && mealPlan && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                borderRadius: "0px",
                backgroundColor: "#f1f1f1",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                border: "1px solid #ddd",
                maxWidth: "600px", // Ensure suggested meal plan doesn't overflow
                width: "100%",
              }}
            >
              <h3 style={{ textAlign: "center" }}>Suggested Meal Plan</h3>
              <p style={{ textAlign: "center", fontSize: "16px" }}>
                {mealPlan}
              </p>
            </div>
          )}

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={startCamera}
              style={{
                padding: "10px 20px",
                border: "none",
                backgroundColor: "#28a745",
                color: "#fff",
                fontSize: "16px",
                borderRadius: "0px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Upload Plate Picture
            </button>
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {plateImage && (
              <img
                src={plateImage}
                alt="Plate"
                style={{
                  width: "100%",
                  maxWidth: "512px",
                  maxHeight: "512px",
                  borderRadius: "0px",
                }}
              />
            )}
          </div>

          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <video
              ref={videoRef}
              style={{
                width: "100%",
                maxWidth: "512px",
                maxHeight: "512px",
                borderRadius: "0px",
              }}
            ></video>

            {/* Capture Button with Camera Icon */}
            <button
              onClick={captureImage}
              style={{
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "8px",
                border: "none",
                backgroundColor: "gray",
                color: "#fff",
                fontSize: "20px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              📸
            </button>
          </div>
        </>
      ) : (
        <p style={{ textAlign: "center" }}>Loading menu...</p>
      )}
    </div>
  );
}

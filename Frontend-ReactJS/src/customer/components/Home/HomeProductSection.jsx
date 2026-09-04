import React, { useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

import HomeProductCard from "./HomeProductCard";
import "./HomeProductSection.css";
import { Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const HomeProductSection = ({ section, sectionName, data = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slidePrev = () => setActiveIndex(activeIndex - 1);
  const slideNext = () => setActiveIndex(activeIndex + 1);
  const syncActiveIndex = ({ item }) => setActiveIndex(item);

  const safeData = Array.isArray(data) && data.length > 0 ? data : [];

  // Configured for 2 cards side-by-side
  const responsive = {
    0: { items: 1 },
    768: { items: 2 },
    1024: { items: 2 }
  };

  const items = safeData.map((item, index) => (
    <div key={item?.id || index} className="p-3">
      <HomeProductCard product={item} />
    </div>
  ));

  return (
    <div className="w-full my-4">
      <div className="w-full relative p-4 sm:p-6 rounded-2xl bg-[#12121a] border border-white/10 shadow-2xl">
        <AliceCarousel
          disableButtonsControls
          disableDotsControls
          mouseTracking
          items={items}
          activeIndex={activeIndex}
          responsive={responsive}
          onSlideChanged={syncActiveIndex}
        />

        {items.length > 2 && activeIndex !== items.length - 2 && (
          <Button
            onClick={slideNext}
            variant="contained"
            className="home-product-section-btn z-50"
            sx={{
              position: "absolute",
              top: "50%",
              right: "-1rem",
              transform: "translateY(-50%)",
            }}
            aria-label="next"
          >
            <ArrowForwardIosIcon sx={{ fontSize: "1rem" }} />
          </Button>
        )}

        {items.length > 0 && activeIndex !== 0 && (
          <Button
            onClick={slidePrev}
            variant="contained"
            className="home-product-section-btn z-50"
            sx={{
              position: "absolute",
              top: "50%",
              left: "-1rem",
              transform: "translateY(-50%)",
            }}
            aria-label="prev"
          >
            <ArrowForwardIosIcon sx={{ fontSize: "1rem", transform: "rotate(180deg)" }} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomeProductSection;
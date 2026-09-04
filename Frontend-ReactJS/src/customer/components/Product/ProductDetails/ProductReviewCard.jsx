import React from "react";
import { Avatar, Rating, Grid } from "@mui/material";

const ProductReviewCard = ({ item }) => {
  const [value, setValue] = React.useState(item?.rating || 4.5);

  // Safe Fallback Data
  const firstName = item?.user?.firstName || item?.user?.name || "Sophia";
  const date = item?.createdAt 
    ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) 
    : "May 14, 2026";
  const reviewText = item?.review || "Absolutely love this wig! The HD lace melted into my skin seamlessly and the hair is extremely soft with zero shedding.";

  return (
    <div className="p-5 rounded-2xl bg-[#12121a] border border-white/10 shadow-lg text-white">
      <Grid container spacing={2} gap={2} alignItems="flex-start">
        
        {/* 1. USER AVATAR */}
        <Grid item xs={2} sm={1.5}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#ff2a85",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem",
              boxShadow: "0 4px 12px rgba(255, 42, 133, 0.3)"
            }}
            alt={firstName}
          >
            {firstName[0].toUpperCase()}
          </Avatar>
        </Grid>

        {/* 2. REVIEW CONTENT */}
        <Grid item xs={9} sm={10}>
          <div className="space-y-1.5">
            
            {/* Name & Date */}
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm sm:text-base text-white">{firstName}</p>
              <p className="text-xs text-gray-500 font-light">{date}</p>
            </div>

            {/* Gold Star Rating */}
            <div>
              <Rating
                value={value}
                onChange={(event, newValue) => setValue(newValue)}
                precision={0.5}
                size="small"
                sx={{
                  color: "#e6c687",
                  "& .MuiRating-iconEmpty": { color: "rgba(255, 255, 255, 0.2)" }
                }}
              />
            </div>

            {/* Review Comment */}
            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed pt-1">
              {reviewText}
            </p>

          </div>
        </Grid>

      </Grid>
    </div>
  );
};

export default ProductReviewCard;
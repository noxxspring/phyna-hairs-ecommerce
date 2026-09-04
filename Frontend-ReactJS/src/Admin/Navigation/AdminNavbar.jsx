import React from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ handleSideBarViewInMobile }) => {
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const user = auth?.user;

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "#0b0b0f",
        color: "white",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", height: 64 }}>
        
        {/* LEFT: Mobile Menu Button & Brand Title */}
        <Box sx={{ display: "flex", items: "center", gap: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleSideBarViewInMobile}
            sx={{ display: { lg: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            onClick={() => navigate("/")}
            sx={{
              fontFamily: "serif",
              fontWeight: "bold",
              cursor: "pointer",
              background: "linear-gradient(90deg, #ff2a85, #e6c687)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
            }}
          >
            ✨ Phyna Hairs — Admin
          </Typography>
        </Box>

        {/* CENTER: SEARCH BAR */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            bgcolor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "30px",
            px: 2,
            py: 0.5,
            width: "320px",
            "&:focus-within": {
              borderColor: "#ff2a85",
            },
          }}
        >
          <SearchIcon sx={{ color: "#a1a1aa", mr: 1, fontSize: "1.2rem" }} />
          <InputBase
            placeholder="Search orders, wigs, clients..."
            sx={{ color: "white", fontSize: "0.85rem", width: "100%" }}
          />
        </Box>

        {/* RIGHT: NOTIFICATIONS & ADMIN AVATAR */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton size="small" sx={{ color: "#a1a1aa" }}>
            <Badge badgeContent={3} color="secondary">
              <MailIcon fontSize="small" />
            </Badge>
          </IconButton>

          <IconButton size="small" sx={{ color: "#a1a1aa" }}>
            <Badge badgeContent={5} color="error">
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>

          <Box
            onClick={() => navigate("/api/users/profile")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              pl: 1,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#ff2a85",
                width: 36,
                height: 36,
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              {user?.firstName ? user.firstName[0].toUpperCase() : "A"}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="body2" sx={{ fontWeight: "bold", color: "white", lineHeight: 1.2 }}>
                {user?.firstName || "Admin"} {user?.lastName || ""}
              </Typography>
              <Typography variant="caption" sx={{ color: "#e6c687", fontSize: "0.7rem" }}>
                Super Admin
              </Typography>
            </Box>
          </Box>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
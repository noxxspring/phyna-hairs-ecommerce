import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { ThemeProvider } from "@emotion/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryIcon from "@mui/icons-material/Category";
import CreateCategoryForm from "./components/createCategory/CreateCategoryForm";

import { customTheme } from "./theme/customeThem";
import AdminNavbar from "./Navigation/AdminNavbar";
import Dashboard from "./Views/Admin";
import CreateProductForm from "./components/createProduct/CreateProductFrom";
import ProductsTable from "./components/Products/ProductsTable";
import OrdersTable from "./components/Orders/OrdersTable";
import Customers from "./components/customers/customers";
import UpdateProductForm from "./components/updateProduct/UpdateProduct";

import "./AdminPannel.css";

const drawerWidth = 260;

const menu = [
  { name: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  { name: "Create Categories", path: "/admin/categories", icon: <CategoryIcon /> },
  { name: "Products Catalog", path: "/admin/products", icon: <ShoppingBagIcon /> },
  { name: "Add New Product", path: "/admin/product/create", icon: <AddBoxIcon /> },
  { name: "Customer Orders", path: "/admin/orders", icon: <ReceiptLongIcon /> },
  { name: "Salon Clients", path: "/admin/customers", icon: <PeopleIcon /> },
];

export default function AdminPannel() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [sideBarVisible, setSideBarVisible] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const drawer = (
    <Box
      sx={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        bgcolor: "#12121a",
        color: "white",
      }}
    >
      <Box>
        <Toolbar /> {/* Spacing below fixed navbar */}
        <List sx={{ pt: 2, px: 1 }}>
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    setSideBarVisible(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? "rgba(255, 42, 133, 0.15)" : "transparent",
                    border: isActive ? "1px solid rgba(255, 42, 133, 0.3)" : "1px solid transparent",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? "#ff2a85" : "#e6c687", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: "0.85rem",
                      fontWeight: isActive ? "bold" : "medium",
                      color: isActive ? "#ff2a85" : "white",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <List sx={{ px: 1, pb: 2 }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 1 }} />
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/")} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ color: "#a1a1aa", minWidth: 40 }}>
              <ArrowBackIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Back to Storefront"
              primaryTypographyProps={{ fontSize: "0.8rem", color: "#a1a1aa" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const handleSideBarViewInMobile = () => setSideBarVisible(true);
  const handleCloseSideBar = () => setSideBarVisible(false);
  const drawerVariant = isLargeScreen ? "permanent" : "temporary";

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: isLargeScreen ? "flex" : "block", minHeight: "100vh", bgcolor: "#08080c" }}>
        <CssBaseline />
        <AdminNavbar handleSideBarViewInMobile={handleSideBarViewInMobile} />

        <Drawer
          variant={drawerVariant}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#12121a",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
          open={isLargeScreen || sideBarVisible}
          onClose={handleCloseSideBar}
        >
          {drawer}
        </Drawer>

        <Box
          className="adminContainer"
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            width: { lg: `calc(100% - ${drawerWidth}px)` },
            bgcolor: "#08080c",
            minHeight: "100vh",
          }}
        >
          <Toolbar /> {/* Spacing below navbar */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/product/create" element={<CreateProductForm />} />
            <Route path="/product/update/:productId" element={<UpdateProductForm />} />
            <Route path="/products" element={<ProductsTable />} />
            <Route path="/orders" element={<OrdersTable />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/categories" element={<CreateCategoryForm />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
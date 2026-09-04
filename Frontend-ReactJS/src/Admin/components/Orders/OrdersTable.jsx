import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

// Material UI Icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FilterListIcon from "@mui/icons-material/FilterList";

import {
  confirmOrder,
  deleteOrder,
  deliveredOrder,
  getOrders,
  shipOrder,
} from "../../../Redux/Admin/Orders/Action";

const OrdersTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const [formData, setFormData] = useState({ status: "", sort: "" });
  const [anchorElArray, setAnchorElArray] = useState([]);

  const { adminsOrder } = useSelector((store) => store);
  const ordersList = adminsOrder?.orders || [];

  useEffect(() => {
    if (jwt) {
      dispatch(getOrders({ jwt }));
    }
  }, [jwt, dispatch, adminsOrder?.delivered, adminsOrder?.shipped, adminsOrder?.confirmed]);

  const handleUpdateStatusMenuClick = (event, index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorElArray(newAnchorElArray);
  };

  const handleUpdateStatusMenuClose = (index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = null;
    setAnchorElArray(newAnchorElArray);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmedOrder = (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(confirmOrder(orderId));
  };

  const handleShippedOrder = (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(shipOrder(orderId));
  };

  const handleDeliveredOrder = (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(deliveredOrder(orderId));
  };

  const handleDeleteOrder = (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(deleteOrder(orderId));
  };

  // Helper for Order Status Badge Colors
  const getStatusChip = (status) => {
    switch (status) {
      case "DELIVERED":
        return <Chip label="DELIVERED" size="small" sx={{ bgcolor: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)", fontWeight: "bold" }} />;
      case "SHIPPED":
        return <Chip label="SHIPPED" size="small" sx={{ bgcolor: "rgba(168, 85, 247, 0.15)", color: "#c084fc", border: "1px solid rgba(168, 85, 247, 0.3)", fontWeight: "bold" }} />;
      case "CONFIRMED":
        return <Chip label="CONFIRMED" size="small" sx={{ bgcolor: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)", fontWeight: "bold" }} />;
      case "CANCELLED":
        return <Chip label="CANCELLED" size="small" sx={{ bgcolor: "rgba(244, 63, 94, 0.15)", color: "#f43f5e", border: "1px solid rgba(244, 63, 94, 0.3)", fontWeight: "bold" }} />;
      case "PENDING":
      default:
        return <Chip label="PENDING" size="small" sx={{ bgcolor: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.3)", fontWeight: "bold" }} />;
    }
  };

  return (
    <Box sx={{ p: 1, color: "white" }}>
      
      {/* 1. FILTER & SORT HEADER CARD */}
      <Card sx={{ bgcolor: "#12121a", color: "white", borderRadius: 3, border: "1px solid rgba(255,255,255,0.08)", mb: 3, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FilterListIcon sx={{ color: "#e6c687", mr: 1 }} />
          <Typography variant="h6" fontFamily="serif" fontWeight="bold" sx={{ color: "white" }}>
            Filter & Sort Orders
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small" sx={{ "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" } } }}>
              <InputLabel sx={{ color: "#a1a1aa" }}>Filter By Status</InputLabel>
              <Select name="status" value={formData.status} label="Filter By Status" onChange={handleChange}>
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                <MenuItem value="SHIPPED">SHIPPED</MenuItem>
                <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                <MenuItem value="CANCELLED">CANCELLED</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small" sx={{ "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" } } }}>
              <InputLabel sx={{ color: "#a1a1aa" }}>Sort By Date</InputLabel>
              <Select name="sort" value={formData.sort} label="Sort By Date" onChange={handleChange}>
                <MenuItem value="Newest">Newest First</MenuItem>
                <MenuItem value="Older">Older First</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* 2. ORDERS DATA TABLE */}
      <Card sx={{ bgcolor: "#12121a", color: "white", borderRadius: 3, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <CardHeader
          title="Customer Orders Management"
          titleTypographyProps={{ fontFamily: "serif", fontWeight: "bold", fontSize: "1.25rem", color: "#e6c687" }}
          sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2.5 }}
        />

        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="orders table">
            <TableHead sx={{ bgcolor: "rgba(255, 255, 255, 0.03)" }}>
              <TableRow>
                <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Items</TableCell>
                <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Title & Brand</TableCell>
                <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Total Price</TableCell>
                <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Order ID</TableCell>
                <TableCell align="center" sx={{ color: "#e6c687", fontWeight: "bold" }}>Status</TableCell>
                <TableCell align="center" sx={{ color: "#e6c687", fontWeight: "bold" }}>Update Status</TableCell>
                <TableCell align="center" sx={{ color: "#e6c687", fontWeight: "bold" }}>Delete</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {ordersList.map((item, index) => (
                <TableRow hover key={item?.id || index} sx={{ "&:hover": { bgcolor: "rgba(255, 255, 255, 0.02) !important" }, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  
                  {/* Item Avatar Group */}
                  <TableCell>
                    <AvatarGroup max={3} sx={{ justifyContent: "start" }}>
                      {item?.orderItems?.map((orderItem, idx) => (
                        <Avatar key={idx} alt="Wig Product" src={orderItem?.product?.imageUrl || orderItem?.product?.image} />
                      ))}
                    </AvatarGroup>
                  </TableCell>

                  {/* Product Titles */}
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "white" }}>
                        {item?.orderItems?.map((order) => order?.product?.title).join(", ") || "Wig Product"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#a1a1aa" }}>
                        {item?.orderItems?.map((order) => order?.product?.brand).join(", ")}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Total Price */}
                  <TableCell sx={{ fontWeight: "bold", color: "#ff2a85" }}>
                    ₦{item?.totalDiscountedPrice || item?.totalPrice || "0"}
                  </TableCell>

                  {/* Order ID */}
                  <TableCell sx={{ color: "#a1a1aa", fontFamily: "monospace", fontSize: "0.8rem" }}>
                    {item?.orderId || item?.id}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell align="center">
                    {getStatusChip(item?.orderStatus)}
                  </TableCell>

                  {/* Update Status Dropdown */}
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(event) => handleUpdateStatusMenuClick(event, index)}
                      sx={{ color: "#e6c687", borderColor: "rgba(230, 198, 135, 0.4)", textTransform: "none", borderRadius: 2 }}
                    >
                      Update
                    </Button>

                    <Menu
                      anchorEl={anchorElArray[index]}
                      open={Boolean(anchorElArray[index])}
                      onClose={() => handleUpdateStatusMenuClose(index)}
                      PaperProps={{ sx: { bgcolor: "#1a1a24", color: "white", border: "1px solid rgba(255,255,255,0.1)" } }}
                    >
                      <MenuItem
                        onClick={() => handleConfirmedOrder(item.id, index)}
                        disabled={item.orderStatus === "DELIVERED" || item.orderStatus === "SHIPPED" || item.orderStatus === "CONFIRMED"}
                        sx={{ fontSize: "0.85rem", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}
                      >
                        CONFIRM ORDER
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleShippedOrder(item.id, index)}
                        disabled={item.orderStatus === "DELIVERED" || item.orderStatus === "SHIPPED"}
                        sx={{ fontSize: "0.85rem", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}
                      >
                        SHIP ORDER
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDeliveredOrder(item.id, index)}
                        disabled={item.orderStatus === "DELIVERED"}
                        sx={{ fontSize: "0.85rem", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}
                      >
                        DELIVER ORDER
                      </MenuItem>
                    </Menu>
                  </TableCell>

                  {/* Delete Action */}
                  <TableCell align="center">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteOrder(item.id, index)}
                      sx={{ minWidth: "auto", color: "#f43f5e" }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </Button>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default OrdersTable;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { getOrders } from '../../Redux/Admin/Orders/Action';

const RecentOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { adminsOrder } = useSelector((store) => store);
  const ordersList = adminsOrder?.orders || [];

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getOrders({ jwt }));
    }
  }, [dispatch]);

  return (
    <Card sx={{ bgcolor: "#12121a", color: "white", borderRadius: 3, border: "1px solid rgba(255,255,255,0.08)" }}>
      <CardHeader
        title="Recent Customer Orders"
        titleTypographyProps={{ fontFamily: "serif", fontWeight: "bold", fontSize: "1.1rem", color: "#e6c687" }}
        action={
          <Typography
            onClick={() => navigate("/admin/orders")}
            variant="caption"
            sx={{ color: "#ff2a85", cursor: "pointer", fontWeight: "bold", "&:hover": { textDecoration: "underline" } }}
          >
            View All →
          </Typography>
        }
        sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2 }}
      />

      <TableContainer>
        <Table sx={{ minWidth: 600 }} aria-label="recent orders table">
          <TableHead sx={{ bgcolor: "rgba(255, 255, 255, 0.03)" }}>
            <TableRow>
              <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Image</TableCell>
              <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Order Reference</TableCell>
              <TableCell align="center" sx={{ color: "#e6c687", fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {ordersList.slice(0, 5).map((item, index) => (
              <TableRow hover key={item?.id || index} sx={{ "&:hover": { bgcolor: "rgba(255, 255, 255, 0.02) !important" }, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <TableCell>
                  <Avatar alt="Product" src={item?.orderItems?.[0]?.product?.imageUrl || item?.orderItems?.[0]?.product?.image} variant="rounded" sx={{ width: 40, height: 48, borderRadius: 2 }} />
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "white" }}>
                      {item?.orderItems?.[0]?.product?.title || "Wig Unit"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#a1a1aa" }}>
                      {item?.user?.firstName || "Customer"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#ff2a85" }}>
                  ₦{(item?.totalDiscountedPrice || item?.totalPrice || 0).toLocaleString()}
                </TableCell>
                <TableCell sx={{ color: "#a1a1aa", fontFamily: "monospace", fontSize: "0.8rem" }}>
                  {item?.orderId || item?.id}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={item?.orderStatus || "PENDING"}
                    size="small"
                    sx={{ bgcolor: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)", fontWeight: "bold" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default RecentOrders;
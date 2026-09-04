import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { findProducts } from '../../Redux/Customers/Product/Action';

const RecentlyAddeddProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customersProduct } = useSelector((store) => store);
  const productsList = customersProduct?.products?.content || [];

  useEffect(() => {
    dispatch(findProducts({ pageSize: 5 }));
  }, [dispatch]);

  return (
    <Card sx={{ bgcolor: "#12121a", color: "white", borderRadius: 3, border: "1px solid rgba(255,255,255,0.08)" }}>
      <CardHeader
        title="Recently Added Products"
        titleTypographyProps={{ fontFamily: "serif", fontWeight: "bold", fontSize: "1.1rem", color: "#e6c687" }}
        action={
          <Typography
            onClick={() => navigate("/admin/products")}
            variant="caption"
            sx={{ color: "#ff2a85", cursor: "pointer", fontWeight: "bold", "&:hover": { textDecoration: "underline" } }}
          >
            View All →
          </Typography>
        }
        sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2 }}
      />

      <TableContainer>
        <Table sx={{ minWidth: 600 }} aria-label="recently added products table">
          <TableHead sx={{ bgcolor: "rgba(255, 255, 255, 0.03)" }}>
            <TableRow>
              <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Image</TableCell>
              <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Stock</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {productsList.slice(0, 5).map((item, index) => (
              <TableRow hover key={item?.id || index} sx={{ "&:hover": { bgcolor: "rgba(255, 255, 255, 0.02) !important" }, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <TableCell>
                  <Avatar alt={item?.title} src={item?.imageUrl || item?.image} variant="rounded" sx={{ width: 40, height: 48, borderRadius: 2 }} />
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "white" }}>
                      {item?.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#a1a1aa" }}>
                      {item?.brand || "Phyna Hairs"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: "#a1a1aa", fontSize: "0.8rem" }}>
                  {item?.category?.name || "Product"}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#ff2a85" }}>
                  ₦{(item?.discountedPrice || item?.price || 0).toLocaleString()}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                  {item?.quantity || 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default RecentlyAddeddProducts;
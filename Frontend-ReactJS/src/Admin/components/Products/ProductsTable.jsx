import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
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
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";

import { deleteProduct, findProducts } from "../../../Redux/Customers/Product/Action";

const ProductsTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { customersProduct } = useSelector((store) => store);
  const productsList = customersProduct?.products?.content || [];

  const [filterValue, setFilterValue] = useState({
    availability: "",
    category: "",
    sort: "",
  });

  const searchParams = new URLSearchParams(location.search);
  const availability = searchParams.get("availability");
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");
  const page = searchParams.get("page");

  const handlePaginationChange = (event, value) => {
    searchParams.set("page", value - 1);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  useEffect(() => {
    const data = {
      category: category || "",
      colors: [],
      sizes: [],
      minPrice: 0,
      maxPrice: 1000000,
      minDiscount: 0,
      sort: sort || "price_low",
      pageNumber: page || 0,
      pageSize: 10,
      stock: availability,
    };
    dispatch(findProducts(data));
  }, [availability, category, sort, page, customersProduct?.deleteProduct, dispatch]);

  const handleFilterChange = (e, sectionId) => {
    setFilterValue((values) => ({ ...values, [sectionId]: e.target.value }));
    searchParams.set(sectionId, e.target.value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId));
    }
  };

  return (
    <Box sx={{ width: "100%", p: 1, color: "white" }}>
      
      {/* 1. SORT & FILTER HEADER CARD */}
      <Card sx={{ bgcolor: "#12121a", color: "white", borderRadius: 3, border: "1px solid rgba(255,255,255,0.08)", mb: 3, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FilterListIcon sx={{ color: "#e6c687", mr: 1 }} />
          <Typography variant="h6" fontFamily="serif" fontWeight="bold" sx={{ color: "white" }}>
            Filter & Sort Products
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {/* Category Filter */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small" sx={{ "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" } } }}>
              <InputLabel sx={{ color: "#a1a1aa" }}>Category</InputLabel>
              <Select
                value={filterValue.category}
                label="Category"
                onChange={(e) => handleFilterChange(e, "category")}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Wigs">Human Hair Wigs</MenuItem>
                <MenuItem value="Bundles">Raw Hair Bundles</MenuItem>
                <MenuItem value="Frontals & Closures">HD Frontals & Closures</MenuItem>
                <MenuItem value="Accessories">Accessories & Care</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Availability Filter */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small" sx={{ "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" } } }}>
              <InputLabel sx={{ color: "#a1a1aa" }}>Availability</InputLabel>
              <Select
                value={filterValue.availability}
                label="Availability"
                onChange={(e) => handleFilterChange(e, "availability")}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="in_stock">In Stock</MenuItem>
                <MenuItem value="out_of_stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Sort By Price */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small" sx={{ "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" } } }}>
              <InputLabel sx={{ color: "#a1a1aa" }}>Sort By Price</InputLabel>
              <Select
                value={filterValue.sort}
                label="Sort By Price"
                onChange={(e) => handleFilterChange(e, "sort")}
              >
                <MenuItem value="price_high">High to Low</MenuItem>
                <MenuItem value="price_low">Low to High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* 2. PRODUCTS CATALOG DATA TABLE */}
      <Card sx={{ bgcolor: "#12121a", color: "white", borderRadius: 3, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <CardHeader
          title="Wig & Beauty Products Catalog"
          titleTypographyProps={{ fontFamily: "serif", fontWeight: "bold", fontSize: "1.25rem", color: "#e6c687" }}
          sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2.5 }}
        />

        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="products table">
            <TableHead sx={{ bgcolor: "rgba(255, 255, 255, 0.03)" }}>
              <TableRow>
                <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Image</TableCell>
                <TableCell sx={{ color: "#e6c687", fontWeight: "bold" }}>Title & Brand</TableCell>
                <TableCell align="center" sx={{ color: "#e6c687", fontWeight: "bold" }}>Category</TableCell>
                <TableCell align="center" sx={{ color: "#e6c687", fontWeight: "bold" }}>Price</TableCell>
                <TableCell align="center" sx={{ color: "#e6c687", fontWeight: "bold" }}>Stock</TableCell>
                <TableCell align="center" sx={{ color: "#e6c687", fontWeight: "bold" }}>Update</TableCell>
                <TableCell align="center" sx={{ color: "#e6c687", fontWeight: "bold" }}>Delete</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {productsList.map((item, index) => (
                <TableRow hover key={item?.id || index} sx={{ "&:hover": { bgcolor: "rgba(255, 255, 255, 0.02) !important" }, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  
                  {/* Image Avatar */}
                  <TableCell>
                    <Avatar 
                      alt={item?.title} 
                      src={item?.imageUrl || item?.image} 
                      variant="rounded"
                      sx={{ width: 48, height: 48, borderRadius: 2 }}
                    />
                  </TableCell>

                  {/* Title & Brand */}
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "white" }}>
                        {item?.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#a1a1aa" }}>
                        {item?.brand || "Phyna Hairs"}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Category */}
                  <TableCell align="center" sx={{ color: "#a1a1aa", fontSize: "0.85rem" }}>
                    {item?.category?.name || item?.topLavelCategory || "Wigs"}
                  </TableCell>

                  {/* Price */}
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#ff2a85" }}>
                    ₦{item?.discountedPrice || item?.price || "0"}
                  </TableCell>

                  {/* Stock Quantity */}
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>
                    {item?.quantity || 0}
                  </TableCell>

                  {/* Update Button */}
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/admin/product/update/${item.id}`)}
                      sx={{ color: "#e6c687", borderColor: "rgba(230, 198, 135, 0.4)", borderRadius: 2, textTransform: "none" }}
                      startIcon={<EditIcon fontSize="small" />}
                    >
                      Edit
                    </Button>
                  </TableCell>

                  {/* Delete Button */}
                  <TableCell align="center">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteProduct(item.id)}
                      sx={{ color: "#f43f5e" }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </Button>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION FOOTER */}
        <Box sx={{ display: "flex", justifyContent: "center", py: 3, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Pagination
            count={customersProduct?.products?.totalPages || 1}
            color="secondary"
            onChange={handlePaginationChange}
            sx={{
              "& .MuiPaginationItem-root": { color: "white" },
              "& .Mui-selected": { bgcolor: "#ff2a85 !important", color: "white" }
            }}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default ProductsTable;
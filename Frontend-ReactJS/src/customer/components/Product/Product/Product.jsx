import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/20/solid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Pagination from "@mui/material/Pagination";
import { Backdrop, CircularProgress } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import axios from "axios";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { filters, singleFilter, sortOptions } from "./FilterData";
import { findProducts } from "../../../../Redux/Customers/Product/Action";
import { addItemToCart } from "../../../../Redux/Customers/Cart/Action";
import { API_BASE_URL } from "../../../../config/api";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* Helper function to resolve real Cloudinary image URL */
const getProductImage = (product) => {
  if (!product) return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500";

  if (product.imageUrl && typeof product.imageUrl === "string" && product.imageUrl.trim() !== "") {
    return product.imageUrl;
  }
  if (product.image && typeof product.image === "string" && product.image.trim() !== "") {
    return product.image;
  }
  if (product.image_url && typeof product.image_url === "string" && product.image_url.trim() !== "") {
    return product.image_url;
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    const firstImg = product.images[0];
    return typeof firstImg === "string" ? firstImg : (firstImg?.imageUrl || firstImg?.url);
  }

  return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500";
};

/* Smart Helper to extract EXACT Admin Pricing & Discounts */
const getAdminPricing = (product) => {
  const originalPrice = product.price || 0;

  // Extract exact discount percentage set by Admin
  const discountPercent = 
    product.discountedPercent ?? 
    product.discountPersent ?? 
    product.discountPercent ?? 
    0;

  // Calculate discounted price
  let discountedPrice = product.discountedPrice;
  if (!discountedPrice || discountedPrice >= originalPrice) {
    discountedPrice = discountPercent > 0 
      ? Math.round(originalPrice * (1 - discountPercent / 100)) 
      : originalPrice;
  }

  const hasDiscount = discountPercent > 0 && discountedPrice < originalPrice;

  return {
    originalPrice,
    discountPercent,
    discountedPrice,
    hasDiscount
  };
};

export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [directProducts, setDirectProducts] = useState([]);
  const [directLoading, setDirectLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const location = useLocation();

  const { customersProduct } = useSelector((store) => store);
  
  // Use Redux list or Direct API fallback list so ALL products display
  const reduxProducts = customersProduct?.products?.content || customersProduct?.products || [];
  const productsList = reduxProducts.length > 0 ? reduxProducts : directProducts;

  // Decode URL Parameters
  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const colorValue = searchParams.get("color");
  const sizeValue = searchParams.get("size");
  const price = searchParams.get("price");
  const discount = searchParams.get("discount");
  const sortValue = searchParams.get("sort");
  const pageNumber = searchParams.get("page") || 1;
  const stock = searchParams.get("stock");

  // Handle Sort Option Change
  const handleSortChange = (value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("sort", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  // Handle Pagination Change
  const handlePaginationChange = (event, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  // Checkbox Multi-Filters
  const handleFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    let filterValues = searchParams.getAll(sectionId);

    if (filterValues.length > 0 && filterValues[0].split(",").includes(value)) {
      filterValues = filterValues[0].split(",").filter((item) => item !== value);
      if (filterValues.length === 0) {
        searchParams.delete(sectionId);
      }
    } else {
      filterValues.push(value);
    }

    if (filterValues.length > 0) {
      searchParams.set(sectionId, filterValues.join(","));
    }

    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  // Radio Single-Filters
  const handleRadioFilterChange = (e, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(sectionId, e.target.value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  // Toggle Wishlist
  const toggleWishlist = (e, productId) => {
    e.stopPropagation();
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  // Add Item to Bag / Cart
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      navigate("/login");
      return;
    }

    const data = {
      productId: product.id,
      size: "FREE SIZE",
      quantity: 1,
    };

    dispatch(addItemToCart(data));
    navigate("/cart");
  };

  // Fetch All Products Live
  useEffect(() => {
    const [minPrice, maxPrice] = price === null ? [0, 1000000] : price.split("-").map(Number);
    const categoryQuery = param.categoryId || param.lavelThree || param.lavelTwo || param.lavelOne || "";

    const data = {
      category: categoryQuery,
      colors: colorValue || [],
      sizes: sizeValue || [],
      minPrice: minPrice || 0,
      maxPrice: maxPrice || 1000000,
      minDiscount: discount || 0,
      sort: sortValue || "price_low",
      pageNumber: Math.max(0, pageNumber - 1),
      pageSize: 100, // Increased page size so ALL products load
      stock: stock || "",
    };

    dispatch(findProducts(data));

    // Direct Axios Fallback
    const fetchDirect = async () => {
      setDirectLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products`);
        const items = res.data?.content || res.data || [];
        setDirectProducts(items);
      } catch (e) {
        console.error("Direct fetch error:", e);
      } finally {
        setDirectLoading(false);
      }
    };

    fetchDirect();
  }, [param.categoryId, param.lavelThree, param.lavelTwo, param.lavelOne, colorValue, sizeValue, price, discount, sortValue, pageNumber, stock, dispatch]);

  return (
    <div className="bg-[#08080c] text-white min-h-screen">
      <div>
        {/* MOBILE FILTERS DIALOG */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setMobileFiltersOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-[#12121a] py-4 pb-12 shadow-xl text-white">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-bold font-serif text-[#e6c687]">Filters</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400 hover:text-white"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-4 border-t border-white/10 px-4 pt-4">
                    {filters.map((section) => (
                      <Disclosure as="div" key={section.id} className="border-b border-white/10 py-6">
                        {({ open }) => (
                          <>
                            <h3 className="-my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-gray-200 hover:text-[#ff2a85]">
                                <span className="font-semibold">{section.name}</span>
                                <ChevronDownIcon className={classNames(open ? "-rotate-180" : "rotate-0", "h-5 w-5 transform")} />
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-4">
                                {section.options.map((option, optionIdx) => (
                                  <div key={option.value} className="flex items-center">
                                    <input
                                      onChange={() => handleFilter(option.value, section.id)}
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-600 bg-white/5 text-[#ff2a85] focus:ring-[#ff2a85]"
                                    />
                                    <label htmlFor={`filter-mobile-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-300">
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* MAIN DESKTOP CATALOG HEADER */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-white/10 pb-6 pt-12">
            <div>
              <span className="text-xs font-bold text-[#ff2a85] uppercase tracking-widest">✦ Collection ✦</span>
              <h1 className="text-3xl font-serif font-bold tracking-tight text-white mt-1">
                {param.lavelThree || param.lavelTwo || param.lavelOne || "Shop All Products"}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-xs uppercase font-bold text-[#e6c687] hover:text-[#ff2a85]">
                    Sort By
                    <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-[#e6c687]" aria-hidden="true" />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-[#12121a] p-1 border border-white/10 shadow-2xl">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <button
                            onClick={() => handleSortChange(option.value)}
                            className={classNames(
                              active ? "bg-[#ff2a85]/20 text-[#ff2a85]" : "text-gray-300",
                              "block w-full text-left px-4 py-2 text-xs font-semibold rounded-lg"
                            )}
                          >
                            {option.name}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-white lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              
              {/* DESKTOP SIDEBAR FILTERS */}
              <form className="hidden lg:block space-y-6 bg-[#12121a] p-6 rounded-2xl border border-white/10 h-fit">
                <h2 className="text-lg font-serif font-bold text-[#e6c687] border-b border-white/10 pb-3">
                  Filter Products
                </h2>

                {/* Checkbox Multi-Filters */}
                {filters.map((section) => (
                  <Disclosure as="div" key={section.id} className="border-b border-white/10 py-4">
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between py-3 text-xs uppercase font-bold text-gray-200 hover:text-[#ff2a85]">
                            <span>{section.name}</span>
                            <ChevronDownIcon className={classNames(open ? "-rotate-180" : "rotate-0", "h-5 w-5 transform")} />
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-4">
                          <div className="space-y-3">
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center">
                                <input
                                  onChange={() => handleFilter(option.value, section.id)}
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-600 bg-white/5 text-[#ff2a85] focus:ring-[#ff2a85]"
                                />
                                <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-xs text-gray-300 hover:text-white cursor-pointer">
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}

                {/* Radio Single-Filters */}
                {singleFilter.map((section) => (
                  <div key={section.id} className="border-b border-white/10 py-4">
                    <FormControl>
                      <FormLabel sx={{ color: "#e6c687", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", mb: 1 }}>
                        {section.name}
                      </FormLabel>
                      <RadioGroup name={section.id} onChange={(e) => handleRadioFilterChange(e, section.id)}>
                        {section.options.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio size="small" sx={{ color: "rgba(255,255,255,0.4)", '&.Mui-checked': { color: '#ff2a85' } }} />}
                            label={<span className="text-xs text-gray-300">{option.label}</span>}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </div>
                ))}
              </form>

              {/* PRODUCT GRID LISTING WITH EXACT ADMIN DISCOUNTS */}
              <div className="lg:col-span-3">
                {productsList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productsList.map((item, index) => {
                      const { originalPrice, discountPercent, discountedPrice, hasDiscount } = getAdminPricing(item);
                      const isWishlisted = wishlist.includes(item.id);

                      return (
                        <div
                          key={item?.id || index}
                          onClick={() => navigate(`/product/${item.id}`)}
                          className="group cursor-pointer bg-[#12121a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#e6c687]/40 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div className="relative h-52 sm:h-60 w-full bg-[#08080c] overflow-hidden">
                            
                            {/* DISCOUNT BADGE (ONLY SHOWN IF ADMIN SET A DISCOUNT) */}
                            {hasDiscount && (
                              <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded bg-black/80 text-[#ff2a85] text-[10px] font-bold">
                                -{discountPercent}%
                              </span>
                            )}

                            {/* Wishlist Heart Button */}
                            <button
                              onClick={(e) => toggleWishlist(e, item.id)}
                              className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
                            >
                              {isWishlisted ? (
                                <FavoriteIcon className="!text-sm text-[#ff2a85]" />
                              ) : (
                                <FavoriteBorderIcon className="!text-sm text-white" />
                              )}
                            </button>

                            <img
                              src={getProductImage(item)}
                              alt={item.title || item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block truncate">
                                {item.brand || item.color || "PREMIUM HAIR"}
                              </span>

                              <h4 className="text-xs sm:text-sm font-bold text-white uppercase truncate group-hover:text-[#e6c687] transition-colors">
                                {item.title || item.name}
                              </h4>

                              {/* PRICING DISPLAY */}
                              <div className="flex items-center space-x-2 pt-1">
                                <span className="text-sm sm:text-base font-bold text-[#e6c687]">
                                  ₦{discountedPrice.toLocaleString()}
                                </span>
                                {hasDiscount && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ₦{originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* DUAL ACTION BUTTONS: ADD TO BAG & DETAILS */}
                            <div className="grid grid-cols-2 gap-2 pt-3">
                              <button
                                onClick={(e) => handleAddToCart(e, item)}
                                className="flex items-center justify-center space-x-1.5 px-2 py-2 rounded-lg bg-[#ff2a85] hover:bg-[#d41f6e] text-white text-[11px] font-bold uppercase transition-colors"
                              >
                                <ShoppingBagOutlinedIcon className="!text-sm" />
                                <span>Add to Bag</span>
                              </button>
                              <button
                                onClick={() => navigate(`/product/${item.id}`)}
                                className="px-2 py-2 rounded-lg border border-white/20 hover:border-[#e6c687] text-white text-[11px] font-bold uppercase transition-colors text-center"
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-[#12121a] rounded-3xl border border-white/10 space-y-3">
                    <h3 className="text-xl font-serif font-bold text-white">No Products Found</h3>
                    <p className="text-xs text-gray-400 font-light">Try adjusting your filter options or price range.</p>
                  </div>
                )}

                {/* PAGINATION FOOTER */}
                <div className="flex justify-center mt-12 pt-8 border-t border-white/10">
                  <Pagination
                    count={customersProduct?.products?.totalPages || 1}
                    color="secondary"
                    onChange={handlePaginationChange}
                    sx={{
                      "& .MuiPaginationItem-root": { color: "white" },
                      "& .Mui-selected": { bgcolor: "#ff2a85 !important", color: "white" }
                    }}
                  />
                </div>
              </div>

            </div>
          </section>
        </main>

        {/* LOADING BACKDROP */}
        <Backdrop
          sx={{ color: "#ff2a85", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={Boolean(customersProduct?.loading || directLoading)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </div>
  );
}
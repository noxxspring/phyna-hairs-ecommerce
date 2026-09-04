import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Pagination from "@mui/material/Pagination";
import { Backdrop, CircularProgress } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { filters, singleFilter, sortOptions } from "./FilterData";
import ProductCard from "../ProductCard/ProductCard";
import { findProducts } from "../../../../Redux/Customers/Product/Action";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const location = useLocation();

  const { customersProduct } = useSelector((store) => store);
  const productsList = customersProduct?.products?.content || [];

  // Decode URL Parameters
  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const colorValue = searchParams.get("color");
  const sizeValue = searchParams.get("size");
  const price = searchParams.get("price");
  const discount = searchParams.get("discount"); // FIXED TYPO: "discount"
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

  // Fetch Products Live from Backend with Proper Price Defaults
  useEffect(() => {
    const [minPrice, maxPrice] = price === null ? [0, 1000000] : price.split("-").map(Number);
    
    const categoryQuery = param.categoryId || param.lavelThree || param.lavelTwo || param.lavelOne || "";

    const data = {
      category: categoryQuery,
      colors: colorValue || [],
      sizes: sizeValue || [],
      minPrice: minPrice || 0,
      maxPrice: maxPrice || 1000000, // FIXED: Set default to 1,000,000 NGN
      minDiscount: discount || 0,
      sort: sortValue || "price_low",
      pageNumber: pageNumber - 1,
      pageSize: 12,
      stock: stock,
    };

    dispatch(findProducts(data));
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
                                <ChevronDownIcon className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')} />
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
                            onClick={() => handleSortChange(option.value)} // FIXED: Used option.value
                            className={classNames(
                              active ? 'bg-[#ff2a85]/20 text-[#ff2a85]' : 'text-gray-300',
                              'block w-full text-left px-4 py-2 text-xs font-semibold rounded-lg'
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
                            <ChevronDownIcon className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')} />
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

              {/* PRODUCT GRID LISTING */}
              <div className="lg:col-span-3">
                {productsList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productsList.map((item, index) => (
                      <ProductCard key={item?.id || index} product={item} />
                    ))}
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
          open={Boolean(customersProduct?.loading)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </div>
  );
}
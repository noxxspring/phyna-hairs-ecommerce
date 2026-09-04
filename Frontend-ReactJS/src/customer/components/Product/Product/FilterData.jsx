export const color = [
  "Natural Black 1B",
  "613 Platinum Blonde",
  "Honey Blonde 27",
  "Burgundy 99J",
  "Highlight 4/27",
  "Ombre"
];

export const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "Natural Black #1B", label: "Natural Black #1B" },
      { value: "Natural Black #1", label: "Natural Black #1" },
      { value: "Dark Brown #2", label: "Dark Brown #2" },
      { value: "Burgundy", label: "Burgundy" },
      { value: "Ombre Blonde", label: "Ombre Blonde" },
      { value: "Honey Blonde", label: "Honey Blonde" },
      { value: "Golden Brown", label: "Golden Brown" },
      { value: "Jet Black #1B", label: "Jet Black #1B" },
      { value: "Brown", label: "Brown" },
      { value: "Blonde", label: "Blonde" },
    ],
  },
  {
    id: "category",
    name: "Category",
    options: [
      { value: "Frontal Wig", label: "Frontal Wig" },
      { value: "Full Lace Wig", label: "Full Lace Wig" },
      { value: "Bundles", label: "Bundles" },
      { value: "Closure", label: "Closure" },
      { value: "Frontal", label: "Frontal" },
      { value: "Closure Wig", label: "Closure Wig" },
      { value: "Accessories", label: "Accessories" },
    ],
  },
  {
    id: "texture",
    name: "Texture",
    options: [
      { value: "Brazilian", label: "Brazilian" },
      { value: "Peruvian", label: "Peruvian" },
      { value: "Malaysian", label: "Malaysian" },
      { value: "Kinky Straight", label: "Kinky Straight" },
      { value: "Deep Wave", label: "Deep Wave" },
      { value: "Water Wave", label: "Water Wave" },
      { value: "Body Wave", label: "Body Wave" },
    ],
  },
  {
    id: "size",
    name: "Size/Length",
    options: [
      { value: "14 inches", label: "14 inches" },
      { value: "16 inches", label: "16 inches" },
      { value: "18 inches", label: "18 inches" },
      { value: "20 inches", label: "20 inches" },
      { value: "22 inches", label: "22 inches" },
      { value: "24 inches", label: "24 inches" },
      { value: "26 inches", label: "26 inches" },
    ],
  },
];

export const singleFilter = [
  {
    id: "price",
    name: "Price",
    options: [
      { value: "0-50000", label: "Under ₦50,000" },
      { value: "50000-100000", label: "₦50,000 - ₦100,000" },
      { value: "100000-150000", label: "₦100,000 - ₦150,000" },
      { value: "150000-200000", label: "₦150,000 - ₦200,000" },
      { value: "200000-999999", label: "Above ₦200,000" },
    ],
  },
  {
    id: "discount",
    name: "Discount",
    options: [
      { value: "10", label: "10% and above" },
      { value: "20", label: "20% and above" },
      { value: "30", label: "30% and above" },
      { value: "40", label: "40% and above" },
      { value: "50", label: "50% and above" },
    ],
  },
  {
    id: "stock",
    name: "Availability",
    options: [
      { value: "in_stock", label: "In Stock" },
      { value: "out_of_stock", label: "Out of Stock" },
    ],
  },
];

export const sortOptions = [
  { name: "Price: Low to High", query: "price_low", current: false },
  { name: "Price: High to Low", query: "price_high", current: false },
  { name: "Discount: High to Low", query: "discount_high", current: false },
  { name: "Rating: High to Low", query: "rating_high", current: false },
];
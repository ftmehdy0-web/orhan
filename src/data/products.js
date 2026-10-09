// Orhan India - Online Ordering Menu Database (Burger King India Style)
window.ORHAN_PRODUCTS = [
  // 1. Trending & Best Sellers
  {
    id: "orhan-sultan-whopper-chicken",
    name: "Orhan Sultan Whopper® (Chicken)",
    category: "bestsellers",
    isVeg: false,
    tag: "Bestseller",
    price: 219,
    calories: "580 kcal",
    rating: 4.9,
    reviewsCount: 1420,
    description: "Our signature flame-grilled double chicken patty loaded with crunchy lettuce, creamy mayo, sliced juicy tomatoes, and pickles on a 5-inch toasted sesame seed bun.",
    image: "assets/images/orhan-hero-burger.jpg",
    customisable: true
  },
  {
    id: "orhan-crispy-veg-burger",
    name: "Crispy Veg Double Patty Burger",
    category: "bestsellers",
    isVeg: true,
    tag: "Bestseller",
    price: 99,
    calories: "420 kcal",
    rating: 4.8,
    reviewsCount: 2310,
    description: "Crispy fried spiced potato and vegetable patties with crunchy lettuce, special tangy tandoori sauce on toasted sesame buns.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    customisable: true
  },
  {
    id: "peri-peri-fries-king",
    name: "King Peri Peri Fries",
    category: "bestsellers",
    isVeg: true,
    tag: "Must Try",
    price: 119,
    calories: "340 kcal",
    rating: 4.9,
    reviewsCount: 3100,
    description: "Golden crispy salted French fries served with a fiery hot Peri Peri seasoning mix shaker sachet.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    customisable: false
  },
  {
    id: "chocolate-thick-shake",
    name: "BK Hershey's Chocolate Thick Shake",
    category: "bestsellers",
    isVeg: true,
    tag: "Sweet Hit",
    price: 169,
    calories: "450 kcal",
    rating: 4.9,
    reviewsCount: 890,
    description: "Rich and creamy real Hershey's chocolate fudge blended with dairy soft serve, topped with chocolate drizzle.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    customisable: false
  },

  // 2. The Sultan Whopper® (Flame-Grilled)
  {
    id: "flame-grilled-mutton-whopper",
    name: "Royal Flame-Grilled Mutton Whopper®",
    category: "whopper",
    isVeg: false,
    tag: "Flame-Grilled",
    price: 299,
    calories: "690 kcal",
    rating: 4.9,
    reviewsCount: 940,
    description: "Flame-grilled juicy seasoned mutton patty, loaded with melted cheddar cheese slice, fresh crunchy greens, onion rings, and smoky BBQ sauce.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    customisable: true
  },
  {
    id: "veg-whopper-original",
    name: "Veg Whopper® with Cheese",
    category: "whopper",
    isVeg: true,
    tag: "Signature",
    price: 189,
    calories: "510 kcal",
    rating: 4.8,
    reviewsCount: 1840,
    description: "The classic flame-grilled veg patty with crunchy gherkins, fresh tomato slice, sliced red onion, crisp lettuce, melted cheese, and creamy mayo.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    customisable: true
  },
  {
    id: "fiery-chicken-whopper",
    name: "Fiery Hell-Flame Chicken Whopper®",
    category: "whopper",
    isVeg: false,
    tag: "Spicy 🔥",
    price: 239,
    calories: "610 kcal",
    rating: 4.9,
    reviewsCount: 1250,
    description: "Flame-grilled chicken patty spiced with fiery ghost pepper hot sauce, jalapeno slices, crispy lettuce, and melted pepper jack cheese on sesame bun.",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80",
    customisable: true
  },
  {
    id: "paneer-royale-whopper",
    name: "Paneer Royale Melt Whopper®",
    category: "whopper",
    isVeg: true,
    tag: "Chef's Pick",
    price: 209,
    calories: "540 kcal",
    rating: 4.8,
    reviewsCount: 780,
    description: "Thick slab of golden fried Malai Paneer patty seasoned in tandoori spices, topped with mint mayo, sliced capsicum, and cheddar melt.",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80",
    customisable: true
  },

  // 3. Value Burgers (Starting @ ₹79)
  {
    id: "crispy-veg-regular",
    name: "Classic Crispy Veg Burger",
    category: "value-burgers",
    isVeg: true,
    tag: "Value @ ₹79",
    price: 79,
    calories: "320 kcal",
    rating: 4.7,
    reviewsCount: 4200,
    description: "Mashed vegetable patty spiced with cumin, coriander, and chili, topped with creamy Thousand Island sauce and lettuce on soft bun.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    customisable: true
  },
  {
    id: "crispy-chicken-regular",
    name: "Classic Crispy Chicken Burger",
    category: "value-burgers",
    isVeg: false,
    tag: "Value @ ₹99",
    price: 99,
    calories: "390 kcal",
    rating: 4.8,
    reviewsCount: 3100,
    description: "Golden fried tender minced chicken patty with black pepper mayo and crunchy iceberg lettuce on a toasted bun.",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80",
    customisable: true
  },
  {
    id: "tikki-twist-burger",
    name: "Aloo Tikki Twist Burger",
    category: "value-burgers",
    isVeg: true,
    tag: "Street Style",
    price: 69,
    calories: "290 kcal",
    rating: 4.6,
    reviewsCount: 1800,
    description: "Desi spiced crispy potato tikki with tangy imli chutney, chopped onions, and chaat mayo in a soft bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    customisable: false
  },
  {
    id: "makhani-burst-burger",
    name: "Chicken Makhani Burst Burger",
    category: "value-burgers",
    isVeg: false,
    tag: "Desi Fusion",
    price: 139,
    calories: "440 kcal",
    rating: 4.7,
    reviewsCount: 920,
    description: "Crispy chicken patty generously drizzled with rich butter chicken makhani gravy and pickled onions.",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80",
    customisable: true
  },

  // 4. King Combos & Feast Meals
  {
    id: "whopper-chicken-meal",
    name: "Orhan Chicken Whopper® Meal",
    category: "combos",
    isVeg: false,
    tag: "Complete Meal",
    price: 339,
    calories: "920 kcal",
    rating: 4.9,
    reviewsCount: 1100,
    description: "1x Chicken Whopper® + 1x King Salted Fries (M) + 1x Coca-Cola (Medium). The ultimate hunger buster.",
    image: "assets/images/orhan-hero-burger.jpg",
    customisable: true
  },
  {
    id: "veg-whopper-meal",
    name: "Orhan Veg Whopper® Meal",
    category: "combos",
    isVeg: true,
    tag: "Complete Meal",
    price: 299,
    calories: "840 kcal",
    rating: 4.8,
    reviewsCount: 1400,
    description: "1x Veg Whopper® with Cheese + 1x King Salted Fries (M) + 1x Coca-Cola (Medium).",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    customisable: true
  },
  {
    id: "buddy-feast-combo",
    name: "King's Buddy Feast (Serves 2)",
    category: "combos",
    isVeg: false,
    tag: "Save ₹150",
    price: 499,
    calories: "1480 kcal",
    rating: 4.9,
    reviewsCount: 860,
    description: "1x Chicken Whopper® + 1x Crispy Veg Double Patty + 1x Large Peri Peri Fries + 2x Cokes.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    customisable: true
  },

  // 5. Loaded Sides & Peri Peri Fries
  {
    id: "cheesy-fries-burst",
    name: "King Cheesy Loaded Fries",
    category: "sides",
    isVeg: true,
    tag: "Cheesy Lava",
    price: 149,
    calories: "460 kcal",
    rating: 4.9,
    reviewsCount: 1950,
    description: "Hot crisp golden French fries generously drowned in warm melted cheese sauce and roasted jalapeno relish.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    customisable: false
  },
  {
    id: "onion-rings-basket",
    name: "Golden Crispy Onion Rings (8 Pcs)",
    category: "sides",
    isVeg: true,
    tag: "Snack Hit",
    price: 119,
    calories: "310 kcal",
    rating: 4.7,
    reviewsCount: 820,
    description: "Fresh white onion slices battered in spiced crumb and flash-fried to golden perfection. Served with tandoori dip.",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
    customisable: false
  },
  {
    id: "veg-pizza-puff",
    name: "Veggie Pizza Puff Pockets (2 Pcs)",
    category: "sides",
    isVeg: true,
    tag: "Hot & Crispy",
    price: 89,
    calories: "280 kcal",
    rating: 4.6,
    reviewsCount: 640,
    description: "Flaky golden pastry pockets stuffed with gooey mozzarella cheese, sweet corn, capsicum, and oregano pizza sauce.",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
    customisable: false
  },

  // 6. Crispy Chicken & Wings
  {
    id: "chicken-wings-flame",
    name: "Flame-Kissed Chicken Wings (4 Pcs)",
    category: "chicken",
    isVeg: false,
    tag: "Hot Seller",
    price: 189,
    calories: "410 kcal",
    rating: 4.9,
    reviewsCount: 1650,
    description: "Juicy marinated bone-in chicken wings tossed in signature smoky hickory BBQ glaze and toasted sesame seeds.",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80",
    customisable: false
  },
  {
    id: "chicken-nuggets-basket",
    name: "King Crunchy Chicken Nuggets (6 Pcs)",
    category: "chicken",
    isVeg: false,
    tag: "Kids Fav",
    price: 139,
    calories: "320 kcal",
    rating: 4.8,
    reviewsCount: 1220,
    description: "Bite-sized tender all-white meat chicken nuggets in a crispy batter. Served with sweet honey mustard dip.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    customisable: false
  },

  // 7. Orhan Cafe & Thick Shakes
  {
    id: "hazelnut-frappe",
    name: "BK Cafe Hazelnut Cold Coffee",
    category: "cafe-shakes",
    isVeg: true,
    tag: "Chilled Brew",
    price: 159,
    calories: "290 kcal",
    rating: 4.9,
    reviewsCount: 980,
    description: "Brewed roasted Arabica espresso blended with cold milk, crushed ice, and roasted hazelnut syrup.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    customisable: false
  },
  {
    id: "mango-thick-shake",
    name: "Alphonso Mango Thick Shake",
    category: "cafe-shakes",
    isVeg: true,
    tag: "Seasonal",
    price: 169,
    calories: "380 kcal",
    rating: 4.8,
    reviewsCount: 650,
    description: "Real Ratnagiri Alphonso mango pulp blended with rich vanilla soft serve into a thick, luxurious shake.",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80",
    customisable: false
  },
  {
    id: "coke-zero-can",
    name: "Coca-Cola Zero Sugar (330ml)",
    category: "cafe-shakes",
    isVeg: true,
    tag: "0 Calories",
    price: 60,
    calories: "0 kcal",
    rating: 4.8,
    reviewsCount: 800,
    description: "Chilled can of Coca-Cola with zero sugar and zero calories.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    customisable: false
  },

  // 8. Desserts & Soft Serves
  {
    id: "hot-fudge-sundae",
    name: "BK Warm Chocolate Fudge Sundae",
    category: "desserts",
    isVeg: true,
    tag: "Classic",
    price: 89,
    calories: "260 kcal",
    rating: 4.9,
    reviewsCount: 1540,
    description: "Silky smooth vanilla soft serve crowned with piping hot Hershey's chocolate fudge syrup.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    customisable: false
  },
  {
    id: "softie-cone-vanilla",
    name: "Creamy Vanilla Softie Cone",
    category: "desserts",
    isVeg: true,
    tag: "Sweet Bite",
    price: 39,
    calories: "140 kcal",
    rating: 4.7,
    reviewsCount: 2200,
    description: "Crispy wafer cone filled high with velvety cold vanilla soft serve.",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80",
    customisable: false
  }
];

// BK India Category Definitions with Icons
window.ORHAN_CATEGORIES = [
  { id: "all", name: "All Items", icon: "🍔" },
  { id: "bestsellers", name: "Trending & Best Sellers", icon: "⭐" },
  { id: "whopper", name: "The Sultan Whopper®", icon: "👑" },
  { id: "value-burgers", name: "Burgers from ₹79", icon: "💰" },
  { id: "combos", name: "King Combos & Meals", icon: "🎁" },
  { id: "sides", name: "Peri Peri Fries & Sides", icon: "🍟" },
  { id: "chicken", name: "Crispy Wings & Nuggets", icon: "🍗" },
  { id: "cafe-shakes", name: "BK Cafe & Shakes", icon: "🥤" },
  { id: "desserts", name: "Desserts & Sundaes", icon: "🍨" }
];

// Customiser Data (Burger King India Style)
window.ORHAN_BUILDER_DATA = {
  buns: [
    { id: "sesame-crown", name: "Toasted 5-Inch Sesame Bun", price: 25, cal: 180, icon: "🍔", desc: "Signature fluffy golden bun with toasted sesame" },
    { id: "brioche-deluxe", name: "Butter Glazed Brioche Bun", price: 35, cal: 210, icon: "👑", desc: "Rich and buttery soft glazed gourmet bun" },
    { id: "whole-wheat", name: "High-Fibre Whole Wheat Bun", price: 25, cal: 170, icon: "🌾", desc: "Wholesome toasted multigrain bun" }
  ],
  patties: [
    { id: "flame-chicken", name: "Flame-Grilled Chicken Patty", price: 70, cal: 220, icon: "🍗", desc: "100% real chicken flame-seared on Binchotan grill" },
    { id: "crispy-veg", name: "Crispy Golden Veg Patty", price: 50, cal: 190, icon: "🥔", desc: "Spiced potato and green peas crispy patty" },
    { id: "royal-mutton", name: "Flame-Grilled Juicy Mutton", price: 110, cal: 280, icon: "🥩", desc: "Coarsely spiced rich minced mutton patty" },
    { id: "paneer-slab", name: "Golden Spiced Paneer Slab", price: 65, cal: 240, icon: "🧀", desc: "Marinated Malai paneer fried to golden crust" }
  ],
  cheeses: [
    { id: "cheddar-slice", name: "Melted Cheddar Cheese Slice", price: 25, cal: 70, icon: "🧀", desc: "Classic rich cheddar cheese slice" },
    { id: "cheesy-lava-sauce", name: "Warm Cheesy Lava Pour", price: 35, cal: 95, icon: "🧀", desc: "Gooey warm melted cheese sauce" }
  ],
  toppings: [
    { id: "jalapenos", name: "Spicy Pickled Jalapeños", price: 20, cal: 10, icon: "🌶️", desc: "Zesty Mexican pickled chili rings" },
    { id: "grilled-onions", name: "Caramelized Grilled Onions", price: 20, cal: 30, icon: "🧅", desc: "Sweet griddled onions" },
    { id: "crunchy-gherkins", name: "Dill Pickle Gherkins", price: 15, cal: 5, icon: "🥒", desc: "Crunchy vinegar dill pickles" },
    { id: "fresh-tomatoes", name: "Juicy Farm Tomatoes", price: 15, cal: 10, icon: "🍅", desc: "Fresh sliced ripe red tomatoes" }
  ],
  sauces: [
    { id: "tandoori-mayo", name: "Smoky Tandoori Mayo", price: 20, cal: 60, icon: "🔥", desc: "Spiced Indian tandoori creamy mayo" },
    { id: "fiery-hell", name: "Fiery Ghost Pepper Sauce", price: 25, cal: 45, icon: "🌶️", desc: "Extra hot fiery chili sauce" },
    { id: "hickory-bbq", name: "Smoky Hickory BBQ Glaze", price: 20, cal: 50, icon: "🍖", desc: "Sweet and tangy oak smoked BBQ" },
    { id: "mint-mayo", name: "Pudina Herb Mayo", price: 20, cal: 55, icon: "🌿", desc: "Refreshing Indian mint & garlic sauce" }
  ]
};

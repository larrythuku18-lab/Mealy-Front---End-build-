export const categories = [
  {
    id: 1,
    name: "All",
    icon: "https://res.cloudinary.com/diwkfbsgv/image/upload/v1787548169/CD265227-A7D6-4869-9F0C-A18049CA4A49_kebn6p.png",
  },
  {
    id: 2,
    name: "Breakfast",
    icon: "https://res.cloudinary.com/diwkfbsgv/image/upload/v1787549853/1EF307C6-FB1A-4D2A-BD2B-1392F861B143_aca8tx.png",
  },
  {
    id: 3,
    name: "Whole Meals",
    icon: "https://res.cloudinary.com/diwkfbsgv/image/upload/v1787549852/535D7166-0CC4-4CF1-80EE-C58B091C73D4_xo0ikp.png",
  },
  {
    id: 4,
    name: "Fast Foods",
    icon: "https://res.cloudinary.com/diwkfbsgv/image/upload/v1787549866/0032C455-7826-4F93-A99F-37891AE48E13_sowzvh.png",
  },
  {
    id: 5,
    name: "Snacks",
    icon: "https://res.cloudinary.com/diwkfbsgv/image/upload/v1787550623/639A699A-C43C-449D-AA4A-81635232815A_ocwfck.png",
  },
  {
    id: 6,
    name: "Drinks",
    icon: "https://res.cloudinary.com/diwkfbsgv/image/upload/v1787549852/2CDFC2A0-66DA-4A63-938B-8A463585BF2F_htafm0.png",
  },
];

export const dailyOptions = [
  {
    id: "d1",
    name: "Beef with Rice",
    description:
      "Tender beef slices served over brown jasmine rice with steamed broccoli.",
    price: 1050,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
  },
  {
    id: "d3",
    name: "Veggie Pasta",
    description:
      "Whole wheat penne with fresh cherry tomatoes, basil, and light parmesan.",
    price: 1200,
    rating: 4.1,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
  },
  {
    id: "d4",
    name: "Salmon Teriyaki",
    description:
      "Salmon fillet glazed with teriyaki sauce, served with roasted bok choy.",
    price: 2000,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
  },
  {
    id: "d5",
    name: "Pilau Special",
    description:
      "Fragrant spiced pilau rice paired with tender goat meat and kachumbari.",
    price: 1300,
    rating: 3.9,
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
  },
  {
    id: "d6",
    name: "Nyama Choma Platter",
    description:
      "Charcoal-grilled beef ribs served with ugali, sukuma wiki, and chimichurri.",
    price: 1800,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
  },
  {
    id: "d7",
    name: "Fish & Chips",
    description:
      "Beer-battered tilapia fillets with hand-cut chips and tangy tartar sauce.",
    price: 1100,
    rating: 3.6,
    image:
      "https://images.unsplash.com/photo-1534604973900-c439d46a407f?w=400&h=300&fit=crop",
  },
  {
    id: "d8",
    name: "Butter Chicken",
    description:
      "Creamy tomato-based chicken curry served with garlic naan and basmati rice.",
    price: 1400,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
  },
  {
    id: "d9",
    name: "Masala Chai",
    description:
      "Freshly brewed spiced chai tea with aromatic Indian spices.",
    price: 450,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop",
  },
];

export const meals = [
  {
    id: 1,
    name: "Pancake Stack",
    description: "Fluffy pancakes with maple syrup and fresh berries",
    price: 850,
    rating: 4.3,
    category: ["Breakfast"],
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 2,
    name: "Caesar Salad",
    description: "Romaine lettuce, parmesan, croutons, and Caesar dressing",
    price: 1000,
    rating: 4.1,
    category: ["Whole Meals"],
    image:
      "https://i.pinimg.com/736x/41/b3/ac/41b3ac8e22d2c01e5db2e091ee69e080.jpg",
    available: true,
  },
  {
    id: 3,
    name: "Grilled Chicken Pasta",
    description: "Penne pasta with grilled chicken in Alfredo sauce",
    price: 1400,
    rating: 4.6,
    category: ["Whole Meals"],
    image:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 4,
    name: "Avocado Toast",
    description: "Sourdough toast topped with smashed avocado and poached egg",
    price: 900,
    rating: 4.4,
    category: ["Breakfast"],
    image:
      "https://i.pinimg.com/1200x/b9/39/37/b939375d57c80384cfeed1868628c5c3.jpg",
    available: true,
  },
  {
    id: 5,
    name: "Berry Smoothie",
    description: "Mixed berries blended with yogurt and honey",
    price: 650,
    rating: 4.7,
    category: ["Drinks"],
    image:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 6,
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon butter and roasted vegetables",
    price: 1800,
    rating: 4.8,
    category: ["Whole Meals"],
    image:
      "https://i.pinimg.com/736x/d0/5f/2e/d05f2ea7519ec2180967b8b773f63a1f.jpg",
    available: true,
  },
  {
    id: 7,
    name: "Chicken Wrap",
    description: "Grilled chicken, veggies, and hummus in a whole wheat wrap",
    price: 1100,
    rating: 4.0,
    category: ["Fast Foods", "Snacks"],
    image:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 8,
    name: "Iced Lemon Tea",
    description: "Refreshing iced tea with fresh lemon and mint",
    price: 400,
    rating: 4.5,
    category: ["Drinks"],
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 9,
    name: "Mushroom Omelette",
    description: "Three-egg omelette with sautéed mushrooms and cheese",
    price: 950,
    rating: 4.3,
    category: ["Breakfast"],
    image:
      "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 10,
    name: "Chapati & Beans Stew",
    description: "Soft layered chapati served with delicious coconut bean stew",
    price: 850,
    rating: 4.8,
    category: ["Whole Meals"],
    image:
      "https://plus.unsplash.com/premium_photo-1723730426108-1bb37a500d5c?q=80&w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 11,
    name: "Garlic Masala Fries",
    description:
      "Crispy fries tossed in a spicy, tangy tomato-based masala sauce",
    price: 900,
    rating: 4.5,
    category: ["Fast Foods"],
    image:
      "https://i.pinimg.com/736x/24/6b/ea/246bea12bc1e0937deb7a6a12cb01a75.jpg",
    available: true,
  },
  {
    id: 12,
    name: "Coconut Curry Tilapia",
    description:
      "Deep-fried fresh lake tilapia simmered in tomato and onion stew, served with ugali",
    price: 1100,
    rating: 4.7,
    category: ["Whole Meals"],
    image:
      "https://i.pinimg.com/1200x/a7/1a/49/a71a4926cd93a589f0fdfe44af9239f3.jpg",
    available: true,
  },
  {
    id: 13,
    name: "Sesame Chicken & Fries",
    description:
      "Free-range local chicken stew served with mashed potatoes, corn, and greens mash",
    price: 1800,
    rating: 4.8,
    category: ["Fast Foods"],
    image:
      "https://images.unsplash.com/photo-1709164632728-8a943456dd0a?q=80&w=1353&auto=format&fit=crop",
    available: true,
  },
  {
    id: 14,
    name: "Beef Samosas (3pcs)",
    description:
      "Crispy triangular pastries filled with spiced minced beef and green onions",
    price: 850,
    rating: 4.6,
    category: ["Snacks"],
    image:
      "https://i.pinimg.com/736x/60/9d/04/609d04d675614f7db974a1d0225fc41d.jpg",
    available: true,
  },
  {
    id: 15,
    name: "Viazi Karai",
    description:
      "Coated deep-fried spicy potatoes served with local tamarind chutney",
    price: 900,
    rating: 4.4,
    category: ["Snacks"],
    image:
      "https://i.pinimg.com/1200x/3e/b2/ee/3eb2eecf6527870ab1a4a4ab28cbca63.jpg",
    available: true,
  },
  {
    id: 16,
    name: "Dawa Cocktail",
    description:
      "Famous Kenyan drink made of vodka, honey, lime, and crushed ice",
    price: 950,
    rating: 4.7,
    category: ["Drinks"],
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 17,
    name: "Plain Fries",
    description: "Classic crispy golden salted potato french fries",
    price: 850,
    rating: 4.1,
    category: ["Fast Foods"],
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 18,
    name: "Kericho Gold Tea",
    description: "Brewed milk tea made from premium Kenyan tea leaves",
    price: 850,
    rating: 4.5,
    category: ["Drinks"],
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 19,
    name: "Mandazi & Chai",
    description: "Freshly fried Swahili mandazi served with spiced chai tea",
    price: 350,
    rating: 4.6,
    category: ["Breakfast", "Snacks"],
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 20,
    name: "Ugali & Sukuma Wiki",
    description: "Traditional Kenyan staple of maize meal ugali with sautéed collard greens",
    price: 500,
    rating: 4.3,
    category: ["Whole Meals"],
    image:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 21,
    name: "Matoke & Beef Stew",
    description: "Steamed green bananas simmered in a rich beef and tomato stew",
    price: 950,
    rating: 4.4,
    category: ["Whole Meals"],
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 22,
    name: "Githeri",
    description: "Hearty mix of boiled maize and beans garnished with fresh coriander",
    price: 600,
    rating: 4.2,
    category: ["Whole Meals"],
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 23,
    name: "Chicken Burger",
    description: "Crispy fried chicken fillet in a toasted sesame bun with coleslaw",
    price: 1200,
    rating: 4.5,
    category: ["Fast Foods"],
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 24,
    name: "Beef Burger",
    description: "Flame-grilled beef patty with cheddar, pickles, and smoky BBQ sauce",
    price: 1350,
    rating: 4.7,
    category: ["Fast Foods"],
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 25,
    name: "Loaded Nachos",
    description: "Crispy tortilla chips topped with cheese, jalapeños, guacamole, and salsa",
    price: 950,
    rating: 4.3,
    category: ["Snacks", "Fast Foods"],
    image:
      "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 26,
    name: "Spring Rolls (4pcs)",
    description: "Crispy vegetable spring rolls served with sweet chili dipping sauce",
    price: 550,
    rating: 4.1,
    category: ["Snacks"],
    image:
      "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 27,
    name: "Fresh Mango Juice",
    description: "Freshly squeezed ripe mango juice served ice cold",
    price: 350,
    rating: 4.8,
    category: ["Drinks"],
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 28,
    name: "Passion Fruit Juice",
    description: "Tangy and refreshing passion fruit juice with a hint of sweetness",
    price: 350,
    rating: 4.6,
    category: ["Drinks"],
    image:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 29,
    name: "Espresso Coffee",
    description: "Double shot espresso brewed from premium Kenyan AA coffee beans",
    price: 300,
    rating: 4.7,
    category: ["Drinks", "Breakfast"],
    image:
      "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 30,
    name: "Mango Lassi",
    description: "Creamy yogurt-based mango smoothie with a touch of cardamom",
    price: 400,
    rating: 4.5,
    category: ["Drinks"],
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 31,
    name: "Irio",
    description: "Mashed green peas, potatoes, and corn — a classic Kikuyu dish",
    price: 600,
    rating: 4.3,
    category: ["Whole Meals"],
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 32,
    name: "Chicken Shawarma",
    description: "Spiced grilled chicken wrapped in pita with tahini sauce and pickled veggies",
    price: 1100,
    rating: 4.6,
    category: ["Fast Foods"],
    image:
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop",
    available: true,
  },
];

export const initialOrders = [
  {
    id: "ORD-001",
    meals: [
      { ...meals[0], quantity: 2 },
      { ...meals[4], quantity: 1 },
    ],
    status: "delivered",
    date: "2026-08-19",
    total: 2350,
  },
  {
    id: "ORD-002",
    meals: [
      { ...meals[2], quantity: 1 },
      { ...meals[8], quantity: 2 },
    ],
    status: "in_transit",
    date: "2026-08-21",
    total: 2200,
  },
  {
    id: "ORD-003",
    meals: [{ ...meals[1], quantity: 1 }],
    status: "preparing",
    date: "2026-08-21",
    total: 1000,
  },
];

export const currentUser = {
  id: 1,
  name: "",
  email: "john@example.com",
  phone: "+254 700 000 000",
  role: "user",
  joinedDate: "2026-07-15",
  address: "Nairobi, Kenya",
};

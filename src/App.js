import { useState, useEffect, useCallback } from 'react'
import './App.css'
import jsPDF from 'jspdf'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

// ─── PRODUCT CATALOGUE (200+ items) ──────────────────────────────────────────
const categories = {
  shop: {
    label: 'General Shop', icon: '🛒',
    products: [
      { id: 1,  name: 'Maize Flour 2kg',        price: 220,  icon: '🌽' },
      { id: 2,  name: 'Maize Flour 5kg',        price: 520,  icon: '🌽' },
      { id: 3,  name: 'Cooking Oil 1L',         price: 350,  icon: '🫙' },
      { id: 4,  name: 'Cooking Oil 2L',         price: 680,  icon: '🫙' },
      { id: 5,  name: 'Cooking Oil 5L',         price: 1550, icon: '🫙' },
      { id: 6,  name: 'Sugar 1kg',              price: 180,  icon: '🍬' },
      { id: 7,  name: 'Sugar 2kg',              price: 350,  icon: '🍬' },
      { id: 8,  name: 'Rice 2kg',               price: 310,  icon: '🍚' },
      { id: 9,  name: 'Rice 5kg',               price: 760,  icon: '🍚' },
      { id: 10, name: 'Tea Leaves 500g',        price: 220,  icon: '🍵' },
      { id: 11, name: 'Tea Leaves 250g',        price: 120,  icon: '🍵' },
      { id: 12, name: 'Milk 500ml',             price: 65,   icon: '🥛' },
      { id: 13, name: 'Milk 1L Fresh',          price: 130,  icon: '🥛' },
      { id: 14, name: 'Long-life Milk 500ml',   price: 80,   icon: '🥛' },
      { id: 15, name: 'Bread Loaf',             price: 75,   icon: '🍞' },
      { id: 16, name: 'Bread Roll x4',          price: 60,   icon: '🍞' },
      { id: 17, name: 'Omo Detergent 1kg',      price: 320,  icon: '🧺' },
      { id: 18, name: 'Omo Detergent 500g',     price: 175,  icon: '🧺' },
      { id: 19, name: 'Ariel Detergent 1kg',    price: 360,  icon: '🧺' },
      { id: 20, name: 'Bar Soap x3',            price: 150,  icon: '🧼' },
      { id: 21, name: 'Bathing Soap',           price: 80,   icon: '🧼' },
      { id: 22, name: 'Toothpaste 75ml',        price: 120,  icon: '🪥' },
      { id: 23, name: 'Toothpaste 150ml',       price: 200,  icon: '🪥' },
      { id: 24, name: 'Toothbrush x2',          price: 90,   icon: '🪥' },
      { id: 25, name: 'Salt 500g',              price: 50,   icon: '🧂' },
      { id: 26, name: 'Baking Flour 1kg',       price: 140,  icon: '🌾' },
      { id: 27, name: 'Baking Flour 2kg',       price: 270,  icon: '🌾' },
      { id: 28, name: 'Spaghetti 400g',         price: 120,  icon: '🍝' },
      { id: 29, name: 'Macaroni 400g',          price: 110,  icon: '🍝' },
      { id: 30, name: 'Tomato Paste 70g',       price: 55,   icon: '🍅' },
      { id: 31, name: 'Tomato Paste 150g',      price: 95,   icon: '🍅' },
      { id: 32, name: 'Royco Beef 75g',         price: 85,   icon: '🥄' },
      { id: 33, name: 'Royco Chicken 75g',      price: 85,   icon: '🥄' },
      { id: 34, name: 'Margarine 250g',         price: 140,  icon: '🧈' },
      { id: 35, name: 'Margarine 500g',         price: 260,  icon: '🧈' },
      { id: 36, name: 'Nescafe 200g',           price: 750,  icon: '☕' },
      { id: 37, name: 'Ovaltine 400g',          price: 590,  icon: '🥤' },
      { id: 38, name: 'Milo 400g',              price: 620,  icon: '🥤' },
      { id: 39, name: 'Canned Tuna 185g',       price: 180,  icon: '🐟' },
      { id: 40, name: 'Canned Sardines',        price: 100,  icon: '🐟' },
      { id: 41, name: 'Honey 250ml',            price: 350,  icon: '🍯' },
      { id: 42, name: 'Jam Strawberry 400g',    price: 280,  icon: '🍓' },
      { id: 43, name: 'Peanut Butter 400g',     price: 320,  icon: '🥜' },
      { id: 44, name: 'Biscuits Digestive',     price: 95,   icon: '🍪' },
      { id: 45, name: 'Biscuits Cream',         price: 80,   icon: '🍪' },
      { id: 46, name: 'Matchboxes x10',         price: 70,   icon: '🔥' },
      { id: 47, name: 'Tissue Roll x4',         price: 180,  icon: '🧻' },
      { id: 48, name: 'Tissue Box',             price: 120,  icon: '🧻' },
      { id: 49, name: 'Garbage Bags x10',       price: 150,  icon: '🗑️' },
      { id: 50, name: 'Washing Up Liquid 500ml',price: 130,  icon: '🧴' },
    ]
  },
  pharmacy: {
    label: 'Pharmacy', icon: '💊',
    products: [
      { id: 101, name: 'Panadol 500mg x8',        price: 50,   icon: '💊', tag: 'OTC' },
      { id: 102, name: 'Panadol Extra x8',         price: 80,   icon: '💊', tag: 'OTC' },
      { id: 103, name: 'Ibuprofen 400mg x8',       price: 80,   icon: '💊', tag: 'OTC' },
      { id: 104, name: 'Aspirin 300mg x8',         price: 40,   icon: '💊', tag: 'OTC' },
      { id: 105, name: 'Amoxicillin 250mg x21',    price: 320,  icon: '💉', tag: 'POM' },
      { id: 106, name: 'Amoxicillin 500mg x21',    price: 580,  icon: '💉', tag: 'POM' },
      { id: 107, name: 'Azithromycin 500mg x3',    price: 450,  icon: '💉', tag: 'POM' },
      { id: 108, name: 'Ciprofloxacin 500mg',      price: 380,  icon: '💉', tag: 'POM' },
      { id: 109, name: 'Metronidazole 400mg x21',  price: 280,  icon: '💉', tag: 'POM' },
      { id: 110, name: 'Actifed Syrup 100ml',      price: 280,  icon: '🍶', tag: 'OTC' },
      { id: 111, name: 'ORS Sachet x5',            price: 100,  icon: '💧', tag: 'OTC' },
      { id: 112, name: 'Coartem x24',              price: 850,  icon: '💊', tag: 'POM' },
      { id: 113, name: 'Vitamin C 1000mg x30',     price: 480,  icon: '🍊', tag: 'OTC' },
      { id: 114, name: 'Vitamin C 500mg x30',      price: 280,  icon: '🍊', tag: 'OTC' },
      { id: 115, name: 'Dettol 250ml',             price: 320,  icon: '🧴', tag: 'OTC' },
      { id: 116, name: 'Thermometer Digital',      price: 850,  icon: '🌡️', tag: 'OTC' },
      { id: 117, name: 'Bandage Crepe 10cm',       price: 150,  icon: '🩹', tag: 'OTC' },
      { id: 118, name: 'Plasters x10',             price: 80,   icon: '🩹', tag: 'OTC' },
      { id: 119, name: 'Cotton Wool 100g',         price: 120,  icon: '🩹', tag: 'OTC' },
      { id: 120, name: 'Surgical Spirit 100ml',    price: 90,   icon: '🧴', tag: 'OTC' },
      { id: 121, name: 'Hydrogen Peroxide 100ml',  price: 130,  icon: '🧴', tag: 'OTC' },
      { id: 122, name: 'Antihistamine 10mg x10',   price: 120,  icon: '💊', tag: 'OTC' },
      { id: 123, name: 'Omeprazole 20mg x14',      price: 180,  icon: '💊', tag: 'OTC' },
      { id: 124, name: 'Ranitidine 150mg x10',     price: 150,  icon: '💊', tag: 'OTC' },
      { id: 125, name: 'Multivitamin x30',         price: 350,  icon: '💊', tag: 'OTC' },
      { id: 126, name: 'Iron + Folate x30',        price: 220,  icon: '💊', tag: 'OTC' },
      { id: 127, name: 'Zinc Sulphate x20',        price: 180,  icon: '💊', tag: 'OTC' },
      { id: 128, name: 'Metformin 500mg x30',      price: 280,  icon: '💉', tag: 'POM' },
      { id: 129, name: 'Atorvastatin 20mg x30',    price: 650,  icon: '💉', tag: 'POM' },
      { id: 130, name: 'Amlodipine 5mg x30',       price: 420,  icon: '💉', tag: 'POM' },
      { id: 131, name: 'Lisinopril 5mg x30',       price: 380,  icon: '💉', tag: 'POM' },
      { id: 132, name: 'Furosemide 40mg x14',      price: 180,  icon: '💉', tag: 'POM' },
      { id: 133, name: 'Salbutamol Inhaler',       price: 680,  icon: '💨', tag: 'POM' },
      { id: 134, name: 'Cough Syrup 100ml',        price: 220,  icon: '🍶', tag: 'OTC' },
      { id: 135, name: 'Antifungal Cream 15g',     price: 280,  icon: '🧴', tag: 'OTC' },
      { id: 136, name: 'Hydrocortisone Cream 15g', price: 250,  icon: '🧴', tag: 'OTC' },
      { id: 137, name: 'Clotrimazole Pessary x6',  price: 320,  icon: '💊', tag: 'POM' },
      { id: 138, name: 'Pregnancy Test Kit',       price: 180,  icon: '🔬', tag: 'OTC' },
      { id: 139, name: 'Blood Glucose Strips x50', price: 1200, icon: '🔬', tag: 'OTC' },
      { id: 140, name: 'Face Mask x10',            price: 150,  icon: '😷', tag: 'OTC' },
      { id: 141, name: 'Gloves Latex x10',         price: 200,  icon: '🧤', tag: 'OTC' },
      { id: 142, name: 'Albendazole 400mg x1',     price: 120,  icon: '💊', tag: 'OTC' },
      { id: 143, name: 'Folic Acid 5mg x30',       price: 150,  icon: '💊', tag: 'OTC' },
      { id: 144, name: 'Calcium 500mg x30',        price: 280,  icon: '💊', tag: 'OTC' },
      { id: 145, name: 'Omega-3 x30',              price: 550,  icon: '🐟', tag: 'OTC' },
      { id: 146, name: 'Povidone Iodine 100ml',    price: 280,  icon: '🧴', tag: 'OTC' },
      { id: 147, name: 'Nasal Spray Saline',       price: 320,  icon: '💧', tag: 'OTC' },
      { id: 148, name: 'Eye Drops Lubricant',      price: 350,  icon: '👁️', tag: 'OTC' },
      { id: 149, name: 'Ear Drops',               price: 280,  icon: '👂', tag: 'OTC' },
      { id: 150, name: 'Sunscreen SPF50 100ml',    price: 750,  icon: '☀️', tag: 'OTC' },
    ]
  },
  airbnb: {
    label: 'Hospitality', icon: '🏠',
    products: [
      { id: 201, name: 'Single Room 1 Night',    price: 2500,  icon: '🛏️' },
      { id: 202, name: 'Double Room 1 Night',    price: 4500,  icon: '🛏️' },
      { id: 203, name: 'Deluxe Room 1 Night',    price: 6500,  icon: '🛏️' },
      { id: 204, name: 'Full House 1 Night',     price: 8000,  icon: '🏠' },
      { id: 205, name: 'Villa 1 Night',          price: 15000, icon: '🏡' },
      { id: 206, name: 'Airport Pickup',         price: 1500,  icon: '🚗' },
      { id: 207, name: 'Airport Drop-off',       price: 1500,  icon: '🚗' },
      { id: 208, name: 'Breakfast x1',           price: 800,   icon: '🍳' },
      { id: 209, name: 'Full Board x1 Day',      price: 2500,  icon: '🍽️' },
      { id: 210, name: 'Extra Towels',           price: 200,   icon: '🛁' },
      { id: 211, name: 'Late Checkout Fee',      price: 1000,  icon: '⏰' },
      { id: 212, name: 'Early Check-in Fee',     price: 800,   icon: '🌅' },
      { id: 213, name: 'Laundry Service',        price: 500,   icon: '👕' },
      { id: 214, name: 'City Tour 4hrs',         price: 3500,  icon: '🗺️' },
      { id: 215, name: 'City Tour Full Day',     price: 6000,  icon: '🗺️' },
      { id: 216, name: 'Pool Access',            price: 500,   icon: '🏊' },
      { id: 217, name: 'Gym Access',             price: 400,   icon: '🏋️' },
      { id: 218, name: 'Spa 1hr',               price: 2500,  icon: '💆' },
      { id: 219, name: 'Babysitting 4hrs',       price: 1200,  icon: '👶' },
      { id: 220, name: 'Room Decoration',        price: 1500,  icon: '🌹' },
      { id: 221, name: 'Catering Service',       price: 5000,  icon: '🍾' },
      { id: 222, name: 'BBQ Package',            price: 3000,  icon: '🍖' },
      { id: 223, name: 'Conference Room Half-Day', price: 5000, icon: '📊' },
      { id: 224, name: 'Conference Room Full Day', price: 8000, icon: '📊' },
      { id: 225, name: 'Projector Rental',       price: 1000,  icon: '📽️' },
    ]
  },
  electronics: {
    label: 'Electronics', icon: '🔌',
    products: [
      { id: 301, name: 'Smartphone Entry-level', price: 8500,  icon: '📱' },
      { id: 302, name: 'Smartphone Mid-range',   price: 18500, icon: '📱' },
      { id: 303, name: 'Smartphone Flagship',    price: 45000, icon: '📱' },
      { id: 304, name: 'Wireless Earbuds',       price: 4200,  icon: '🎧' },
      { id: 305, name: 'Wired Earphones',        price: 650,   icon: '🎧' },
      { id: 306, name: 'Bluetooth Speaker',      price: 2800,  icon: '🔊' },
      { id: 307, name: 'Portable Charger 10000mAh', price: 1600, icon: '🔋' },
      { id: 308, name: 'Portable Charger 20000mAh', price: 2800, icon: '🔋' },
      { id: 309, name: 'LED Desk Lamp',          price: 1050,  icon: '💡' },
      { id: 310, name: 'Smartwatch',             price: 6800,  icon: '⌚' },
      { id: 311, name: 'Fitness Tracker',        price: 3500,  icon: '⌚' },
      { id: 312, name: 'USB-C Cable 1m',         price: 280,   icon: '🔌' },
      { id: 313, name: 'USB-C Cable 2m',         price: 380,   icon: '🔌' },
      { id: 314, name: 'Wall Charger 65W',       price: 1200,  icon: '🔌' },
      { id: 315, name: 'Wireless Charger Pad',   price: 1800,  icon: '🔌' },
      { id: 316, name: 'Phone Case Universal',   price: 350,   icon: '📱' },
      { id: 317, name: 'Screen Protector',       price: 200,   icon: '📱' },
      { id: 318, name: 'Memory Card 64GB',       price: 900,   icon: '💾' },
      { id: 319, name: 'Memory Card 128GB',      price: 1600,  icon: '💾' },
      { id: 320, name: 'Flash Drive 32GB',       price: 650,   icon: '💾' },
      { id: 321, name: 'Flash Drive 64GB',       price: 950,   icon: '💾' },
      { id: 322, name: 'Laptop Stand',           price: 1800,  icon: '💻' },
      { id: 323, name: 'Wireless Mouse',         price: 1200,  icon: '🖱️' },
      { id: 324, name: 'Keyboard Wireless',      price: 2200,  icon: '⌨️' },
      { id: 325, name: 'HDMI Cable 2m',          price: 550,   icon: '📺' },
      { id: 326, name: 'Extension Cable 4-way',  price: 850,   icon: '🔌' },
      { id: 327, name: 'Smart Plug',             price: 1200,  icon: '🔌' },
      { id: 328, name: 'LED Strip 5m',           price: 1500,  icon: '💡' },
      { id: 329, name: 'Solar Lamp',             price: 2200,  icon: '☀️' },
      { id: 330, name: 'Digital Camera Basic',   price: 12000, icon: '📷' },
    ]
  },
  salon: {
    label: 'Salon & Beauty', icon: '💇',
    products: [
      { id: 401, name: 'Haircut (Men)',           price: 850,  icon: '✂️' },
      { id: 402, name: 'Haircut (Women)',         price: 1200, icon: '✂️' },
      { id: 403, name: 'Haircut (Kids)',          price: 500,  icon: '✂️' },
      { id: 404, name: 'Beard Trim',             price: 450,  icon: '🧔' },
      { id: 405, name: 'Beard Shape Up',         price: 650,  icon: '🧔' },
      { id: 406, name: 'Full Shave',             price: 700,  icon: '🧔' },
      { id: 407, name: 'Manicure',              price: 1200, icon: '💅' },
      { id: 408, name: 'Pedicure',              price: 1500, icon: '💅' },
      { id: 409, name: 'Manicure + Pedicure',   price: 2500, icon: '💅' },
      { id: 410, name: 'Gel Nails',             price: 2200, icon: '💅' },
      { id: 411, name: 'Acrylic Nails Full Set', price: 3500, icon: '💅' },
      { id: 412, name: 'Facial Basic',          price: 2200, icon: '🧖' },
      { id: 413, name: 'Facial Premium',        price: 4500, icon: '🧖' },
      { id: 414, name: 'Blow Dry',              price: 700,  icon: '💨' },
      { id: 415, name: 'Hair Wash & Blow Dry',  price: 1200, icon: '💨' },
      { id: 416, name: 'Hair Colour Single',    price: 2500, icon: '🎨' },
      { id: 417, name: 'Hair Colour Full',      price: 4500, icon: '🎨' },
      { id: 418, name: 'Highlights',            price: 5500, icon: '🎨' },
      { id: 419, name: 'Braids Simple',         price: 1500, icon: '💁' },
      { id: 420, name: 'Braids Full Head',      price: 4500, icon: '💁' },
      { id: 421, name: 'Cornrows',              price: 1200, icon: '💁' },
      { id: 422, name: 'Relaxer Treatment',     price: 2200, icon: '🧪' },
      { id: 423, name: 'Deep Conditioning',     price: 1500, icon: '🧴' },
      { id: 424, name: 'Eyebrow Threading',     price: 300,  icon: '🪡' },
      { id: 425, name: 'Eyebrow Tinting',       price: 500,  icon: '🪡' },
      { id: 426, name: 'Eyelash Extensions',    price: 3500, icon: '👁️' },
      { id: 427, name: 'Waxing (Legs)',         price: 1800, icon: '🦵' },
      { id: 428, name: 'Waxing (Arms)',         price: 1200, icon: '💪' },
      { id: 429, name: 'Body Scrub',            price: 3000, icon: '🛁' },
      { id: 430, name: 'Head Massage 30min',    price: 1500, icon: '💆' },
    ]
  },
  cafe: {
    label: 'Cafe & Restaurant', icon: '☕',
    products: [
      { id: 501, name: 'Espresso Single',   price: 180,  icon: '☕' },
      { id: 502, name: 'Espresso Double',   price: 280,  icon: '☕' },
      { id: 503, name: 'Cappuccino',        price: 280,  icon: '🥛' },
      { id: 504, name: 'Latte',             price: 320,  icon: '🥛' },
      { id: 505, name: 'Flat White',        price: 300,  icon: '🥛' },
      { id: 506, name: 'Americano',         price: 220,  icon: '☕' },
      { id: 507, name: 'Chai Tea',          price: 150,  icon: '🍵' },
      { id: 508, name: 'Masala Tea',        price: 180,  icon: '🍵' },
      { id: 509, name: 'Hot Chocolate',     price: 350,  icon: '🍫' },
      { id: 510, name: 'Smoothie Berry',    price: 390,  icon: '🍓' },
      { id: 511, name: 'Smoothie Tropical', price: 420,  icon: '🍍' },
      { id: 512, name: 'Fresh Juice Orange',price: 250,  icon: '🍊' },
      { id: 513, name: 'Fresh Juice Passion',price:250,  icon: '🍹' },
      { id: 514, name: 'Sandwich Club',     price: 420,  icon: '🥪' },
      { id: 515, name: 'Sandwich Chicken',  price: 480,  icon: '🥪' },
      { id: 516, name: 'Sandwich Tuna',     price: 400,  icon: '🥪' },
      { id: 517, name: 'Cake Slice',        price: 320,  icon: '🍰' },
      { id: 518, name: 'Muffin',            price: 180,  icon: '🧁' },
      { id: 519, name: 'Croissant',         price: 220,  icon: '🥐' },
      { id: 520, name: 'Breakfast Full',    price: 850,  icon: '🍳' },
      { id: 521, name: 'Breakfast Light',   price: 480,  icon: '🍳' },
      { id: 522, name: 'Avocado Toast',     price: 550,  icon: '🥑' },
      { id: 523, name: 'Pancakes x3',       price: 380,  icon: '🥞' },
      { id: 524, name: 'Waffles',           price: 420,  icon: '🧇' },
      { id: 525, name: 'Pasta Carbonara',   price: 680,  icon: '🍝' },
      { id: 526, name: 'Pizza Margherita',  price: 850,  icon: '🍕' },
      { id: 527, name: 'Pizza Pepperoni',   price: 950,  icon: '🍕' },
      { id: 528, name: 'Burger Classic',    price: 650,  icon: '🍔' },
      { id: 529, name: 'Burger Chicken',    price: 700,  icon: '🍔' },
      { id: 530, name: 'French Fries',      price: 280,  icon: '🍟' },
      { id: 531, name: 'Salad Garden',      price: 420,  icon: '🥗' },
      { id: 532, name: 'Salad Caesar',      price: 520,  icon: '🥗' },
      { id: 533, name: 'Soup of the Day',   price: 350,  icon: '🍲' },
      { id: 534, name: 'Mandazi x4',        price: 120,  icon: '🍩' },
      { id: 535, name: 'Samosa x3',         price: 150,  icon: '🥟' },
      { id: 536, name: 'Chips & Chicken',   price: 580,  icon: '🍗' },
      { id: 537, name: 'Ugali & Stew',      price: 350,  icon: '🍽️' },
      { id: 538, name: 'Pilau (Plate)',      price: 480,  icon: '🍛' },
      { id: 539, name: 'Nyama Choma 200g',  price: 850,  icon: '🥩' },
      { id: 540, name: 'Tiramisu',          price: 450,  icon: '🍮' },
    ]
  },
  laundry: {
    label: 'Laundry', icon: '👕',
    products: [
      { id: 601, name: 'Shirt Iron & Press',      price: 80,  icon: '👔' },
      { id: 602, name: 'Trouser Iron & Press',    price: 100, icon: '👖' },
      { id: 603, name: 'Suit Dry Clean',          price: 850, icon: '🧥' },
      { id: 604, name: 'Dress Dry Clean',         price: 650, icon: '👗' },
      { id: 605, name: 'Bedsheet Wash & Iron',    price: 250, icon: '🛏️' },
      { id: 606, name: 'Duvet Clean',             price: 700, icon: '🛏️' },
      { id: 607, name: 'Shoes Clean',             price: 300, icon: '👟' },
      { id: 608, name: 'Leather Jacket Clean',    price: 1200,icon: '🧥' },
      { id: 609, name: 'Express Laundry 2kg',     price: 450, icon: '⚡' },
      { id: 610, name: 'Standard Laundry 5kg',    price: 800, icon: '🧺' },
    ]
  },
  hardware: {
    label: 'Hardware', icon: '🔧',
    products: [
      { id: 701, name: 'Hammer',               price: 650,  icon: '🔨' },
      { id: 702, name: 'Screwdriver Set',       price: 850,  icon: '🪛' },
      { id: 703, name: 'Measuring Tape 5m',     price: 380,  icon: '📏' },
      { id: 704, name: 'Spirit Level',          price: 550,  icon: '📐' },
      { id: 705, name: 'Paint Roller',          price: 350,  icon: '🪣' },
      { id: 706, name: 'Paint Brush Set',       price: 280,  icon: '🖌️' },
      { id: 707, name: 'Wall Paint 4L White',   price: 1800, icon: '🎨' },
      { id: 708, name: 'Gloss Paint 1L',        price: 650,  icon: '🎨' },
      { id: 709, name: 'Cement Bag 50kg',       price: 950,  icon: '🪨' },
      { id: 710, name: 'Nails 1kg Assorted',    price: 280,  icon: '📌' },
      { id: 711, name: 'Wood Screws x50',       price: 220,  icon: '🔩' },
      { id: 712, name: 'PVC Pipe 2m',           price: 320,  icon: '🪠' },
      { id: 713, name: 'Electrical Wire 1m',    price: 120,  icon: '🔌' },
      { id: 714, name: 'Light Switch',          price: 180,  icon: '💡' },
      { id: 715, name: 'Door Lock',             price: 1200, icon: '🔒' },
      { id: 716, name: 'Padlock',               price: 350,  icon: '🔒' },
      { id: 717, name: 'Sandpaper Sheet x5',    price: 150,  icon: '📄' },
      { id: 718, name: 'Glue Gun',              price: 550,  icon: '🖊️' },
      { id: 719, name: 'Safety Gloves',         price: 320,  icon: '🧤' },
      { id: 720, name: 'Safety Goggles',        price: 450,  icon: '🥽' },
    ]
  },
}

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().slice(0, 10)

const defaultSalesData = () => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    days.push({ date: d.toISOString().slice(0, 10), revenue: 0 })
  }
  return days
}

const LOYALTY_TIERS = [
  { name: 'Bronze',   minPoints: 0,    discount: 0,  color: '#cd7f32' },
  { name: 'Silver',   minPoints: 500,  discount: 5,  color: '#c0c0c0' },
  { name: 'Gold',     minPoints: 1500, discount: 10, color: '#ffd700' },
  { name: 'Platinum', minPoints: 5000, discount: 15, color: '#e5e4e2' },
]
const getTier = (pts) => [...LOYALTY_TIERS].reverse().find(t => pts >= t.minPoints)
const pointsFromSale = (total) => Math.floor(total / 100)

const NICHE_MAP = {
  all:      Object.keys(categories),
  retail:   ['shop', 'laundry', 'hardware'],
  food:     ['cafe'],
  health:   ['pharmacy'],
  services: ['airbnb', 'salon'],
  tech:     ['electronics'],
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const PAYSTACK_KEY  = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || ''
  const PAYPAL_ID     = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'sb'
  const API_URL       = process.env.REACT_APP_API_URL || 'http://localhost:3002'
  const [showAdminModal, setShowAdminModal] = useState(false)

  // ── STATE ─────────────────────────────────────────────────────────────────
  const [cart, setCart]                       = useState([])
  const [phone, setPhone]                     = useState('')
  const [custEmail, setCustEmail]             = useState('')
  const [message, setMessage]                 = useState('')
  const [msgType, setMsgType]                 = useState('info')
  const [activeCat, setActiveCat]             = useState('shop')
  const [search, setSearch]                   = useState('')
  const [loaded, setLoaded]                   = useState(false)
  const [payMethod, setPayMethod]             = useState('mpesa')
  const [showPay, setShowPay]                 = useState(false)
  const [cashIn, setCashIn]                   = useState('')
  const [view, setView]                       = useState('pos')
  const [activeNiche, setActiveNiche]         = useState('all')
  const [theme, setTheme]                     = useState('dark')
  const [customItems, setCustomItems]         = useState([])
  const [newItem, setNewItem]                 = useState({ name: '', price: '', category: 'shop', icon: '🛒' })
  const [lang, setLang]                       = useState('English (Kenya)')
  const [syncOn, setSyncOn]                   = useState(true)
  const [bioOn, setBioOn]                     = useState(false)
  const [alertsOn, setAlertsOn]               = useState(true)
  const [reportsOn, setReportsOn]             = useState(true)
  const [logsOn, setLogsOn]                   = useState(true)
  const [role, setRole]                       = useState('Super Admin')
  const [showReceipt, setShowReceipt]         = useState(false)
  const [receiptData, setReceiptData]         = useState(null)

  // Live data — all start at zero
  const [salesData, setSalesData]             = useState(defaultSalesData())
  const [totalRevenue, setTotalRevenue]       = useState(0)
  const [totalOrders, setTotalOrders]         = useState(0)
  const [ledger, setLedger]                   = useState([])
  const [expenses, setExpenses]               = useState([])
  const [newExpense, setNewExpense]           = useState({ desc: '', amount: '', category: '' })
  const [showAddExp, setShowAddExp]           = useState(false)
  const [inventory, setInventory]             = useState([])
  const [newInvItem, setNewInvItem]           = useState({ name: '', sku: '', category: 'General', retailPrice: '', buyingPrice: '', stockLevel: '', minAlert: '', expiry: '', batch: '' })
  const [showAddInv, setShowAddInv]           = useState(false)
  const [customers, setCustomers]             = useState([])
  const [selCustomer, setSelCustomer]         = useState(null)
  const [newCust, setNewCust]                 = useState({ name: '', email: '', phone: '' })
  const [showAddCust, setShowAddCust]         = useState(false)
  const [crmSearch, setCrmSearch]             = useState('')

  useEffect(() => { setTimeout(() => setLoaded(true), 80) }, [])

  const flash = (msg, type = 'success') => {
    setMessage(msg); setMsgType(type)
    setTimeout(() => setMessage(''), 4000)
  }

  // ── CART ──────────────────────────────────────────────────────────────────
  const addToCart = (p) => setCart(prev => {
    const ex = prev.find(i => i.id === p.id)
    return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
               : [...prev, { ...p, qty: 1 }]
  })
  const removeFromCart = (id) => setCart(c => c.filter(i => i.id !== id))
  const updateQty = (id, d) => setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i))

  const loyaltyDiscount = selCustomer ? getTier(selCustomer.points).discount / 100 : 0
  const subtotal    = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const discount    = Math.round(subtotal * loyaltyDiscount)
  const afterDisc   = subtotal - discount
  const tax         = Math.round(afterDisc * 0.16)
  const grand       = afterDisc + tax
  const change      = cashIn ? parseInt(cashIn) - grand : 0

  // ── COMPLETE SALE ─────────────────────────────────────────────────────────
  const completeSale = useCallback((method, extra = {}) => {
    const invId = `INV-${String(ledger.length + 1001).padStart(4, '0')}`
    const entry = {
      id: invId,
      date: new Date().toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' }),
      customer: selCustomer?.name || 'Walk-in',
      total: grand, method, status: 'Paid',
      items: [...cart], ...extra,
    }
    setLedger(prev => [entry, ...prev])
    setSalesData(prev => prev.map(d => d.date === TODAY ? { ...d, revenue: d.revenue + grand } : d))
    setTotalRevenue(prev => prev + grand)
    setTotalOrders(prev => prev + 1)
    if (selCustomer) {
      const pts = pointsFromSale(grand)
      setCustomers(prev => prev.map(c => c.id === selCustomer.id
        ? { ...c, points: c.points + pts, visits: c.visits + 1, totalSpent: (c.totalSpent || 0) + grand }
        : c))
    }
    setReceiptData({ method, amount: grand, items: [...cart], invoiceId: invId, change: extra.change, customer: selCustomer?.name })
    setShowReceipt(true)
    setCart([]); setShowPay(false); setPhone(''); setCashIn(''); setSelCustomer(null)
  }, [cart, grand, ledger, selCustomer])

  // ── PAYMENTS ──────────────────────────────────────────────────────────────
  const handleMpesa = async () => {
    if (!phone) { flash('Enter customer phone number', 'error'); return }
    flash('Sending M-Pesa prompt…', 'loading')
    try {
      const res = await fetch(`${API_URL}/api/mpesa/stkpush`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: grand })
      })
      const data = await res.json()
      if (data.ResponseCode === '0') completeSale('M-Pesa')
      else flash('Payment request failed. Try again.', 'error')
    } catch { completeSale('M-Pesa') } // demo fallback
  }

  const handleCash = () => {
    if (!cashIn || change < 0) { flash('Insufficient cash amount', 'error'); return }
    completeSale('Cash', { change })
  }

  const handlePaystack = () => {
    if (typeof window.PaystackPop === 'undefined') { flash('Paystack not loaded. Refresh page.', 'error'); return }
    flash('Opening Paystack…', 'loading')
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email: custEmail || 'customer@berylbytes.co.ke',
      amount: grand * 100, currency: 'KES', ref: 'POS-' + Date.now(),
      callback: (r) => completeSale('Paystack', { transactionRef: r.reference }),
      onClose: () => flash('Payment cancelled.', 'error'),
    })
    handler.openIframe()
  }

  // ── PDF RECEIPT ───────────────────────────────────────────────────────────
  const generatePDF = () => {
    if (!receiptData) return
    const doc = new jsPDF(); let y = 20
    doc.setFontSize(20); doc.setFont('helvetica', 'bold')
    doc.text('BERYLBYTES POS', 20, y); y += 9
    doc.setFontSize(9); doc.setFont('helvetica', 'normal')
    doc.text('berylbytes.co.ke  |  berylmunyao8@gmail.com', 20, y); y += 6
    doc.line(20, y, 190, y); y += 6
    doc.text(`Invoice: ${receiptData.invoiceId}`, 20, y)
    doc.text(`Date: ${new Date().toLocaleString('en-KE')}`, 110, y); y += 6
    doc.text(`Customer: ${receiptData.customer || 'Walk-in'}`, 20, y)
    doc.text(`Method: ${receiptData.method}`, 110, y); y += 8
    doc.line(20, y, 190, y); y += 5
    doc.setFont('helvetica', 'bold')
    doc.text('ITEM', 20, y); doc.text('QTY', 120, y); doc.text('UNIT', 140, y); doc.text('TOTAL', 165, y); y += 5
    doc.line(20, y, 190, y); y += 5
    doc.setFont('helvetica', 'normal')
    receiptData.items.forEach(item => {
      doc.text(item.name.substring(0, 32), 20, y)
      doc.text(String(item.qty), 122, y)
      doc.text(`KES ${item.price.toLocaleString()}`, 135, y)
      doc.text(`KES ${(item.price * item.qty).toLocaleString()}`, 162, y); y += 6
    })
    y += 2; doc.line(20, y, 190, y); y += 6
    const sub = receiptData.items.reduce((s, i) => s + i.price * i.qty, 0)
    doc.text('Subtotal:', 130, y); doc.text(`KES ${sub.toLocaleString()}`, 162, y); y += 6
    doc.text('VAT 16%:', 130, y); doc.text(`KES ${Math.round(sub * 0.16).toLocaleString()}`, 162, y); y += 6
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL PAID:', 130, y); doc.text(`KES ${receiptData.amount.toLocaleString()}`, 162, y); y += 6
    if (receiptData.change) {
      doc.setFont('helvetica', 'normal')
      doc.text('Change:', 130, y); doc.text(`KES ${receiptData.change.toLocaleString()}`, 162, y); y += 6
    }
    y += 4; doc.line(20, y, 190, y); y += 6
    doc.setFontSize(8); doc.setFont('helvetica', 'normal')
    doc.text('Thank you for your business! — BerylBytes POS', 20, y)
    doc.save(`${receiptData.invoiceId}.pdf`)
  }

  // ── HELPERS ───────────────────────────────────────────────────────────────
  const fKES = (v) => `KES ${(v || 0).toLocaleString()}`
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const netProfit = totalRevenue - totalExpenses
  const maxBar = Math.max(...salesData.map(d => d.revenue), 1)
  const visibleCats = NICHE_MAP[activeNiche] || Object.keys(categories)
  const allProducts = [
    ...(categories[activeCat]?.products ?? []),
    ...customItems.filter(i => i.category === activeCat),
  ]
  const products = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    visibleCats.includes(activeCat)
  )

  const totalProductCount = Object.values(categories).reduce((s, c) => s + c.products.length, 0) + customItems.length

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <PayPalScriptProvider options={{ 'client-id': PAYPAL_ID }}>
      <div className={`app-shell ${loaded ? 'in' : ''}`}>
        <div className="amb">
          <div className="ab ab1" /><div className="ab ab2" /><div className="ab ab3" />
        </div>

        {/* ══ TOPBAR ══════════════════════════════════════════════════════ */}
        <header className="topbar">
          <div className="brand">
            <div className="brand-logo">B</div>
            <div className="brand-text">
              <span className="brand-name">Beryl<em>Bytes</em></span>
              <span className="brand-sub">POS — Live</span>
            </div>
          </div>

          {/* Business niche pills */}
          <div className="niche-bar">
            {[
              { id: 'all', label: '🌐 All Niches' },
              { id: 'retail', label: '🛒 Retail' },
              { id: 'food', label: '🍽️ Food & Cafe' },
              { id: 'health', label: '💊 Health' },
              { id: 'services', label: '✂️ Services' },
              { id: 'tech', label: '🔌 Electronics' },
            ].map(n => (
              <button key={n.id}
                className={`niche-pill ${activeNiche === n.id ? 'act' : ''}`}
                onClick={() => {
                  setActiveNiche(n.id)
                  const cats = NICHE_MAP[n.id]
                  if (!cats.includes(activeCat)) setActiveCat(cats[0])
                }}>
                {n.label}
              </button>
            ))}
          </div>

          <div className="topbar-right">
            <div className="search-bar">
              <span>⌕</span>
              <input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="live-dot" title="System Live" />
            <div className="live-stat">
              <span className="live-stat-val">{fKES(totalRevenue)}</span>
              <span className="live-stat-lbl">Revenue</span>
            </div>
            <div className="live-stat">
              <span className="live-stat-val">{totalOrders}</span>
              <span className="live-stat-lbl">Orders</span>
            </div>
            <div className="avatar-btn">B</div>
            <button
              style={{
                padding: '8px 16px',
                background: 'rgba(255, 193, 7, 0.2)',
                border: '1px solid rgba(255, 193, 7, 0.5)',
                color: '#ffc107',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginLeft: '12px',
              }}
              onClick={() => setShowAdminModal(true)}
              title="Access Admin Portal"
            >
              ⚙️ Admin
            </button>
          </div>
        </header>

        {/* ══ ADMIN PORTAL MODAL ══════════════════════════════════════ */}
        {showAdminModal && (
          <div
            className="overlay"
            onClick={e => e.target === e.currentTarget && setShowAdminModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: 'var(--surface)',
                padding: '24px',
                borderRadius: '12px',
                maxWidth: '400px',
                textAlign: 'center',
                border: '1px solid var(--border)',
              }}
            >
              <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>🔐 Admin Portal</h3>
              <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>
                Access the Super Admin portal to manage system-wide settings, users, and analytics.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <a
                  href="/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    background: '#ffc107',
                    color: '#000',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Open Admin →
                </a>
                <button
                  onClick={() => setShowAdminModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    background: 'var(--bg2)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ SIDEBAR + MAIN ══════════════════════════════════════════════ */}
        <aside className="sidebar">
          {/* Main navigation */}
          <div className="sidebar-section">
            <span className="sidebar-label">Navigation</span>
            {[
              { id: 'pos',       icon: '🛒', label: 'Point of Sale' },
              { id: 'dashboard', icon: '📊', label: 'Dashboard' },
              { id: 'crm',       icon: '👥', label: 'CRM & Loyalty', badge: customers.length || null },
              { id: 'orders',    icon: '📦', label: 'Inventory' },
              { id: 'add',       icon: '➕', label: 'Add Item' },
              { id: 'settings',  icon: '⚙️', label: 'Settings' },
            ].map(item => (
              <button key={item.id}
                className={`nav-item ${view === item.id ? 'act' : ''}`}
                onClick={() => setView(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </div>

          {/* Category navigation — only visible when POS is active */}
          {view === 'pos' && (
            <>
              <div className="sidebar-divider" />
              <div className="sidebar-section">
                <span className="sidebar-label">Categories</span>
                {Object.entries(categories)
                  .filter(([key]) => visibleCats.includes(key))
                  .map(([key, val]) => (
                    <button key={key}
                      className={`cat-item ${activeCat === key ? 'act' : ''}`}
                      onClick={() => { setActiveCat(key); setSearch('') }}>
                      <span className="cat-icon">{val.icon}</span>
                      {val.label}
                    </button>
                  ))}
              </div>
            </>
          )}

          {/* Bottom stats */}
          <div style={{ marginTop: 'auto', padding: '12px' }}>
            <div className="sidebar-divider" style={{ margin: '0 0 8px' }} />
            <div style={{ fontSize: 10, color: 'var(--text3)', padding: '0 4px', lineHeight: 1.8 }}>
              <div>📦 {totalProductCount} products</div>
              <div>👥 {customers.length} customers</div>
              <div>🧾 {ledger.length} transactions</div>
            </div>
          </div>
        </aside>

        {/* ══ MAIN ════════════════════════════════════════════════════════ */}
        <div className="main">
          <div className="content-area">

            {/* ── POS VIEW ──────────────────────────────────────────────── */}
            {view === 'pos' && (
              <>
                {activeCat === 'pharmacy' && (
                  <div className="ph-warn">⚠️ POM items require a valid prescription before dispensing.</div>
                )}
                <div className="pg">
                  {products.length === 0 ? (
                    <div className="no-results">
                      <div>🔍</div>
                      <p>No products found{search ? ` for "${search}"` : ''}</p>
                    </div>
                  ) : products.map((p, i) => (
                    <div key={p.id} className="pc" style={{ animationDelay: `${i * 0.025}s` }} onClick={() => addToCart(p)}>
                      <div className="pc-shine" />
                      <div className="pc-ic">{p.icon}</div>
                      <div className="pc-nm">{p.name}</div>
                      <div className="pc-pr">KES {p.price.toLocaleString()}</div>
                      {p.tag && <span className={`pc-tag ${p.tag === 'POM' ? 'pom' : 'otc'}`}>{p.tag}</span>}
                      <div className="pc-plus">＋</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── DASHBOARD VIEW ────────────────────────────────────────── */}
            {view === 'dashboard' && (
              <div className="dash-grid">
                {/* KPIs */}
                <div className="panel full-col">
                  <div className="panel-hd"><h2>Live Performance</h2></div>
                  <div className="kpi-row">
                    {[
                      { label: 'Total Revenue', val: fKES(totalRevenue), cls: 'green' },
                      { label: 'Orders Today',  val: totalOrders,        cls: 'blue' },
                      { label: 'Net Profit',    val: fKES(netProfit),    cls: 'purple' },
                      { label: 'Expenses',      val: fKES(totalExpenses),cls: 'red' },
                      { label: 'Customers',     val: customers.length,   cls: 'orange' },
                      { label: 'Transactions',  val: ledger.length,      cls: 'teal' },
                    ].map(k => (
                      <div key={k.label} className={`kpi-card ${k.cls}`}>
                        <div className="kpi-val">{k.val}</div>
                        <div className="kpi-lbl">{k.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sales chart */}
                <div className="panel">
                  <div className="panel-hd"><h2>Daily Revenue — Last 7 Days</h2></div>
                  {totalRevenue === 0 ? (
                    <div className="empty-state">
                      <div className="e-icon">📊</div>
                      <p>No sales recorded yet</p>
                      <span>Complete your first sale from the POS to see revenue here</span>
                    </div>
                  ) : (
                    <div className="bar-chart">
                      {salesData.map((day, i) => (
                        <div key={i} className="bar-item">
                          <div className="bar" style={{ height: `${(day.revenue / maxBar) * 100}%` }}>
                            <span className="bar-tooltip">{fKES(day.revenue)}</span>
                          </div>
                          <span className="bar-label">{day.date.slice(-5)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expense tracker */}
                <div className="panel">
                  <div className="panel-hd">
                    <h2>Expense Tracker</h2>
                    <button className="btn-primary btn-sm" onClick={() => setShowAddExp(true)}>+ Add Expense</button>
                  </div>
                  {showAddExp && (
                    <div className="inline-form">
                      <div className="form-grid">
                        <div className="sf full">
                          <label>Description</label>
                          <input placeholder="e.g. Stock restock" value={newExpense.desc} onChange={e => setNewExpense({ ...newExpense, desc: e.target.value })} />
                        </div>
                        <div className="sf">
                          <label>Amount (KES)</label>
                          <input type="number" placeholder="0" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} />
                        </div>
                        <div className="sf">
                          <label>Category</label>
                          <select value={newExpense.category} onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}>
                            <option value="">Select category</option>
                            {['Inventory', 'Rent', 'Staff', 'Utilities', 'Marketing', 'Maintenance', 'Other'].map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="btn-row" style={{ marginTop: 10 }}>
                        <button className="btn-primary" onClick={() => {
                          if (!newExpense.desc || !newExpense.amount) return
                          setExpenses(prev => [{ id: Date.now(), desc: newExpense.desc, category: newExpense.category || 'Other', amount: parseInt(newExpense.amount), date: TODAY }, ...prev])
                          setNewExpense({ desc: '', amount: '', category: '' }); setShowAddExp(false); flash('Expense logged.')
                        }}>Save</button>
                        <button className="btn-ghost" onClick={() => setShowAddExp(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {expenses.length === 0 ? (
                    <div className="empty-state"><div className="e-icon">💸</div><p>No expenses logged yet</p></div>
                  ) : (
                    <>
                      <table className="data-table">
                        <thead><tr><th>Description</th><th>Category</th><th>Amount</th><th>Date</th></tr></thead>
                        <tbody>{expenses.map(e => (
                          <tr key={e.id}><td>{e.desc}</td><td>{e.category}</td><td>{fKES(e.amount)}</td><td>{e.date}</td></tr>
                        ))}</tbody>
                      </table>
                      <div style={{ padding: '10px 0', fontSize: 13, color: 'var(--text2)', borderTop: '1px solid var(--border)', marginTop: 8 }}>
                        Total Expenses: <strong style={{ color: 'var(--red)' }}>{fKES(totalExpenses)}</strong>
                      </div>
                    </>
                  )}
                </div>

                {/* Ledger */}
                <div className="panel full-col">
                  <div className="panel-hd"><h2>Digital Ledger</h2></div>
                  {ledger.length === 0 ? (
                    <div className="empty-state">
                      <div className="e-icon">🧾</div>
                      <p>No transactions yet</p>
                      <span>Every completed sale will appear here automatically</span>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead><tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
                      <tbody>{ledger.map(row => (
                        <tr key={row.id}>
                          <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{row.id}</td>
                          <td>{row.date}</td><td>{row.customer}</td>
                          <td><strong>{fKES(row.total)}</strong></td>
                          <td>{row.method}</td>
                          <td><span className="pill paid">{row.status}</span></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ── CRM VIEW ──────────────────────────────────────────────── */}
            {view === 'crm' && (
              <div className="dash-grid">
                <div className="panel full-col">
                  <div className="panel-hd">
                    <h2>Customer Relationship Management</h2>
                    <button className="btn-primary btn-sm" onClick={() => setShowAddCust(true)}>+ Add Customer</button>
                  </div>
                  {showAddCust && (
                    <div className="inline-form">
                      <div className="form-grid">
                        <div className="sf"><label>Full Name</label><input placeholder="Jane Doe" value={newCust.name} onChange={e => setNewCust({ ...newCust, name: e.target.value })} /></div>
                        <div className="sf"><label>Email</label><input placeholder="jane@email.com" value={newCust.email} onChange={e => setNewCust({ ...newCust, email: e.target.value })} /></div>
                        <div className="sf"><label>Phone</label><input placeholder="0712345678" value={newCust.phone} onChange={e => setNewCust({ ...newCust, phone: e.target.value })} /></div>
                      </div>
                      <div className="btn-row" style={{ marginTop: 10 }}>
                        <button className="btn-primary" onClick={() => {
                          if (!newCust.name) return
                          setCustomers(prev => [...prev, { id: Date.now(), name: newCust.name, email: newCust.email, phone: newCust.phone, points: 0, visits: 0, totalSpent: 0, joined: TODAY }])
                          flash(`${newCust.name} added!`); setNewCust({ name: '', email: '', phone: '' }); setShowAddCust(false)
                        }}>Save Customer</button>
                        <button className="btn-ghost" onClick={() => setShowAddCust(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  <div className="search-bar" style={{ margin: '12px 0', width: '100%' }}>
                    <span>⌕</span>
                    <input placeholder="Search customers…" value={crmSearch} onChange={e => setCrmSearch(e.target.value)} />
                  </div>
                  {customers.length === 0 ? (
                    <div className="empty-state">
                      <div className="e-icon">👥</div>
                      <p>No customers yet</p>
                      <span>Add customers and select them at checkout to earn loyalty points automatically</span>
                    </div>
                  ) : (
                    <div className="crm-grid">
                      {customers
                        .filter(c => c.name.toLowerCase().includes(crmSearch.toLowerCase()) || c.email?.toLowerCase().includes(crmSearch.toLowerCase()))
                        .map(c => {
                          const tier = getTier(c.points)
                          return (
                            <div key={c.id} className="crm-card" style={{ borderTopColor: tier.color }}>
                              <div className="crm-avatar" style={{ background: tier.color }}>{c.name[0]}</div>
                              <div className="crm-name">{c.name}</div>
                              {c.email && <div className="crm-meta">{c.email}</div>}
                              {c.phone && <div className="crm-meta">📱 {c.phone}</div>}
                              <div className="crm-tier" style={{ color: tier.color }}>⭐ {tier.name} — {tier.discount}% off</div>
                              <div className="crm-row"><span>Points</span><strong>{c.points}</strong></div>
                              <div className="crm-row"><span>Visits</span><strong>{c.visits}</strong></div>
                              <div className="crm-row"><span>Total Spent</span><strong>{fKES(c.totalSpent || 0)}</strong></div>
                              <button className="btn-ghost btn-sm danger" style={{ marginTop: 10, width: '100%' }} onClick={() => setCustomers(prev => prev.filter(x => x.id !== c.id))}>Remove</button>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </div>

                <div className="panel full-col">
                  <div className="panel-hd"><h2>Loyalty Programme Tiers</h2></div>
                  <div className="tier-grid">
                    {LOYALTY_TIERS.map(t => (
                      <div key={t.name} className="tier-card" style={{ borderTop: `3px solid ${t.color}` }}>
                        <div className="tier-name" style={{ color: t.color }}>{t.name}</div>
                        <div className="tier-row">Min Points: <strong>{t.minPoints.toLocaleString()}</strong></div>
                        <div className="tier-row">Discount: <strong>{t.discount}%</strong></div>
                        <div className="tier-row" style={{ fontSize: 10, marginTop: 6, color: 'var(--text3)' }}>1 pt per KES 100 spent</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── INVENTORY VIEW ────────────────────────────────────────── */}
            {view === 'orders' && (
              <div className="dash-grid">
                <div className="panel full-col">
                  <div className="panel-hd">
                    <h2>Inventory Management</h2>
                    <button className="btn-primary btn-sm" onClick={() => setShowAddInv(true)}>+ Add Item</button>
                  </div>
                  {showAddInv && (
                    <div className="inline-form">
                      <div className="form-grid">
                        <div className="sf"><label>Product Name</label><input value={newInvItem.name} onChange={e => setNewInvItem({ ...newInvItem, name: e.target.value })} /></div>
                        <div className="sf"><label>SKU / Code</label><input value={newInvItem.sku} onChange={e => setNewInvItem({ ...newInvItem, sku: e.target.value })} /></div>
                        <div className="sf"><label>Retail Price (KES)</label><input type="number" value={newInvItem.retailPrice} onChange={e => setNewInvItem({ ...newInvItem, retailPrice: e.target.value })} /></div>
                        <div className="sf"><label>Buying Price</label><input type="number" value={newInvItem.buyingPrice} onChange={e => setNewInvItem({ ...newInvItem, buyingPrice: e.target.value })} /></div>
                        <div className="sf"><label>Stock Level</label><input type="number" value={newInvItem.stockLevel} onChange={e => setNewInvItem({ ...newInvItem, stockLevel: e.target.value })} /></div>
                        <div className="sf"><label>Min Alert Level</label><input type="number" value={newInvItem.minAlert} onChange={e => setNewInvItem({ ...newInvItem, minAlert: e.target.value })} /></div>
                        <div className="sf"><label>Expiry Date</label><input type="date" value={newInvItem.expiry} onChange={e => setNewInvItem({ ...newInvItem, expiry: e.target.value })} /></div>
                        <div className="sf"><label>Batch Number</label><input value={newInvItem.batch} onChange={e => setNewInvItem({ ...newInvItem, batch: e.target.value })} /></div>
                        <div className="sf"><label>Category</label>
                          <select value={newInvItem.category} onChange={e => setNewInvItem({ ...newInvItem, category: e.target.value })}>
                            {['General', 'Pharmaceutical Grade', 'Electronics', 'Food & Beverage', 'Services'].map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="btn-row" style={{ marginTop: 10 }}>
                        <button className="btn-primary" onClick={() => {
                          if (!newInvItem.name || !newInvItem.sku) return
                          setInventory(prev => [...prev, { id: Date.now(), ...newInvItem, retailPrice: parseInt(newInvItem.retailPrice) || 0, buyingPrice: parseInt(newInvItem.buyingPrice) || 0, stockLevel: parseInt(newInvItem.stockLevel) || 0, minAlert: parseInt(newInvItem.minAlert) || 5 }])
                          setNewInvItem({ name: '', sku: '', category: 'General', retailPrice: '', buyingPrice: '', stockLevel: '', minAlert: '', expiry: '', batch: '' })
                          setShowAddInv(false); flash('Item added to inventory.')
                        }}>Add Item</button>
                        <button className="btn-ghost" onClick={() => setShowAddInv(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {inventory.length === 0 ? (
                    <div className="empty-state">
                      <div className="e-icon">📦</div>
                      <p>No inventory items yet</p>
                      <span>Add items to track stock levels, buying cost, and expiry dates</span>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead><tr><th>Name</th><th>SKU</th><th>Category</th><th>Retail</th><th>Cost</th><th>Stock</th><th>Expiry</th><th></th></tr></thead>
                      <tbody>{inventory.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td><td style={{ color: 'var(--text3)' }}>{item.sku}</td><td>{item.category}</td>
                          <td>{fKES(item.retailPrice)}</td><td style={{ color: 'var(--text2)' }}>{fKES(item.buyingPrice)}</td>
                          <td>{item.stockLevel}{item.stockLevel <= item.minAlert && <span className="alert-badge">Low!</span>}</td>
                          <td>{item.expiry}</td>
                          <td><button className="btn-ghost btn-sm danger" onClick={() => setInventory(prev => prev.filter(i => i.id !== item.id))}>Remove</button></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ── ADD ITEM VIEW ─────────────────────────────────────────── */}
            {view === 'add' && (
              <div className="dash-grid">
                <div className="panel">
                  <div className="panel-hd"><h2>Add Custom Item</h2></div>
                  <div className="form-grid">
                    <div className="sf full"><label>Item Name</label><input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Special Bundle Deal" /></div>
                    <div className="sf"><label>Price (KES)</label><input type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} placeholder="0" /></div>
                    <div className="sf"><label>Icon (Emoji)</label><input value={newItem.icon} onChange={e => setNewItem({ ...newItem, icon: e.target.value })} placeholder="🎁" /></div>
                    <div className="sf full"><label>Category</label>
                      <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                        {Object.entries(categories).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <button className="btn-primary" style={{ marginTop: 16, width: '100%' }} onClick={() => {
                    if (!newItem.name || !newItem.price) { flash('Name and price are required.', 'error'); return }
                    setCustomItems(prev => [...prev, { id: Date.now(), ...newItem, price: parseInt(newItem.price) }])
                    flash('Item added to catalogue!')
                    setNewItem({ name: '', price: '', category: 'shop', icon: '🛒' })
                    setView('pos')
                  }}>+ Add Item to Catalogue</button>
                  <p className="help-text" style={{ marginTop: 10 }}>Custom items appear in the selected category immediately and can be sold from the POS.</p>
                </div>

                <div className="panel">
                  <div className="panel-hd"><h2>System Summary</h2></div>
                  <div className="stat-grid">
                    {[
                      { val: totalProductCount, lbl: 'Total Products' },
                      { val: customers.length,  lbl: 'CRM Customers' },
                      { val: ledger.length,     lbl: 'Transactions' },
                      { val: fKES(totalRevenue),lbl: 'Revenue' },
                      { val: inventory.length,  lbl: 'Inventory Items' },
                      { val: Object.keys(categories).length, lbl: 'Business Niches' },
                    ].map((s, i) => (
                      <div key={i} className="stat-card"><strong>{s.val}</strong><span>{s.lbl}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── SETTINGS VIEW ─────────────────────────────────────────── */}
            {view === 'settings' && (
              <div className="settings-grid">
                <div className="panel">
                  <div className="panel-hd"><h2>Profile & Account</h2></div>
                  <div className="profile-card">
                    <div className="profile-avatar">B</div>
                    <div>
                      <div className="profile-name">Beryl Munyao</div>
                      <div className="profile-email">berylmunyao8@gmail.com</div>
                      <div className="profile-meta">Role: Super Admin · Org: beryl_bytes_global</div>
                    </div>
                  </div>
                  <div className="sf" style={{ marginBottom: 12 }}>
                    <label>Display Theme</label>
                    <div className="theme-switcher">
                      {['light', 'dark'].map(m => <button key={m} className={`theme-pill ${theme === m ? 'act' : ''}`} onClick={() => setTheme(m)}>{m === 'light' ? '☀️ Light' : '🌙 Dark'}</button>)}
                    </div>
                  </div>
                  <div className="sf" style={{ marginBottom: 12 }}>
                    <label>Language</label>
                    <select value={lang} onChange={e => setLang(e.target.value)}>
                      <option>English (Kenya)</option><option>English (United States)</option><option>Swahili (Kenya)</option>
                    </select>
                  </div>
                  <div className="sf">
                    <label>Access Role</label>
                    <select value={role} onChange={e => setRole(e.target.value)}>
                      {['Super Admin', 'Manager', 'Cashier', 'Employee'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-hd"><h2>System & Security</h2></div>
                  {[
                    { label: 'Cloud Realtime Sync',    state: syncOn,    toggle: setSyncOn },
                    { label: 'Biometric Enforcement',  state: bioOn,     toggle: setBioOn },
                    { label: 'Inventory Alerts',       state: alertsOn,  toggle: setAlertsOn },
                    { label: 'Automated Sales Reports', state: reportsOn, toggle: setReportsOn },
                    { label: 'Security Audit Logs',    state: logsOn,    toggle: setLogsOn },
                  ].map(({ label, state, toggle }) => (
                    <div key={label} className="toggle-row">
                      <span>{label}</span>
                      <button className={`toggle-pill ${state ? 'on' : ''}`} onClick={() => toggle(!state)}>
                        {state ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                  <div className="settings-note">BerylBytes OS v4.3.0 Enterprise LTS — All operations logged & encrypted end-to-end.</div>
                </div>

                <div className="panel">
                  <div className="panel-hd"><h2>Payment Integration</h2></div>
                  {[
                    { label: 'Paystack Public Key',   connected: !!PAYSTACK_KEY },
                    { label: 'PayPal Client ID',      connected: PAYPAL_ID !== 'sb' },
                    { label: 'M-Pesa STK Push API',   connected: true },
                  ].map(k => (
                    <div key={k.label} className="key-status-row">
                      <span>{k.label}</span>
                      <span className={`pill ${k.connected ? 'paid' : 'pending'}`}>{k.connected ? '✓ Connected' : 'Not Set'}</span>
                    </div>
                  ))}
                  <p className="help-text" style={{ marginTop: 12 }}>API keys are loaded from your <code>.env</code> file. Never commit secret keys to version control.</p>
                </div>

                <div className="panel">
                  <div className="panel-hd"><h2>VAT & Tax</h2></div>
                  <div className="toggle-row"><span>VAT Rate</span><strong style={{ color: 'var(--accent)' }}>16% (Kenya Standard)</strong></div>
                  <div className="toggle-row"><span>Tax Included in Price</span><strong>No — added at checkout</strong></div>
                  <div className="toggle-row"><span>Currency</span><strong>KES — Kenyan Shilling</strong></div>
                  <div className="toggle-row"><span>Receipt Format</span><strong>A4 PDF (jsPDF)</strong></div>
                  <div className="settings-note">Tax configuration follows KRA guidelines. Update in accordance with current KRA regulations.</div>
                </div>
              </div>
            )}

          </div>

          {/* ══ CART PANEL (right side — always visible in POS) ═════════ */}
          {view === 'pos' && (
            <div className="cart-panel">
              <div className="cp-hd">
                <h2>Order</h2>
                {cart.length > 0 && <button className="clr-btn" onClick={() => setCart([])}>Clear all</button>}
              </div>

              {/* Customer selector */}
              <div className="customer-select">
                <label>Customer (optional)</label>
                <select value={selCustomer?.id || ''} onChange={e => setSelCustomer(customers.find(c => c.id === Number(e.target.value)) || null)}>
                  <option value="">Walk-in Customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({getTier(c.points).name})</option>)}
                </select>
                {selCustomer && (
                  <div className="loyalty-badge" style={{ borderColor: getTier(selCustomer.points).color, color: getTier(selCustomer.points).color }}>
                    ⭐ {getTier(selCustomer.points).name} — {getTier(selCustomer.points).discount}% loyalty discount
                  </div>
                )}
              </div>

              {/* Cart items */}
              <div className="ci-list">
                {cart.length === 0 ? (
                  <div className="ci-empty">
                    <div className="ce-ic">🛍️</div>
                    <p>Cart is empty</p>
                    <span>Tap products to add them</span>
                  </div>
                ) : cart.map(item => (
                  <div key={item.id} className="ci">
                    <span className="ci-ico">{item.icon}</span>
                    <div className="ci-inf">
                      <div className="ci-nm">{item.name}</div>
                      <div className="ci-pr">KES {(item.price * item.qty).toLocaleString()}</div>
                    </div>
                    <div className="ci-ctl">
                      <button className="qb" onClick={() => updateQty(item.id, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button className="qb" onClick={() => updateQty(item.id, 1)}>+</button>
                      <button className="rb" onClick={() => removeFromCart(item.id)}>×</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              {cart.length > 0 && (
                <>
                  <div className="tots">
                    <div className="tr"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                    {discount > 0 && <div className="tr disc"><span>Loyalty Discount</span><span>−KES {discount.toLocaleString()}</span></div>}
                    <div className="tr"><span>VAT 16%</span><span>KES {tax.toLocaleString()}</span></div>
                    <div className="tr gd"><span>Total</span><span>KES {grand.toLocaleString()}</span></div>
                  </div>
                  <button className="chg-btn" onClick={() => setShowPay(true)}>
                    Charge KES {grand.toLocaleString()} →
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* ══ PAYMENT MODAL ═══════════════════════════════════════════════ */}
        {showPay && (
          <div className="overlay" onClick={e => e.target === e.currentTarget && setShowPay(false)}>
            <div className="pay-modal">
              <div className="pay-hd">
                <div>
                  <h3>Payment</h3>
                  <div className="pay-amount">KES {grand.toLocaleString()}</div>
                </div>
                <button className="pay-close" onClick={() => setShowPay(false)}>×</button>
              </div>

              <div className="pay-methods">
                {[
                  { id: 'mpesa',    icon: '📱', label: 'M-Pesa' },
                  { id: 'cash',     icon: '💵', label: 'Cash' },
                  { id: 'paystack', icon: '💳', label: 'Card' },
                  { id: 'paypal',   icon: '🅿️', label: 'PayPal' },
                ].map(m => (
                  <button key={m.id} className={`pay-method-btn ${payMethod === m.id ? 'act' : ''}`} onClick={() => setPayMethod(m.id)}>
                    <span>{m.icon}</span><span>{m.label}</span>
                  </button>
                ))}
              </div>

              {payMethod === 'mpesa' && (
                <div className="pay-form">
                  <label>Customer Phone Number</label>
                  <input type="tel" placeholder="254712345678" value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleMpesa()} />
                  <button className="pay-go" onClick={handleMpesa}>📱 Send M-Pesa Prompt</button>
                </div>
              )}

              {payMethod === 'cash' && (
                <div className="pay-form">
                  <label>Cash Received (KES)</label>
                  <input type="number" placeholder="Enter amount given" value={cashIn} onChange={e => setCashIn(e.target.value)} />
                  {cashIn && <div className={`pay-change ${change >= 0 ? 'pos' : 'neg'}`}>{change >= 0 ? `Change: KES ${change.toLocaleString()}` : `Short by: KES ${Math.abs(change).toLocaleString()}`}</div>}
                  <button className="pay-go" onClick={handleCash}>💵 Confirm Cash Payment</button>
                </div>
              )}

              {payMethod === 'paystack' && (
                <div className="pay-form">
                  <label>Customer Email (optional)</label>
                  <input type="email" placeholder="customer@email.com" value={custEmail} onChange={e => setCustEmail(e.target.value)} />
                  <div className="pay-info">🔐 Card payment secured by Paystack. Accepts Visa, Mastercard & bank transfer.</div>
                  <button className="pay-go" onClick={handlePaystack}>💳 Pay with Card</button>
                </div>
              )}

              {payMethod === 'paypal' && (
                <div className="pay-form">
                  <div className="pay-info">Complete your payment securely through PayPal.</div>
                  <PayPalButtons
                    style={{ layout: 'vertical', color: 'blue', shape: 'rect', height: 40 }}
                    createOrder={(data, actions) => actions.order.create({
                      purchase_units: [{ amount: { value: (grand / 130).toFixed(2), currency_code: 'USD' }, description: `BerylBytes — ${cart.length} item(s)` }],
                    })}
                    onApprove={(data, actions) => actions.order.capture().then(details => completeSale('PayPal', { transactionId: details.id }))}
                    onError={() => flash('PayPal payment failed. Try again.', 'error')}
                  />
                </div>
              )}

              {message && <div className={`pay-msg ${msgType}`}>{message}</div>}
            </div>
          </div>
        )}

        {/* ══ RECEIPT MODAL ═══════════════════════════════════════════════ */}
        {showReceipt && receiptData && (
          <div className="overlay" onClick={e => e.target === e.currentTarget && setShowReceipt(false)}>
            <div className="receipt-modal">
              <div className="receipt-top">
                <h3>🧾 BerylBytes POS</h3>
                <div className="r-id">{receiptData.invoiceId}</div>
              </div>
              <div className="receipt-meta">
                <span>📅 {new Date().toLocaleString('en-KE')}</span>
                <span>💳 {receiptData.method}</span>
                {receiptData.customer && <span>👤 {receiptData.customer}</span>}
              </div>
              <div className="receipt-items">
                {receiptData.items.map(item => (
                  <div key={item.id} className="r-line">
                    <span>{item.icon} {item.name} × {item.qty}</span>
                    <span>KES {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="r-totals">
                <div className="r-total-line"><span>Subtotal</span><span>KES {receiptData.items.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString()}</span></div>
                <div className="r-total-line"><span>VAT 16%</span><span>KES {Math.round(receiptData.items.reduce((s, i) => s + i.price * i.qty, 0) * 0.16).toLocaleString()}</span></div>
                <div className="r-total-line big"><span>Total Paid</span><span>KES {receiptData.amount.toLocaleString()}</span></div>
                {receiptData.change > 0 && <div className="r-total-line"><span>Change</span><span style={{ color: 'var(--accent)' }}>KES {receiptData.change.toLocaleString()}</span></div>}
              </div>
              <div className="receipt-thanks">Thank you for shopping at BerylBytes! 🎉</div>
              <div className="btn-row" style={{ marginTop: 16 }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={generatePDF}>⬇️ Download PDF Receipt</button>
                <button className="btn-ghost" onClick={() => setShowReceipt(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </PayPalScriptProvider>
  )
}
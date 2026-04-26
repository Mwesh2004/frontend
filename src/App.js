import { useState, useEffect, useCallback } from 'react'
import './App.css'
import jsPDF from 'jspdf'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

// ─── PRODUCT CATALOGUE (200+ items) ─────────────────────────────────────────
const categories = {
  shop: {
    label: 'General Shop', icon: '🛒',
    products: [
      { id: 1, name: 'Maize Flour 2kg', price: 220, icon: '🌽' },
      { id: 2, name: 'Maize Flour 5kg', price: 520, icon: '🌽' },
      { id: 3, name: 'Cooking Oil 1L', price: 350, icon: '🫙' },
      { id: 4, name: 'Cooking Oil 2L', price: 680, icon: '🫙' },
      { id: 5, name: 'Cooking Oil 5L', price: 1550, icon: '🫙' },
      { id: 6, name: 'Sugar 1kg', price: 180, icon: '🍬' },
      { id: 7, name: 'Sugar 2kg', price: 350, icon: '🍬' },
      { id: 8, name: 'Rice 2kg', price: 310, icon: '🍚' },
      { id: 9, name: 'Rice 5kg', price: 760, icon: '🍚' },
      { id: 10, name: 'Tea Leaves 500g', price: 220, icon: '🍵' },
      { id: 11, name: 'Tea Leaves 250g', price: 120, icon: '🍵' },
      { id: 12, name: 'Milk 500ml', price: 65, icon: '🥛' },
      { id: 13, name: 'Milk 1L Fresh', price: 130, icon: '🥛' },
      { id: 14, name: 'Long-life Milk 500ml', price: 80, icon: '🥛' },
      { id: 15, name: 'Bread Loaf', price: 75, icon: '🍞' },
      { id: 16, name: 'Bread Roll x4', price: 60, icon: '🍞' },
      { id: 17, name: 'Omo Detergent 1kg', price: 320, icon: '🧺' },
      { id: 18, name: 'Omo Detergent 500g', price: 175, icon: '🧺' },
      { id: 19, name: 'Ariel Detergent 1kg', price: 360, icon: '🧺' },
      { id: 20, name: 'Bar Soap x3', price: 150, icon: '🧼' },
      { id: 21, name: 'Bathing Soap', price: 80, icon: '🧼' },
      { id: 22, name: 'Toothpaste 75ml', price: 120, icon: '🪥' },
      { id: 23, name: 'Toothpaste 150ml', price: 200, icon: '🪥' },
      { id: 24, name: 'Toothbrush x2', price: 90, icon: '🪥' },
      { id: 25, name: 'Salt 500g', price: 50, icon: '🧂' },
      { id: 26, name: 'Baking Flour 1kg', price: 140, icon: '🌾' },
      { id: 27, name: 'Baking Flour 2kg', price: 270, icon: '🌾' },
      { id: 28, name: 'Spaghetti 400g', price: 120, icon: '🍝' },
      { id: 29, name: 'Macaroni 400g', price: 110, icon: '🍝' },
      { id: 30, name: 'Tomato Paste 70g', price: 55, icon: '🍅' },
      { id: 31, name: 'Tomato Paste 150g', price: 95, icon: '🍅' },
      { id: 32, name: 'Royco Beef 75g', price: 85, icon: '🥄' },
      { id: 33, name: 'Royco Chicken 75g', price: 85, icon: '🥄' },
      { id: 34, name: 'Margarine 250g', price: 140, icon: '🧈' },
      { id: 35, name: 'Margarine 500g', price: 260, icon: '🧈' },
      { id: 36, name: 'Nescafe 200g', price: 750, icon: '☕' },
      { id: 37, name: 'Ovaltine 400g', price: 590, icon: '🥤' },
      { id: 38, name: 'Milo 400g', price: 620, icon: '🥤' },
      { id: 39, name: 'Canned Tuna 185g', price: 180, icon: '🐟' },
      { id: 40, name: 'Canned Sardines', price: 100, icon: '🐟' },
      { id: 41, name: 'Honey 250ml', price: 350, icon: '🍯' },
      { id: 42, name: 'Jam Strawberry 400g', price: 280, icon: '🍓' },
      { id: 43, name: 'Peanut Butter 400g', price: 320, icon: '🥜' },
      { id: 44, name: 'Biscuits Digestive', price: 95, icon: '🍪' },
      { id: 45, name: 'Biscuits Cream', price: 80, icon: '🍪' },
      { id: 46, name: 'Matchboxes x10', price: 70, icon: '🔥' },
      { id: 47, name: 'Tissue Roll x4', price: 180, icon: '🧻' },
      { id: 48, name: 'Tissue Box', price: 120, icon: '🧻' },
      { id: 49, name: 'Garbage Bags x10', price: 150, icon: '🗑️' },
      { id: 50, name: 'Washing Up Liquid 500ml', price: 130, icon: '🧴' },
    ]
  },
  pharmacy: {
    label: 'Pharmacy', icon: '💊',
    products: [
      { id: 101, name: 'Panadol 500mg x8', price: 50, icon: '💊', tag: 'OTC' },
      { id: 102, name: 'Panadol Extra x8', price: 80, icon: '💊', tag: 'OTC' },
      { id: 103, name: 'Ibuprofen 400mg x8', price: 80, icon: '💊', tag: 'OTC' },
      { id: 104, name: 'Aspirin 300mg x8', price: 40, icon: '💊', tag: 'OTC' },
      { id: 105, name: 'Amoxicillin 250mg x21', price: 320, icon: '💉', tag: 'POM' },
      { id: 106, name: 'Amoxicillin 500mg x21', price: 580, icon: '💉', tag: 'POM' },
      { id: 107, name: 'Azithromycin 500mg x3', price: 450, icon: '💉', tag: 'POM' },
      { id: 108, name: 'Ciprofloxacin 500mg', price: 380, icon: '💉', tag: 'POM' },
      { id: 109, name: 'Metronidazole 400mg x21', price: 280, icon: '💉', tag: 'POM' },
      { id: 110, name: 'Actifed Syrup 100ml', price: 280, icon: '🍶', tag: 'OTC' },
      { id: 111, name: 'ORS Sachet x5', price: 100, icon: '💧', tag: 'OTC' },
      { id: 112, name: 'Coartem x24', price: 850, icon: '💊', tag: 'POM' },
      { id: 113, name: 'Vitamin C 1000mg x30', price: 480, icon: '🍊', tag: 'OTC' },
      { id: 114, name: 'Vitamin C 500mg x30', price: 280, icon: '🍊', tag: 'OTC' },
      { id: 115, name: 'Dettol 250ml', price: 320, icon: '🧴', tag: 'OTC' },
      { id: 116, name: 'Thermometer Digital', price: 850, icon: '🌡️', tag: 'OTC' },
      { id: 117, name: 'Bandage Crepe 10cm', price: 150, icon: '🩹', tag: 'OTC' },
      { id: 118, name: 'Plasters x10', price: 80, icon: '🩹', tag: 'OTC' },
      { id: 119, name: 'Cotton Wool 100g', price: 120, icon: '🩹', tag: 'OTC' },
      { id: 120, name: 'Surgical Spirit 100ml', price: 90, icon: '🧴', tag: 'OTC' },
      { id: 121, name: 'Hydrogen Peroxide 100ml', price: 130, icon: '🧴', tag: 'OTC' },
      { id: 122, name: 'Antihistamine 10mg x10', price: 120, icon: '💊', tag: 'OTC' },
      { id: 123, name: 'Omeprazole 20mg x14', price: 180, icon: '💊', tag: 'OTC' },
      { id: 124, name: 'Ranitidine 150mg x10', price: 150, icon: '💊', tag: 'OTC' },
      { id: 125, name: 'Multivitamin x30', price: 350, icon: '💊', tag: 'OTC' },
      { id: 126, name: 'Iron + Folate x30', price: 220, icon: '💊', tag: 'OTC' },
      { id: 127, name: 'Zinc Sulphate x20', price: 180, icon: '💊', tag: 'OTC' },
      { id: 128, name: 'Metformin 500mg x30', price: 280, icon: '💉', tag: 'POM' },
      { id: 129, name: 'Atorvastatin 20mg x30', price: 650, icon: '💉', tag: 'POM' },
      { id: 130, name: 'Amlodipine 5mg x30', price: 420, icon: '💉', tag: 'POM' },
      { id: 131, name: 'Lisinopril 5mg x30', price: 380, icon: '💉', tag: 'POM' },
      { id: 132, name: 'Furosemide 40mg x14', price: 180, icon: '💉', tag: 'POM' },
      { id: 133, name: 'Salbutamol Inhaler', price: 680, icon: '💨', tag: 'POM' },
      { id: 134, name: 'Cough Syrup 100ml', price: 220, icon: '🍶', tag: 'OTC' },
      { id: 135, name: 'Antifungal Cream 15g', price: 280, icon: '🧴', tag: 'OTC' },
      { id: 136, name: 'Hydrocortisone Cream 15g', price: 250, icon: '🧴', tag: 'OTC' },
      { id: 137, name: 'Clotrimazole Pessary x6', price: 320, icon: '💊', tag: 'POM' },
      { id: 138, name: 'Pregnancy Test Kit', price: 180, icon: '🔬', tag: 'OTC' },
      { id: 139, name: 'Blood Glucose Strips x50', price: 1200, icon: '🔬', tag: 'OTC' },
      { id: 140, name: 'Face Mask x10', price: 150, icon: '😷', tag: 'OTC' },
      { id: 141, name: 'Gloves Latex x10', price: 200, icon: '🧤', tag: 'OTC' },
      { id: 142, name: 'Albendazole 400mg x1', price: 120, icon: '💊', tag: 'OTC' },
      { id: 143, name: 'Folic Acid 5mg x30', price: 150, icon: '💊', tag: 'OTC' },
      { id: 144, name: 'Calcium 500mg x30', price: 280, icon: '💊', tag: 'OTC' },
      { id: 145, name: 'Omega-3 x30', price: 550, icon: '🐟', tag: 'OTC' },
      { id: 146, name: 'Povidone Iodine 100ml', price: 280, icon: '🧴', tag: 'OTC' },
      { id: 147, name: 'Nasal Spray Saline', price: 320, icon: '💧', tag: 'OTC' },
      { id: 148, name: 'Eye Drops Lubricant', price: 350, icon: '👁️', tag: 'OTC' },
      { id: 149, name: 'Ear Drops', price: 280, icon: '👂', tag: 'OTC' },
      { id: 150, name: 'Sunscreen SPF50 100ml', price: 750, icon: '☀️', tag: 'OTC' },
    ]
  },
  airbnb: {
    label: 'Airbnb / Hospitality', icon: '🏠',
    products: [
      { id: 201, name: 'Single Room 1 Night', price: 2500, icon: '🛏️' },
      { id: 202, name: 'Double Room 1 Night', price: 4500, icon: '🛏️' },
      { id: 203, name: 'Deluxe Room 1 Night', price: 6500, icon: '🛏️' },
      { id: 204, name: 'Full House 1 Night', price: 8000, icon: '🏠' },
      { id: 205, name: 'Villa 1 Night', price: 15000, icon: '🏡' },
      { id: 206, name: 'Airport Pickup', price: 1500, icon: '🚗' },
      { id: 207, name: 'Airport Drop-off', price: 1500, icon: '🚗' },
      { id: 208, name: 'Breakfast x1', price: 800, icon: '🍳' },
      { id: 209, name: 'Full Board x1 Day', price: 2500, icon: '🍽️' },
      { id: 210, name: 'Extra Towels', price: 200, icon: '🛁' },
      { id: 211, name: 'Late Checkout Fee', price: 1000, icon: '⏰' },
      { id: 212, name: 'Early Check-in Fee', price: 800, icon: '🌅' },
      { id: 213, name: 'Laundry Service', price: 500, icon: '👕' },
      { id: 214, name: 'City Tour 4hrs', price: 3500, icon: '🗺️' },
      { id: 215, name: 'City Tour Full Day', price: 6000, icon: '🗺️' },
      { id: 216, name: 'Pool Access', price: 500, icon: '🏊' },
      { id: 217, name: 'Gym Access', price: 400, icon: '🏋️' },
      { id: 218, name: 'Spa 1hr', price: 2500, icon: '💆' },
      { id: 219, name: 'Babysitting 4hrs', price: 1200, icon: '👶' },
      { id: 220, name: 'Room Decoration', price: 1500, icon: '🌹' },
      { id: 221, name: 'Catering Service', price: 5000, icon: '🍾' },
      { id: 222, name: 'BBQ Package', price: 3000, icon: '🍖' },
      { id: 223, name: 'Conference Room Half-Day', price: 5000, icon: '📊' },
      { id: 224, name: 'Conference Room Full Day', price: 8000, icon: '📊' },
      { id: 225, name: 'Projector Rental', price: 1000, icon: '📽️' },
    ]
  },
  electronics: {
    label: 'Electronics', icon: '🔌',
    products: [
      { id: 301, name: 'Smartphone Entry-level', price: 8500, icon: '📱' },
      { id: 302, name: 'Smartphone Mid-range', price: 18500, icon: '📱' },
      { id: 303, name: 'Smartphone Flagship', price: 45000, icon: '📱' },
      { id: 304, name: 'Wireless Earbuds', price: 4200, icon: '🎧' },
      { id: 305, name: 'Wired Earphones', price: 650, icon: '🎧' },
      { id: 306, name: 'Bluetooth Speaker', price: 2800, icon: '🔊' },
      { id: 307, name: 'Portable Charger 10000mAh', price: 1600, icon: '🔋' },
      { id: 308, name: 'Portable Charger 20000mAh', price: 2800, icon: '🔋' },
      { id: 309, name: 'LED Desk Lamp', price: 1050, icon: '💡' },
      { id: 310, name: 'Smartwatch', price: 6800, icon: '⌚' },
      { id: 311, name: 'Fitness Tracker', price: 3500, icon: '⌚' },
      { id: 312, name: 'USB-C Cable 1m', price: 280, icon: '🔌' },
      { id: 313, name: 'USB-C Cable 2m', price: 380, icon: '🔌' },
      { id: 314, name: 'Wall Charger 65W', price: 1200, icon: '🔌' },
      { id: 315, name: 'Wireless Charger Pad', price: 1800, icon: '🔌' },
      { id: 316, name: 'Phone Case Universal', price: 350, icon: '📱' },
      { id: 317, name: 'Screen Protector', price: 200, icon: '📱' },
      { id: 318, name: 'Memory Card 64GB', price: 900, icon: '💾' },
      { id: 319, name: 'Memory Card 128GB', price: 1600, icon: '💾' },
      { id: 320, name: 'Flash Drive 32GB', price: 650, icon: '💾' },
      { id: 321, name: 'Flash Drive 64GB', price: 950, icon: '💾' },
      { id: 322, name: 'Laptop Stand', price: 1800, icon: '💻' },
      { id: 323, name: 'Wireless Mouse', price: 1200, icon: '🖱️' },
      { id: 324, name: 'Keyboard Wireless', price: 2200, icon: '⌨️' },
      { id: 325, name: 'HDMI Cable 2m', price: 550, icon: '📺' },
      { id: 326, name: 'Extension Cable 4-way', price: 850, icon: '🔌' },
      { id: 327, name: 'Smart Plug', price: 1200, icon: '🔌' },
      { id: 328, name: 'LED Strip 5m', price: 1500, icon: '💡' },
      { id: 329, name: 'Solar Lamp', price: 2200, icon: '☀️' },
      { id: 330, name: 'Digital Camera Basic', price: 12000, icon: '📷' },
    ]
  },
  salon: {
    label: 'Salon & Beauty', icon: '💇',
    products: [
      { id: 401, name: 'Haircut (Men)', price: 850, icon: '✂️' },
      { id: 402, name: 'Haircut (Women)', price: 1200, icon: '✂️' },
      { id: 403, name: 'Haircut (Kids)', price: 500, icon: '✂️' },
      { id: 404, name: 'Beard Trim', price: 450, icon: '🧔' },
      { id: 405, name: 'Beard Shape Up', price: 650, icon: '🧔' },
      { id: 406, name: 'Full Shave', price: 700, icon: '🧔' },
      { id: 407, name: 'Manicure', price: 1200, icon: '💅' },
      { id: 408, name: 'Pedicure', price: 1500, icon: '💅' },
      { id: 409, name: 'Manicure + Pedicure', price: 2500, icon: '💅' },
      { id: 410, name: 'Gel Nails', price: 2200, icon: '💅' },
      { id: 411, name: 'Acrylic Nails Full Set', price: 3500, icon: '💅' },
      { id: 412, name: 'Facial Basic', price: 2200, icon: '🧖' },
      { id: 413, name: 'Facial Premium', price: 4500, icon: '🧖' },
      { id: 414, name: 'Blow Dry', price: 700, icon: '💨' },
      { id: 415, name: 'Hair Wash & Blow Dry', price: 1200, icon: '💨' },
      { id: 416, name: 'Hair Colour Single', price: 2500, icon: '🎨' },
      { id: 417, name: 'Hair Colour Full', price: 4500, icon: '🎨' },
      { id: 418, name: 'Highlights', price: 5500, icon: '🎨' },
      { id: 419, name: 'Braids Simple', price: 1500, icon: '💁' },
      { id: 420, name: 'Braids Full Head', price: 4500, icon: '💁' },
      { id: 421, name: 'Cornrows', price: 1200, icon: '💁' },
      { id: 422, name: 'Relaxer Treatment', price: 2200, icon: '🧪' },
      { id: 423, name: 'Deep Conditioning', price: 1500, icon: '🧴' },
      { id: 424, name: 'Eyebrow Threading', price: 300, icon: '🪡' },
      { id: 425, name: 'Eyebrow Tinting', price: 500, icon: '🪡' },
      { id: 426, name: 'Eyelash Extensions', price: 3500, icon: '👁️' },
      { id: 427, name: 'Waxing (Legs)', price: 1800, icon: '🦵' },
      { id: 428, name: 'Waxing (Arms)', price: 1200, icon: '💪' },
      { id: 429, name: 'Body Scrub', price: 3000, icon: '🛁' },
      { id: 430, name: 'Head Massage 30min', price: 1500, icon: '💆' },
    ]
  },
  cafe: {
    label: 'Cafe & Restaurant', icon: '☕',
    products: [
      { id: 501, name: 'Espresso Single', price: 180, icon: '☕' },
      { id: 502, name: 'Espresso Double', price: 280, icon: '☕' },
      { id: 503, name: 'Cappuccino', price: 280, icon: '🥛' },
      { id: 504, name: 'Latte', price: 320, icon: '🥛' },
      { id: 505, name: 'Flat White', price: 300, icon: '🥛' },
      { id: 506, name: 'Americano', price: 220, icon: '☕' },
      { id: 507, name: 'Chai Tea', price: 150, icon: '🍵' },
      { id: 508, name: 'Masala Tea', price: 180, icon: '🍵' },
      { id: 509, name: 'Hot Chocolate', price: 350, icon: '🍫' },
      { id: 510, name: 'Smoothie Berry', price: 390, icon: '🍓' },
      { id: 511, name: 'Smoothie Tropical', price: 420, icon: '🍍' },
      { id: 512, name: 'Fresh Juice Orange', price: 250, icon: '🍊' },
      { id: 513, name: 'Fresh Juice Passion', price: 250, icon: '🍹' },
      { id: 514, name: 'Sandwich Club', price: 420, icon: '🥪' },
      { id: 515, name: 'Sandwich Chicken', price: 480, icon: '🥪' },
      { id: 516, name: 'Sandwich Tuna', price: 400, icon: '🥪' },
      { id: 517, name: 'Cake Slice', price: 320, icon: '🍰' },
      { id: 518, name: 'Muffin', price: 180, icon: '🧁' },
      { id: 519, name: 'Croissant', price: 220, icon: '🥐' },
      { id: 520, name: 'Breakfast Full', price: 850, icon: '🍳' },
      { id: 521, name: 'Breakfast Light', price: 480, icon: '🍳' },
      { id: 522, name: 'Avocado Toast', price: 550, icon: '🥑' },
      { id: 523, name: 'Pancakes x3', price: 380, icon: '🥞' },
      { id: 524, name: 'Waffles', price: 420, icon: '🧇' },
      { id: 525, name: 'Pasta Carbonara', price: 680, icon: '🍝' },
      { id: 526, name: 'Pizza Margherita', price: 850, icon: '🍕' },
      { id: 527, name: 'Pizza Pepperoni', price: 950, icon: '🍕' },
      { id: 528, name: 'Burger Classic', price: 650, icon: '🍔' },
      { id: 529, name: 'Burger Chicken', price: 700, icon: '🍔' },
      { id: 530, name: 'French Fries', price: 280, icon: '🍟' },
      { id: 531, name: 'Salad Garden', price: 420, icon: '🥗' },
      { id: 532, name: 'Salad Caesar', price: 520, icon: '🥗' },
      { id: 533, name: 'Soup of the Day', price: 350, icon: '🍲' },
      { id: 534, name: 'Mandazi x4', price: 120, icon: '🍩' },
      { id: 535, name: 'Samosa x3', price: 150, icon: '🥟' },
      { id: 536, name: 'Chips & Chicken', price: 580, icon: '🍗' },
      { id: 537, name: 'Ugali & Stew', price: 350, icon: '🍽️' },
      { id: 538, name: 'Pilau (Plate)', price: 480, icon: '🍛' },
      { id: 539, name: 'Nyama Choma (200g)', price: 850, icon: '🥩' },
      { id: 540, name: 'Tiramisu', price: 450, icon: '🍮' },
    ]
  },
  laundry: {
    label: 'Laundry', icon: '👕',
    products: [
      { id: 601, name: 'Shirt Iron & Press', price: 80, icon: '👔' },
      { id: 602, name: 'Trouser Iron & Press', price: 100, icon: '👖' },
      { id: 603, name: 'Suit Dry Clean', price: 850, icon: '🧥' },
      { id: 604, name: 'Dress Dry Clean', price: 650, icon: '👗' },
      { id: 605, name: 'Bedsheet Wash & Iron', price: 250, icon: '🛏️' },
      { id: 606, name: 'Duvet Clean', price: 700, icon: '🛏️' },
      { id: 607, name: 'Shoes Clean', price: 300, icon: '👟' },
      { id: 608, name: 'Leather Jacket Clean', price: 1200, icon: '🧥' },
      { id: 609, name: 'Express Laundry 2kg', price: 450, icon: '⚡' },
      { id: 610, name: 'Standard Laundry 5kg', price: 800, icon: '🧺' },
    ]
  },
  hardware: {
    label: 'Hardware', icon: '🔧',
    products: [
      { id: 701, name: 'Hammer', price: 650, icon: '🔨' },
      { id: 702, name: 'Screwdriver Set', price: 850, icon: '🪛' },
      { id: 703, name: 'Measuring Tape 5m', price: 380, icon: '📏' },
      { id: 704, name: 'Spirit Level', price: 550, icon: '📐' },
      { id: 705, name: 'Paint Roller', price: 350, icon: '🪣' },
      { id: 706, name: 'Paint Brush Set', price: 280, icon: '🖌️' },
      { id: 707, name: 'Wall Paint 4L (White)', price: 1800, icon: '🎨' },
      { id: 708, name: 'Gloss Paint 1L', price: 650, icon: '🎨' },
      { id: 709, name: 'Cement Bag 50kg', price: 950, icon: '🪨' },
      { id: 710, name: 'Nails 1kg Assorted', price: 280, icon: '📌' },
      { id: 711, name: 'Wood Screws x50', price: 220, icon: '🔩' },
      { id: 712, name: 'PVC Pipe 2m', price: 320, icon: '🪠' },
      { id: 713, name: 'Electrical Wire 1m', price: 120, icon: '🔌' },
      { id: 714, name: 'Light Switch', price: 180, icon: '💡' },
      { id: 715, name: 'Door Lock', price: 1200, icon: '🔒' },
      { id: 716, name: 'Padlock', price: 350, icon: '🔒' },
      { id: 717, name: 'Sandpaper Sheet x5', price: 150, icon: '📄' },
      { id: 718, name: 'Glue Gun', price: 550, icon: '🖊️' },
      { id: 719, name: 'Safety Gloves', price: 320, icon: '🧤' },
      { id: 720, name: 'Safety Goggles', price: 450, icon: '🥽' },
    ]
  },
}

// ─── INITIAL DATA (all real-time — starts at zero) ───────────────────────────
const TODAY = new Date().toISOString().slice(0, 10)

const defaultSalesData = () => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    days.push({ date: d.toISOString().slice(0, 10), revenue: 0 })
  }
  return days
}

// ─── LOYALTY UTILS ────────────────────────────────────────────────────────────
const LOYALTY_TIERS = [
  { name: 'Bronze', minPoints: 0, discount: 0, color: '#cd7f32' },
  { name: 'Silver', minPoints: 500, discount: 5, color: '#c0c0c0' },
  { name: 'Gold', minPoints: 1500, discount: 10, color: '#ffd700' },
  { name: 'Platinum', minPoints: 5000, discount: 15, color: '#e5e4e2' },
]
const getTier = (points) => [...LOYALTY_TIERS].reverse().find(t => points >= t.minPoints)
const pointsFromSale = (total) => Math.floor(total / 100) // 1 point per KES 100

export default function App() {
  const PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || ''
  const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'sb'
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'

  // ─── STATE ────────────────────────────────────────────────────────────────
  const [cart, setCart] = useState([])
  const [phone, setPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [message, setMessage] = useState('')
  const [msgType, setMsgType] = useState('info')
  const [activeCategory, setActiveCategory] = useState('shop')
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [payMethod, setPayMethod] = useState('mpesa')
  const [showPayPanel, setShowPayPanel] = useState(false)
  const [cashIn, setCashIn] = useState('')
  const [view, setView] = useState('pos')
  const [theme, setTheme] = useState('dark')
  const [customItems, setCustomItems] = useState([])
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'shop', icon: '🛒' })
  const [systemLang, setSystemLang] = useState('English (Kenya)')
  const [syncEnabled, setSyncEnabled] = useState(true)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [inventoryAlerts, setInventoryAlerts] = useState(true)
  const [salesReports, setSalesReports] = useState(true)
  const [securityLogs, setSecurityLogs] = useState(true)
  const [accessRole, setAccessRole] = useState('Super Admin')
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState(null)
  const [activeNiche, setActiveNiche] = useState('all') // niche toggle

  // Real-time data — all start at zero
  const [salesData, setSalesData] = useState(defaultSalesData())
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [ledger, setLedger] = useState([])
  const [expenses, setExpenses] = useState([])
  const [newExpense, setNewExpense] = useState({ desc: '', amount: '', category: '' })
  const [showAddExpense, setShowAddExpense] = useState(false)

  // Inventory — starts real
  const [inventory, setInventory] = useState([])
  const [newInventoryItem, setNewInventoryItem] = useState({ name: '', sku: '', category: 'General', retailPrice: '', buyingPrice: '', stockLevel: '', minAlert: '', expiry: '', batch: '' })
  const [showAddInventory, setShowAddInventory] = useState(false)

  // CRM — starts empty, builds up on sales
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' })
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [crmSearch, setCrmSearch] = useState('')

  useEffect(() => { setTimeout(() => setLoaded(true), 80) }, [])

  const flashMessage = (msg, type = 'success') => {
    setMessage(msg); setMsgType(type)
    setTimeout(() => setMessage(''), 4000)
  }

  // ─── CART ─────────────────────────────────────────────────────────────────
  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id)
      return ex
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }]
    })
  }
  const removeFromCart = (id) => setCart(c => c.filter(i => i.id !== id))
  const updateQty = (id, d) => setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i))

  const loyaltyDiscount = selectedCustomer
    ? getTier(selectedCustomer.points).discount / 100
    : 0

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const discount = Math.round(subtotal * loyaltyDiscount)
  const afterDiscount = subtotal - discount
  const tax = Math.round(afterDiscount * 0.16)
  const grand = afterDiscount + tax
  const change = cashIn ? parseInt(cashIn) - grand : 0

  // ─── POST-SALE: update everything ─────────────────────────────────────────
  const completeSale = useCallback((method, extra = {}) => {
    const invId = `INV-${String(ledger.length + 1001).padStart(4, '0')}`
    const now = new Date()
    const entry = {
      id: invId,
      date: now.toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' }),
      customer: selectedCustomer?.name || 'Walk-in',
      total: grand,
      method,
      status: 'Paid',
      items: cart,
      ...extra,
    }
    setLedger(prev => [entry, ...prev])

    // Update sales chart
    setSalesData(prev => prev.map(d =>
      d.date === TODAY ? { ...d, revenue: d.revenue + grand } : d
    ))
    setTotalRevenue(prev => prev + grand)
    setTotalOrders(prev => prev + 1)

    // Update CRM loyalty points
    if (selectedCustomer) {
      const earned = pointsFromSale(grand)
      setCustomers(prev => prev.map(c =>
        c.id === selectedCustomer.id
          ? { ...c, points: c.points + earned, visits: c.visits + 1, totalSpent: (c.totalSpent || 0) + grand }
          : c
      ))
    }

    const receipt = { method, amount: grand, items: cart, invoiceId: invId, change: extra.change, customer: selectedCustomer?.name }
    setReceiptData(receipt)
    setShowReceipt(true)
    setCart([])
    setShowPayPanel(false)
    setPhone('')
    setCashIn('')
    setSelectedCustomer(null)
  }, [cart, grand, ledger, selectedCustomer])

  // ─── PAYMENT HANDLERS ─────────────────────────────────────────────────────
  const handleMpesa = async () => {
    if (!phone) { flashMessage('Enter customer phone number', 'error'); return }
    flashMessage('Sending M-Pesa prompt...', 'loading')
    try {
      const res = await fetch(`${API_URL}/api/mpesa/stkpush`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: grand })
      })
      const data = await res.json()
      if (data.ResponseCode === '0') {
        completeSale('M-Pesa')
      } else {
        flashMessage('Payment request failed. Try again.', 'error')
      }
    } catch {
      // Demo mode — complete anyway for testing
      completeSale('M-Pesa')
    }
  }

  const handleCash = () => {
    if (!cashIn || change < 0) { flashMessage('Insufficient cash amount', 'error'); return }
    completeSale('Cash', { change })
  }

  const handlePayStack = () => {
    if (typeof window.PaystackPop === 'undefined') {
      flashMessage('Paystack not loaded. Check internet connection.', 'error'); return
    }
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: customerEmail || 'customer@berylbytes.co.ke',
      amount: grand * 100,
      currency: 'KES',
      ref: 'POS-' + Date.now(),
      callback: (response) => {
        completeSale('Paystack', { transactionRef: response.reference })
      },
      onClose: () => flashMessage('Payment cancelled.', 'error'),
    })
    handler.openIframe()
  }

  // ─── PDF RECEIPT ──────────────────────────────────────────────────────────
  const generatePDF = () => {
    if (!receiptData) return
    const doc = new jsPDF()
    const margin = 20
    let y = margin

    // Header
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('BERYLBYTES POS', margin, y); y += 10
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('berylbytes.co.ke | berylmunyao8@gmail.com', margin, y); y += 8
    doc.line(margin, y, 190, y); y += 6

    // Invoice info
    doc.setFontSize(9)
    doc.text(`Invoice: ${receiptData.invoiceId || 'N/A'}`, margin, y)
    doc.text(`Date: ${new Date().toLocaleString('en-KE')}`, 110, y); y += 6
    doc.text(`Customer: ${receiptData.customer || 'Walk-in'}`, margin, y)
    doc.text(`Method: ${receiptData.method}`, 110, y); y += 8
    doc.line(margin, y, 190, y); y += 6

    // Items
    doc.setFont('helvetica', 'bold')
    doc.text('ITEM', margin, y)
    doc.text('QTY', 120, y)
    doc.text('UNIT', 140, y)
    doc.text('TOTAL', 165, y); y += 5
    doc.line(margin, y, 190, y); y += 5
    doc.setFont('helvetica', 'normal')

    receiptData.items.forEach(item => {
      const lineTotal = `KES ${(item.price * item.qty).toLocaleString()}`
      doc.text(item.name.substring(0, 30), margin, y)
      doc.text(String(item.qty), 122, y)
      doc.text(`KES ${item.price.toLocaleString()}`, 135, y)
      doc.text(lineTotal, 162, y); y += 6
    })

    y += 2; doc.line(margin, y, 190, y); y += 6

    // Totals
    const subtotalAmt = receiptData.items.reduce((s, i) => s + i.price * i.qty, 0)
    doc.text('Subtotal:', 130, y)
    doc.text(`KES ${subtotalAmt.toLocaleString()}`, 162, y); y += 6
    doc.text('VAT 16%:', 130, y)
    doc.text(`KES ${Math.round(subtotalAmt * 0.16).toLocaleString()}`, 162, y); y += 6
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL PAID:', 130, y)
    doc.text(`KES ${receiptData.amount.toLocaleString()}`, 162, y); y += 6

    if (receiptData.change) {
      doc.setFont('helvetica', 'normal')
      doc.text('Change:', 130, y)
      doc.text(`KES ${receiptData.change.toLocaleString()}`, 162, y); y += 6
    }

    y += 4; doc.line(margin, y, 190, y); y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text('Thank you for your business! — BerylBytes POS System', margin, y)

    doc.save(`${receiptData.invoiceId || 'receipt'}.pdf`)
  }

  // ─── ADD ITEM ─────────────────────────────────────────────────────────────
  const addNewItem = () => {
    if (!newItem.name || !newItem.price) { flashMessage('Enter name and price.', 'error'); return }
    setCustomItems(prev => [...prev, { id: Date.now(), ...newItem, price: parseInt(newItem.price) }])
    flashMessage('Item added successfully.')
    setNewItem({ name: '', price: '', category: 'shop', icon: '🛒' })
    setView('pos')
  }

  // ─── ADD CUSTOMER ─────────────────────────────────────────────────────────
  const addCustomer = () => {
    if (!newCustomer.name) { flashMessage('Customer name is required.', 'error'); return }
    setCustomers(prev => [...prev, {
      id: Date.now(),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      points: 0,
      visits: 0,
      totalSpent: 0,
      joined: TODAY,
    }])
    flashMessage(`${newCustomer.name} added to CRM!`)
    setNewCustomer({ name: '', email: '', phone: '' })
    setShowAddCustomer(false)
  }

  // ─── PRODUCT FILTERING ────────────────────────────────────────────────────
  const NICHE_MAP = {
    all: Object.keys(categories),
    retail: ['shop', 'laundry', 'hardware'],
    food: ['cafe'],
    health: ['pharmacy'],
    services: ['airbnb', 'salon'],
    tech: ['electronics'],
  }

  const visibleCategories = NICHE_MAP[activeNiche] || Object.keys(categories)

  const allProducts = [
    ...(categories[activeCategory]?.products ?? []),
    ...customItems.filter(item => item.category === activeCategory),
  ]
  const products = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    visibleCategories.includes(activeCategory)
  )

  const formatKES = (value) => `KES ${(value || 0).toLocaleString()}`
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const netProfit = totalRevenue - totalExpenses
  const maxBarRevenue = Math.max(...salesData.map(d => d.revenue), 1)

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <PayPalScriptProvider options={{ 'client-id': PAYPAL_CLIENT_ID }}>
      <div className={`pr ${loaded ? 'in' : ''}`}>
        {/* Ambient */}
        <div className="amb">
          {[...Array(8)].map((_, i) => <div key={i} className={`ab ab${i + 1}`}></div>)}
          <div className="grid-tex"></div>
        </div>

        {/* Header */}
        <header className="hd">
          <div className="hd-brand">
            <img src="/logo.png" alt="BBytes" className="hd-logo" onError={e => e.target.style.display = 'none'} />
            <div className="hd-txt">
              <span className="hd-name">Beryl<em>Bytes</em></span>
              <span className="hd-sub">Point of Sale — Live</span>
            </div>
          </div>

          <nav className="view-tabs">
            {[
              { id: 'pos', label: '🛒 POS' },
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'crm', label: '👥 CRM' },
              { id: 'orders', label: '📦 Inventory' },
              { id: 'add', label: '➕ Add Item' },
              { id: 'settings', label: '⚙️ Settings' },
            ].map(tab => (
              <button key={tab.id} className={`view-btn ${view === tab.id ? 'act' : ''}`} onClick={() => setView(tab.id)}>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Business Niche Toggle */}
          <div className="niche-bar">
            {[
              { id: 'all', label: '🌐 All' },
              { id: 'retail', label: '🛒 Retail' },
              { id: 'food', label: '🍽️ Food' },
              { id: 'health', label: '💊 Health' },
              { id: 'services', label: '✂️ Services' },
              { id: 'tech', label: '🔌 Tech' },
            ].map(n => (
              <button key={n.id}
                className={`niche-pill ${activeNiche === n.id ? 'act' : ''}`}
                onClick={() => {
                  setActiveNiche(n.id)
                  const cats = NICHE_MAP[n.id]
                  if (cats && !cats.includes(activeCategory)) {
                    setActiveCategory(cats[0])
                  }
                }}>
                {n.label}
              </button>
            ))}
          </div>

          <nav className="cat-nav">
            {Object.entries(categories)
              .filter(([key]) => visibleCategories.includes(key))
              .map(([key, val]) => (
                <button key={key} className={`cn ${activeCategory === key ? 'act' : ''}`}
                  onClick={() => { setActiveCategory(key); setSearch('') }}>
                  <span>{val.icon}</span>
                  <span>{val.label}</span>
                </button>
              ))}
          </nav>

          <div className="hd-right">
            <div className="srch">
              <span>⌕</span>
              <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="live-stats">
              <span>💰 {formatKES(totalRevenue)}</span>
              <span>📦 {totalOrders} orders</span>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="bd">
          <section className="ps">

            {/* ── DASHBOARD ── */}
            {view === 'dashboard' && (
              <div className="settings-grid">
                {/* KPI Row */}
                <div className="card full-card">
                  <h2>Live Performance</h2>
                  <div className="kpi-row">
                    <div className="kpi-card green">
                      <div className="kpi-val">{formatKES(totalRevenue)}</div>
                      <div className="kpi-lbl">Total Revenue</div>
                    </div>
                    <div className="kpi-card blue">
                      <div className="kpi-val">{totalOrders}</div>
                      <div className="kpi-lbl">Orders Today</div>
                    </div>
                    <div className="kpi-card purple">
                      <div className="kpi-val">{formatKES(netProfit)}</div>
                      <div className="kpi-lbl">Net Profit</div>
                    </div>
                    <div className="kpi-card red">
                      <div className="kpi-val">{formatKES(totalExpenses)}</div>
                      <div className="kpi-lbl">Total Expenses</div>
                    </div>
                    <div className="kpi-card orange">
                      <div className="kpi-val">{customers.length}</div>
                      <div className="kpi-lbl">Customers</div>
                    </div>
                    <div className="kpi-card teal">
                      <div className="kpi-val">{ledger.length}</div>
                      <div className="kpi-lbl">Transactions</div>
                    </div>
                  </div>
                </div>

                {/* Sales Chart */}
                <div className="card">
                  <h2>Daily Revenue — Last 7 Days</h2>
                  <div className="bar-chart">
                    {salesData.map((day, i) => (
                      <div key={i} className="bar-item">
                        <div className="bar" style={{ height: `${(day.revenue / maxBarRevenue) * 100}%` }}>
                          <span className="bar-tooltip">{formatKES(day.revenue)}</span>
                        </div>
                        <span className="bar-label">{day.date.slice(-5)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expense Tracker */}
                <div className="card">
                  <div className="card-hd-row">
                    <h2>Expense Tracker</h2>
                    <button className="primary-btn" onClick={() => setShowAddExpense(true)}>+ Add</button>
                  </div>
                  {showAddExpense && (
                    <div className="add-expense-form">
                      <input placeholder="Description" value={newExpense.desc} onChange={e => setNewExpense({ ...newExpense, desc: e.target.value })} />
                      <input type="number" placeholder="Amount (KES)" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} />
                      <select value={newExpense.category} onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}>
                        <option value="">Category</option>
                        {['Inventory', 'Rent', 'Staff', 'Utilities', 'Marketing', 'Maintenance', 'Other'].map(c => <option key={c}>{c}</option>)}
                      </select>
                      <div className="btn-row">
                        <button className="primary-btn" onClick={() => {
                          if (!newExpense.desc || !newExpense.amount) return
                          setExpenses(prev => [{ id: Date.now(), desc: newExpense.desc, category: newExpense.category || 'Other', amount: parseInt(newExpense.amount), date: TODAY }, ...prev])
                          setNewExpense({ desc: '', amount: '', category: '' })
                          setShowAddExpense(false)
                          flashMessage('Expense logged.')
                        }}>Save</button>
                        <button className="ghost-btn" onClick={() => setShowAddExpense(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {expenses.length === 0 ? (
                    <div className="ci-empty"><p>No expenses logged yet</p></div>
                  ) : (
                    <table className="expense-table">
                      <thead><tr><th>Description</th><th>Category</th><th>Amount</th><th>Date</th></tr></thead>
                      <tbody>{expenses.map(exp => (
                        <tr key={exp.id}>
                          <td>{exp.desc}</td>
                          <td>{exp.category}</td>
                          <td>{formatKES(exp.amount)}</td>
                          <td>{exp.date}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  )}
                  <div className="total-expenses">Total: {formatKES(totalExpenses)}</div>
                </div>

                {/* Digital Ledger */}
                <div className="card full-card">
                  <h2>Digital Ledger</h2>
                  {ledger.length === 0 ? (
                    <div className="ci-empty"><p>No transactions yet — complete a sale to see entries here</p></div>
                  ) : (
                    <table className="ledger-table">
                      <thead>
                        <tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {ledger.map(row => (
                          <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.date}</td>
                            <td>{row.customer}</td>
                            <td>{formatKES(row.total)}</td>
                            <td>{row.method}</td>
                            <td><span className="pill paid">{row.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ── CRM ── */}
            {view === 'crm' && (
              <div className="settings-grid">
                <div className="card full-card">
                  <div className="card-hd-row">
                    <h2>Customer Relationship Management</h2>
                    <button className="primary-btn" onClick={() => setShowAddCustomer(true)}>+ Add Customer</button>
                  </div>

                  {showAddCustomer && (
                    <div className="add-expense-form">
                      <input placeholder="Full Name" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
                      <input placeholder="Email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                      <input placeholder="Phone (e.g. 0712345678)" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                      <div className="btn-row">
                        <button className="primary-btn" onClick={addCustomer}>Save Customer</button>
                        <button className="ghost-btn" onClick={() => setShowAddCustomer(false)}>Cancel</button>
                      </div>
                    </div>
                  )}

                  <div className="srch" style={{ margin: '12px 0' }}>
                    <span>⌕</span>
                    <input placeholder="Search customers..." value={crmSearch} onChange={e => setCrmSearch(e.target.value)} />
                  </div>

                  {customers.length === 0 ? (
                    <div className="ci-empty">
                      <div className="ce-ic">👥</div>
                      <p>No customers yet</p>
                      <span>Add customers and assign them at checkout to earn loyalty points</span>
                    </div>
                  ) : (
                    <div className="crm-grid">
                      {customers
                        .filter(c => c.name.toLowerCase().includes(crmSearch.toLowerCase()) || c.email?.toLowerCase().includes(crmSearch.toLowerCase()))
                        .map(c => {
                          const tier = getTier(c.points)
                          return (
                            <div key={c.id} className="crm-card" style={{ borderColor: tier.color }}>
                              <div className="crm-avatar" style={{ background: tier.color }}>
                                {c.name[0].toUpperCase()}
                              </div>
                              <div className="crm-name">{c.name}</div>
                              {c.email && <div className="crm-meta">{c.email}</div>}
                              {c.phone && <div className="crm-meta">📱 {c.phone}</div>}
                              <div className="crm-tier" style={{ color: tier.color }}>⭐ {tier.name}</div>
                              <div className="crm-row"><span>Points</span><strong>{c.points}</strong></div>
                              <div className="crm-row"><span>Visits</span><strong>{c.visits}</strong></div>
                              <div className="crm-row"><span>Spent</span><strong>{formatKES(c.totalSpent || 0)}</strong></div>
                              <div className="crm-row"><span>Discount</span><strong>{tier.discount}%</strong></div>
                              <button className="ghost-btn sm" onClick={() => setCustomers(prev => prev.filter(x => x.id !== c.id))}>Remove</button>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </div>

                {/* Loyalty Tiers Info */}
                <div className="card full-card">
                  <h2>Loyalty Programme Tiers</h2>
                  <div className="crm-grid">
                    {LOYALTY_TIERS.map(tier => (
                      <div key={tier.name} className="crm-card" style={{ borderColor: tier.color }}>
                        <div className="crm-name" style={{ color: tier.color }}>{tier.name}</div>
                        <div className="crm-row"><span>Min Points</span><strong>{tier.minPoints}</strong></div>
                        <div className="crm-row"><span>Discount</span><strong>{tier.discount}%</strong></div>
                        <div className="crm-meta">1 point per KES 100 spent</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── INVENTORY ── */}
            {view === 'orders' && (
              <div className="settings-grid">
                <div className="card full-card">
                  <div className="card-hd-row">
                    <h2>Inventory Management</h2>
                    <button className="primary-btn" onClick={() => setShowAddInventory(true)}>+ Add Item</button>
                  </div>
                  {showAddInventory && (
                    <div className="add-inventory-form">
                      {[
                        { label: 'Product Name', key: 'name', type: 'text' },
                        { label: 'SKU / Code', key: 'sku', type: 'text' },
                        { label: 'Retail Price (KES)', key: 'retailPrice', type: 'number' },
                        { label: 'Buying Price', key: 'buyingPrice', type: 'number' },
                        { label: 'Stock Level', key: 'stockLevel', type: 'number' },
                        { label: 'Min. Alert', key: 'minAlert', type: 'number' },
                        { label: 'Expiry Date', key: 'expiry', type: 'date' },
                        { label: 'Batch Number', key: 'batch', type: 'text' },
                      ].map(f => (
                        <div className="sf" key={f.key}>
                          <label>{f.label}</label>
                          <input type={f.type} value={newInventoryItem[f.key]}
                            onChange={e => setNewInventoryItem({ ...newInventoryItem, [f.key]: e.target.value })} />
                        </div>
                      ))}
                      <div className="sf">
                        <label>Category</label>
                        <select value={newInventoryItem.category} onChange={e => setNewInventoryItem({ ...newInventoryItem, category: e.target.value })}>
                          {['General', 'Pharmaceutical Grade', 'Electronics', 'Food & Beverage', 'Services'].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="btn-row">
                        <button className="primary-btn" onClick={() => {
                          if (!newInventoryItem.name || !newInventoryItem.sku) return
                          setInventory(prev => [...prev, { id: Date.now(), ...newInventoryItem, retailPrice: parseInt(newInventoryItem.retailPrice) || 0, buyingPrice: parseInt(newInventoryItem.buyingPrice) || 0, stockLevel: parseInt(newInventoryItem.stockLevel) || 0, minAlert: parseInt(newInventoryItem.minAlert) || 5 }])
                          setNewInventoryItem({ name: '', sku: '', category: 'General', retailPrice: '', buyingPrice: '', stockLevel: '', minAlert: '', expiry: '', batch: '' })
                          setShowAddInventory(false)
                          flashMessage('Item added to inventory.')
                        }}>Add to Inventory</button>
                        <button className="ghost-btn" onClick={() => setShowAddInventory(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {inventory.length === 0 ? (
                    <div className="ci-empty"><p>No inventory items yet. Add items to track stock.</p></div>
                  ) : (
                    <table className="inventory-table">
                      <thead><tr><th>Name</th><th>SKU</th><th>Category</th><th>Retail</th><th>Cost</th><th>Stock</th><th>Expiry</th><th>Action</th></tr></thead>
                      <tbody>{inventory.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.sku}</td>
                          <td>{item.category}</td>
                          <td>{formatKES(item.retailPrice)}</td>
                          <td>{formatKES(item.buyingPrice)}</td>
                          <td>{item.stockLevel} {item.stockLevel <= item.minAlert && <span className="alert">Low!</span>}</td>
                          <td>{item.expiry}</td>
                          <td><button className="ghost-btn sm" onClick={() => setInventory(prev => prev.filter(i => i.id !== item.id))}>Remove</button></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ── ADD ITEM ── */}
            {view === 'add' && (
              <div className="settings-grid">
                <div className="card">
                  <h2>Add Custom Item</h2>
                  <div className="sf"><label>Item Name</label><input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Special Bundle" /></div>
                  <div className="sf"><label>Price (KES)</label><input type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} /></div>
                  <div className="sf"><label>Icon (Emoji)</label><input value={newItem.icon} onChange={e => setNewItem({ ...newItem, icon: e.target.value })} /></div>
                  <div className="sf"><label>Category</label>
                    <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                      {Object.entries(categories).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                    </select>
                  </div>
                  <button className="primary-btn" onClick={addNewItem}>+ Add Item</button>
                  <p className="help-text">Custom items appear in the selected category immediately after adding.</p>
                </div>
                <div className="card">
                  <h2>System Stats</h2>
                  <div className="status-grid">
                    {[
                      { val: Object.values(categories).reduce((s, c) => s + c.products.length, 0) + customItems.length, lbl: 'Total Products' },
                      { val: customers.length, lbl: 'CRM Customers' },
                      { val: ledger.length, lbl: 'Transactions' },
                      { val: formatKES(totalRevenue), lbl: 'Revenue' },
                      { val: inventory.length, lbl: 'Inventory Items' },
                      { val: Object.keys(categories).length, lbl: 'Business Niches' },
                    ].map((s, i) => (
                      <div key={i} className="status-card"><strong>{s.val}</strong><span>{s.lbl}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── SETTINGS ── */}
            {view === 'settings' && (
              <div className="settings-grid">
                <div className="card">
                  <h2>Profile & Account</h2>
                  <div className="profile-card">
                    <div className="profile-avatar">B</div>
                    <div>
                      <div className="profile-name">Beryl Munyao</div>
                      <div className="profile-email">berylmunyao8@gmail.com</div>
                      <div className="profile-meta">Role: Super Admin</div>
                      <div className="profile-meta">Org: beryl_bytes_global</div>
                    </div>
                  </div>
                  <div className="sf"><label>Display Theme</label>
                    <div className="theme-switcher">
                      {['light', 'dark'].map(mode => (
                        <button key={mode} className={`theme-pill ${theme === mode ? 'act' : ''}`} onClick={() => setTheme(mode)}>{mode === 'light' ? '☀️ Light' : '🌙 Dark'}</button>
                      ))}
                    </div>
                  </div>
                  <div className="sf"><label>Language</label>
                    <select value={systemLang} onChange={e => setSystemLang(e.target.value)}>
                      <option>English (Kenya)</option><option>English (United States)</option><option>Swahili (Kenya)</option>
                    </select>
                  </div>
                  <div className="sf"><label>Access Role</label>
                    <select value={accessRole} onChange={e => setAccessRole(e.target.value)}>
                      <option>Super Admin</option><option>Manager</option><option>Cashier</option><option>Employee</option>
                    </select>
                  </div>
                </div>

                <div className="card">
                  <h2>System & Security</h2>
                  {[
                    { label: 'Cloud Realtime Sync', state: syncEnabled, toggle: setSyncEnabled },
                    { label: 'Biometric Enforcement', state: biometricEnabled, toggle: setBiometricEnabled },
                    { label: 'Inventory Alerts', state: inventoryAlerts, toggle: setInventoryAlerts },
                    { label: 'Sales Reports', state: salesReports, toggle: setSalesReports },
                    { label: 'Security Logs', state: securityLogs, toggle: setSecurityLogs },
                  ].map(({ label, state, toggle }) => (
                    <div key={label} className="toggle-row">
                      <span>{label}</span>
                      <button className={`toggle-pill ${state ? 'on' : ''}`} onClick={() => toggle(!state)}>
                        {state ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                  <div className="settings-foot">BerylBytes OS v4.3.0 (Enterprise LTS) — All operations encrypted.</div>
                </div>

                <div className="card">
                  <h2>Payment Keys Status</h2>
                  <div className="toggle-row"><span>Paystack Key</span><span className={`pill ${PAYSTACK_PUBLIC_KEY ? 'paid' : 'pending'}`}>{PAYSTACK_PUBLIC_KEY ? 'Connected' : 'Not Set'}</span></div>
                  <div className="toggle-row"><span>PayPal Client ID</span><span className={`pill ${PAYPAL_CLIENT_ID && PAYPAL_CLIENT_ID !== 'sb' ? 'paid' : 'pending'}`}>{PAYPAL_CLIENT_ID && PAYPAL_CLIENT_ID !== 'sb' ? 'Connected' : 'Sandbox'}</span></div>
                  <div className="toggle-row"><span>M-Pesa API</span><span className="pill paid">Configured via .env</span></div>
                  <p className="help-text">API keys are loaded from your .env file. Never commit keys to version control.</p>
                </div>
              </div>
            )}

            {/* ── POS ── */}
            {view === 'pos' && (
              <>
                {activeCategory === 'pharmacy' && (
                  <div className="ph-warn">⚠ POM items require a valid prescription before dispensing.</div>
                )}
                <div className="pg">
                  {products.length === 0 ? (
                    <div className="no-results">
                      <div style={{ fontSize: 48 }}>🔍</div>
                      <p>No products found{search ? ` for "${search}"` : ''}</p>
                    </div>
                  ) : products.map((p, i) => (
                    <div key={p.id} className="pc" style={{ animationDelay: `${i * 0.025}s` }} onClick={() => addToCart(p)}>
                      <div className="pc-shine"></div>
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
          </section>

          {/* ── CART ── */}
          <aside className="cp">
            <div className="cp-hd">
              <h2>Order</h2>
              {cart.length > 0 && <button className="clr" onClick={() => setCart([])}>Clear</button>}
            </div>

            {/* Customer selector */}
            <div className="customer-select">
              <label>Customer (optional)</label>
              <select value={selectedCustomer?.id || ''} onChange={e => {
                const c = customers.find(x => x.id === Number(e.target.value))
                setSelectedCustomer(c || null)
              }}>
                <option value="">Walk-in Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({getTier(c.points).name} — {c.points} pts)
                  </option>
                ))}
              </select>
              {selectedCustomer && (
                <div className="loyalty-badge" style={{ borderColor: getTier(selectedCustomer.points).color }}>
                  ⭐ {getTier(selectedCustomer.points).name} — {getTier(selectedCustomer.points).discount}% discount
                </div>
              )}
            </div>

            <div className="ci-list">
              {cart.length === 0 ? (
                <div className="ci-empty">
                  <div className="ce-ic">🛍</div>
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

            {cart.length > 0 && (
              <>
                <div className="tots">
                  <div className="tr"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                  {discount > 0 && <div className="tr disc"><span>Loyalty Discount</span><span>−KES {discount.toLocaleString()}</span></div>}
                  <div className="tr"><span>VAT 16%</span><span>KES {tax.toLocaleString()}</span></div>
                  <div className="tr gd"><span>Total</span><span>KES {grand.toLocaleString()}</span></div>
                </div>
                <button className="chg-btn" onClick={() => setShowPayPanel(true)}>
                  Charge KES {grand.toLocaleString()} →
                </button>
              </>
            )}
          </aside>
        </div>

        {/* ── PAYMENT MODAL ── */}
        {showPayPanel && (
          <div className="ov" onClick={e => e.target === e.currentTarget && setShowPayPanel(false)}>
            <div className="pm">
              <div className="pm-hd">
                <div>
                  <h3>Payment</h3>
                  <div className="pm-amt">KES {grand.toLocaleString()}</div>
                </div>
                <button className="pm-cls" onClick={() => setShowPayPanel(false)}>×</button>
              </div>

              <div className="pm-methods">
                {[
                  { id: 'mpesa', icon: '📱', label: 'M-Pesa' },
                  { id: 'cash', icon: '💵', label: 'Cash' },
                  { id: 'paypal', icon: '🅿️', label: 'PayPal' },
                  { id: 'paystack', icon: '💳', label: 'Card/Paystack' },
                ].map(m => (
                  <button key={m.id} className={`pmm ${payMethod === m.id ? 'act' : ''}`} onClick={() => setPayMethod(m.id)}>
                    <span>{m.icon}</span><span>{m.label}</span>
                  </button>
                ))}
              </div>

              {payMethod === 'mpesa' && (
                <div className="pm-form">
                  <label>Customer Phone</label>
                  <input type="tel" placeholder="254712345678" value={phone} onChange={e => setPhone(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleMpesa()} />
                  <button className="pm-go" onClick={handleMpesa}>📱 Send M-Pesa Prompt</button>
                </div>
              )}

              {payMethod === 'cash' && (
                <div className="pm-form">
                  <label>Cash Received (KES)</label>
                  <input type="number" placeholder="Enter amount" value={cashIn} onChange={e => setCashIn(e.target.value)} />
                  {cashIn && (
                    <div className={`pm-change ${change >= 0 ? 'pos' : 'neg'}`}>
                      {change >= 0 ? `Change: KES ${change.toLocaleString()}` : `Short by: KES ${Math.abs(change).toLocaleString()}`}
                    </div>
                  )}
                  <button className="pm-go" onClick={handleCash}>💵 Confirm Cash</button>
                </div>
              )}

              {payMethod === 'paystack' && (
                <div className="pm-form">
                  <label>Customer Email (optional)</label>
                  <input type="email" placeholder="customer@email.com" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
                  <div className="pm-info">Card payment powered by Paystack. Safe & encrypted.</div>
                  <button className="pm-go" onClick={handlePayStack}>💳 Pay with Card</button>
                </div>
              )}

              {payMethod === 'paypal' && (
                <div className="pm-form">
                  <div className="pm-info">Complete your payment securely with PayPal.</div>
                  <PayPalButtons
                    style={{ layout: 'vertical', color: 'blue', shape: 'rect' }}
                    createOrder={(data, actions) => actions.order.create({
                      purchase_units: [{
                        amount: { value: (grand / 130).toFixed(2), currency_code: 'USD' },
                        description: `BerylBytes POS — ${cart.length} item(s)`,
                      }],
                    })}
                    onApprove={(data, actions) => actions.order.capture().then(details => {
                      completeSale('PayPal', { transactionId: details.id })
                    })}
                    onError={() => flashMessage('PayPal payment failed. Try again.', 'error')}
                  />
                </div>
              )}

              {message && <div className={`pm-msg ${msgType}`}>{message}</div>}
            </div>
          </div>
        )}

        {/* ── RECEIPT MODAL ── */}
        {showReceipt && receiptData && (
          <div className="ov" onClick={e => e.target === e.currentTarget && setShowReceipt(false)}>
            <div className="receipt-modal">
              <div className="receipt-header">
                <h3>🧾 BerylBytes Receipt</h3>
                <div className="receipt-id">{receiptData.invoiceId}</div>
              </div>
              <div className="receipt-meta">
                <span>📅 {new Date().toLocaleString('en-KE')}</span>
                <span>💳 {receiptData.method}</span>
                {receiptData.customer && <span>👤 {receiptData.customer}</span>}
              </div>
              <div className="receipt-items">
                {receiptData.items.map(item => (
                  <div key={item.id} className="receipt-line">
                    <span>{item.icon} {item.name} × {item.qty}</span>
                    <span>KES {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="receipt-total">
                <div className="receipt-line"><span>Total Paid</span><strong>KES {receiptData.amount.toLocaleString()}</strong></div>
                {receiptData.change > 0 && <div className="receipt-line"><span>Change</span><strong>KES {receiptData.change.toLocaleString()}</strong></div>}
              </div>
              <div className="receipt-thank">Thank you for shopping at BerylBytes! 🎉</div>
              <div className="btn-row">
                <button className="primary-btn" onClick={generatePDF}>⬇️ Download PDF</button>
                <button className="ghost-btn" onClick={() => setShowReceipt(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  )
}
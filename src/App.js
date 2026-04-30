import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import jsPDF from 'jspdf'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const I = {
  pos:       () => <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  dashboard: () => <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  crm:       () => <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  inventory: () => <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  add:       () => <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>,
  payments:  () => <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>,
  settings:  () => <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  reports:   () => <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  search:    () => <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  x:         () => <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  arrow_r:   () => <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  arrow_l:   () => <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  check:     () => <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  alert:     () => <svg viewBox="0 0 24 24"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  edit:      () => <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  cart:      () => <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  refresh:   () => <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  download:  () => <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  eye:       () => <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  bug:       () => <svg viewBox="0 0 24 24"><path d="M8 2l1.88 1.88M16 2l-1.88 1.88M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z"/><path d="M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M20 13h-4M20.47 9C22.4 8.8 24 7.1 24 5M17 7l1-4M7 7L6 3"/></svg>,
  logout:    () => <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  fingerprint:() => <svg viewBox="0 0 24 24"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C5.5 18 6 15 6 12c0-1.7.9-3.2 2-4"/><path d="M17.8 4.5c1.3 1.6 2.2 3.6 2.2 5.5v2"/><path d="M12 8a4 4 0 0 1 4 4c0 3-.5 6-2 8.5"/><path d="M10 16c.5 1.5.5 3.5-.5 5"/><path d="M10 12c0-1.1.9-2 2-2"/></svg>,
  mpesa:     () => <svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
  card:      () => <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>,
  paypal:    () => <svg viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c1.379 1.238 1.55 3.458.804 6.14-.95 3.417-3.693 5.084-7.353 5.084H12.27"/></svg>,
  cash:      () => <svg viewBox="0 0 24 24"><rect x="1" y="6" width="22" height="13" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M5 12H1M23 12h-4"/></svg>,
  sun:       () => <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  moon:      () => <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  attach:    () => <svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  export:    () => <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
}

const SvgIcon = ({ icon, size = 14, ...props }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {I[icon]?.().props?.children}
  </svg>
)

// ─── ROLES ────────────────────────────────────────────────────────────────────
const ROLES = {
  superadmin:{ label:'Super Admin',      color:'#8d2a64', bg:'rgba(16,185,129,.1)',  access:['pos','dashboard','crm','orders','add','settings','payments','manager'], canEdit:true,  canDelete:true  },
  manager:   { label:'Manager',          color:'#0ea5e9', bg:'rgba(14,165,233,.1)',  access:['pos','dashboard','crm','orders','add','manager'],                       canEdit:true,  canDelete:false },
  cashier:   { label:'Cashier',          color:'#8b5cf6', bg:'rgba(139,92,246,.1)',  access:['pos','dashboard'],                                                     canEdit:false, canDelete:false },
  inventory: { label:'Inventory Clerk',  color:'#f59e0b', bg:'rgba(245,158,11,.1)',  access:['orders','add','dashboard'],                                             canEdit:true,  canDelete:false },
  accountant:{ label:'Accountant',       color:'#14b8a6', bg:'rgba(20,184,166,.1)',  access:['dashboard'],                                                            canEdit:false, canDelete:false },
  audit:     { label:'Auditor',          color:'#ef4444', bg:'rgba(239,68,68,.1)',   access:['dashboard','crm','orders'],                                             canEdit:false, canDelete:false },
  support:   { label:'Customer Support', color:'#a78bfa', bg:'rgba(167,139,250,.1)', access:['crm','pos'],                                                            canEdit:false, canDelete:false },
}

const SYSTEM_USERS = [
  { id:1, name:'Beryl Munyao',   email:'beryl@berylbytes.co.ke',    pin:'1234', role:'superadmin', initial:'B' },
  { id:2, name:'Admin User',     email:'admin@berylbytes.co.ke',    pin:'2345', role:'manager',    initial:'A' },
  { id:3, name:'Cashier One',    email:'cashier1@berylbytes.co.ke', pin:'3456', role:'cashier',    initial:'C' },
  { id:4, name:'Cashier Two',    email:'cashier2@berylbytes.co.ke', pin:'4567', role:'cashier',    initial:'D' },
  { id:5, name:'Stock Manager',  email:'stock@berylbytes.co.ke',    pin:'5678', role:'inventory',  initial:'S' },
  { id:6, name:'Accountant',     email:'accounts@berylbytes.co.ke', pin:'6789', role:'accountant', initial:'M' },
  { id:7, name:'Audit Officer',  email:'audit@berylbytes.co.ke',    pin:'7890', role:'audit',      initial:'U' },
  { id:8, name:'Support Agent',  email:'support@berylbytes.co.ke',  pin:'8901', role:'support',    initial:'P' },
]

// ─── CATALOGUE ────────────────────────────────────────────────────────────────
export const categories = {
  shop: { label:'General Shop', icon:'🛒', products:[
    {id:1,name:'Maize Flour 2kg',price:220},{id:2,name:'Maize Flour 5kg',price:520},
    {id:3,name:'Cooking Oil 1L',price:350},{id:4,name:'Cooking Oil 2L',price:680},
    {id:5,name:'Cooking Oil 5L',price:1550},{id:6,name:'Sugar 1kg',price:180},
    {id:7,name:'Sugar 2kg',price:350},{id:8,name:'Rice 2kg',price:310},
    {id:9,name:'Rice 5kg',price:760},{id:10,name:'Tea Leaves 500g',price:220},
    {id:11,name:'Tea Leaves 250g',price:120},{id:12,name:'Milk 500ml',price:65},
    {id:13,name:'Milk 1L Fresh',price:130},{id:14,name:'Long-life Milk 500ml',price:80},
    {id:15,name:'Bread Loaf',price:75},{id:16,name:'Bread Roll x4',price:60},
    {id:17,name:'Omo Detergent 1kg',price:320},{id:18,name:'Omo Detergent 500g',price:175},
    {id:19,name:'Ariel Detergent 1kg',price:360},{id:20,name:'Bar Soap x3',price:150},
    {id:21,name:'Bathing Soap',price:80},{id:22,name:'Toothpaste 75ml',price:120},
    {id:23,name:'Toothpaste 150ml',price:200},{id:24,name:'Toothbrush x2',price:90},
    {id:25,name:'Salt 500g',price:50},{id:26,name:'Baking Flour 1kg',price:140},
    {id:27,name:'Baking Flour 2kg',price:270},{id:28,name:'Spaghetti 400g',price:120},
    {id:29,name:'Macaroni 400g',price:110},{id:30,name:'Tomato Paste 70g',price:55},
    {id:31,name:'Tomato Paste 150g',price:95},{id:32,name:'Royco Beef 75g',price:85},
    {id:33,name:'Royco Chicken 75g',price:85},{id:34,name:'Margarine 250g',price:140},
    {id:35,name:'Margarine 500g',price:260},{id:36,name:'Nescafe 200g',price:750},
    {id:37,name:'Ovaltine 400g',price:590},{id:38,name:'Milo 400g',price:620},
    {id:39,name:'Canned Tuna 185g',price:180},{id:40,name:'Canned Sardines',price:100},
    {id:41,name:'Honey 250ml',price:350},{id:42,name:'Jam Strawberry 400g',price:280},
    {id:43,name:'Peanut Butter 400g',price:320},{id:44,name:'Biscuits Digestive',price:95},
    {id:45,name:'Biscuits Cream',price:80},{id:46,name:'Matchboxes x10',price:70},
    {id:47,name:'Tissue Roll x4',price:180},{id:48,name:'Tissue Box',price:120},
    {id:49,name:'Garbage Bags x10',price:150},{id:50,name:'Washing Up Liquid 500ml',price:130},
  ]},
  pharmacy: { label:'Pharmacy', icon:'💊', products:[
    {id:101,name:'Panadol 500mg x8',price:50,tag:'OTC'},{id:102,name:'Panadol Extra x8',price:80,tag:'OTC'},
    {id:103,name:'Ibuprofen 400mg x8',price:80,tag:'OTC'},{id:104,name:'Aspirin 300mg x8',price:40,tag:'OTC'},
    {id:105,name:'Amoxicillin 250mg x21',price:320,tag:'POM'},{id:106,name:'Amoxicillin 500mg x21',price:580,tag:'POM'},
    {id:107,name:'Azithromycin 500mg x3',price:450,tag:'POM'},{id:108,name:'Ciprofloxacin 500mg',price:380,tag:'POM'},
    {id:109,name:'Metronidazole 400mg x21',price:280,tag:'POM'},{id:110,name:'Actifed Syrup 100ml',price:280,tag:'OTC'},
    {id:111,name:'ORS Sachet x5',price:100,tag:'OTC'},{id:112,name:'Coartem x24',price:850,tag:'POM'},
    {id:113,name:'Vitamin C 1000mg x30',price:480,tag:'OTC'},{id:114,name:'Vitamin C 500mg x30',price:280,tag:'OTC'},
    {id:115,name:'Dettol 250ml',price:320,tag:'OTC'},{id:116,name:'Thermometer Digital',price:850,tag:'OTC'},
    {id:117,name:'Bandage Crepe 10cm',price:150,tag:'OTC'},{id:118,name:'Plasters x10',price:80,tag:'OTC'},
    {id:119,name:'Cotton Wool 100g',price:120,tag:'OTC'},{id:120,name:'Surgical Spirit 100ml',price:90,tag:'OTC'},
    {id:121,name:'Hydrogen Peroxide 100ml',price:130,tag:'OTC'},{id:122,name:'Antihistamine 10mg x10',price:120,tag:'OTC'},
    {id:123,name:'Omeprazole 20mg x14',price:180,tag:'OTC'},{id:124,name:'Multivitamin x30',price:350,tag:'OTC'},
    {id:125,name:'Iron + Folate x30',price:220,tag:'OTC'},{id:126,name:'Metformin 500mg x30',price:280,tag:'POM'},
    {id:127,name:'Atorvastatin 20mg x30',price:650,tag:'POM'},{id:128,name:'Amlodipine 5mg x30',price:420,tag:'POM'},
    {id:129,name:'Salbutamol Inhaler',price:680,tag:'POM'},{id:130,name:'Cough Syrup 100ml',price:220,tag:'OTC'},
    {id:131,name:'Antifungal Cream 15g',price:280,tag:'OTC'},{id:132,name:'Pregnancy Test Kit',price:180,tag:'OTC'},
    {id:133,name:'Blood Glucose Strips x50',price:1200,tag:'OTC'},{id:134,name:'Face Mask x10',price:150,tag:'OTC'},
    {id:135,name:'Gloves Latex x10',price:200,tag:'OTC'},{id:136,name:'Folic Acid 5mg x30',price:150,tag:'OTC'},
    {id:137,name:'Calcium 500mg x30',price:280,tag:'OTC'},{id:138,name:'Omega-3 x30',price:550,tag:'OTC'},
    {id:139,name:'Eye Drops Lubricant',price:350,tag:'OTC'},{id:140,name:'Sunscreen SPF50 100ml',price:750,tag:'OTC'},
  ]},
  airbnb: { label:'Hospitality', icon:'🏠', products:[
    {id:201,name:'Single Room 1 Night',price:2500},{id:202,name:'Double Room 1 Night',price:4500},
    {id:203,name:'Deluxe Room 1 Night',price:6500},{id:204,name:'Full House 1 Night',price:8000},
    {id:205,name:'Villa 1 Night',price:15000},{id:206,name:'Airport Pickup',price:1500},
    {id:207,name:'Airport Drop-off',price:1500},{id:208,name:'Breakfast x1',price:800},
    {id:209,name:'Full Board x1 Day',price:2500},{id:210,name:'Extra Towels',price:200},
    {id:211,name:'Late Checkout Fee',price:1000},{id:212,name:'Early Check-in Fee',price:800},
    {id:213,name:'Laundry Service',price:500},{id:214,name:'City Tour 4hrs',price:3500},
    {id:215,name:'City Tour Full Day',price:6000},{id:216,name:'Pool Access',price:500},
    {id:217,name:'Gym Access',price:400},{id:218,name:'Spa 1hr',price:2500},
    {id:219,name:'Babysitting 4hrs',price:1200},{id:220,name:'Room Decoration',price:1500},
    {id:221,name:'Catering Service',price:5000},{id:222,name:'BBQ Package',price:3000},
    {id:223,name:'Conference Room Half-Day',price:5000},{id:224,name:'Conference Room Full Day',price:8000},
    {id:225,name:'Projector Rental',price:1000},
  ]},
  electronics: { label:'Electronics', icon:'🔌', products:[
    {id:301,name:'Smartphone Entry-level',price:8500},{id:302,name:'Smartphone Mid-range',price:18500},
    {id:303,name:'Smartphone Flagship',price:45000},{id:304,name:'Wireless Earbuds',price:4200},
    {id:305,name:'Wired Earphones',price:650},{id:306,name:'Bluetooth Speaker',price:2800},
    {id:307,name:'Portable Charger 10000mAh',price:1600},{id:308,name:'Portable Charger 20000mAh',price:2800},
    {id:309,name:'LED Desk Lamp',price:1050},{id:310,name:'Smartwatch',price:6800},
    {id:311,name:'Fitness Tracker',price:3500},{id:312,name:'USB-C Cable 1m',price:280},
    {id:313,name:'USB-C Cable 2m',price:380},{id:314,name:'Wall Charger 65W',price:1200},
    {id:315,name:'Wireless Charger Pad',price:1800},{id:316,name:'Phone Case Universal',price:350},
    {id:317,name:'Screen Protector',price:200},{id:318,name:'Memory Card 64GB',price:900},
    {id:319,name:'Memory Card 128GB',price:1600},{id:320,name:'Flash Drive 32GB',price:650},
    {id:321,name:'Flash Drive 64GB',price:950},{id:322,name:'Laptop Stand',price:1800},
    {id:323,name:'Wireless Mouse',price:1200},{id:324,name:'Keyboard Wireless',price:2200},
    {id:325,name:'HDMI Cable 2m',price:550},{id:326,name:'Extension Cable 4-way',price:850},
    {id:327,name:'Smart Plug',price:1200},{id:328,name:'LED Strip 5m',price:1500},
    {id:329,name:'Solar Lamp',price:2200},{id:330,name:'Digital Camera Basic',price:12000},
  ]},
  salon: { label:'Salon & Beauty', icon:'💇', products:[
    {id:401,name:'Haircut (Men)',price:850},{id:402,name:'Haircut (Women)',price:1200},
    {id:403,name:'Haircut (Kids)',price:500},{id:404,name:'Beard Trim',price:450},
    {id:405,name:'Beard Shape Up',price:650},{id:406,name:'Full Shave',price:700},
    {id:407,name:'Manicure',price:1200},{id:408,name:'Pedicure',price:1500},
    {id:409,name:'Manicure + Pedicure',price:2500},{id:410,name:'Gel Nails',price:2200},
    {id:411,name:'Acrylic Nails Full Set',price:3500},{id:412,name:'Facial Basic',price:2200},
    {id:413,name:'Facial Premium',price:4500},{id:414,name:'Blow Dry',price:700},
    {id:415,name:'Hair Wash & Blow Dry',price:1200},{id:416,name:'Hair Colour Single',price:2500},
    {id:417,name:'Hair Colour Full',price:4500},{id:418,name:'Highlights',price:5500},
    {id:419,name:'Braids Simple',price:1500},{id:420,name:'Braids Full Head',price:4500},
    {id:421,name:'Cornrows',price:1200},{id:422,name:'Relaxer Treatment',price:2200},
    {id:423,name:'Deep Conditioning',price:1500},{id:424,name:'Eyebrow Threading',price:300},
    {id:425,name:'Eyebrow Tinting',price:500},{id:426,name:'Eyelash Extensions',price:3500},
    {id:427,name:'Waxing (Legs)',price:1800},{id:428,name:'Waxing (Arms)',price:1200},
    {id:429,name:'Body Scrub',price:3000},{id:430,name:'Head Massage 30min',price:1500},
  ]},
  cafe: { label:'Cafe & Restaurant', icon:'☕', products:[
    {id:501,name:'Espresso Single',price:180},{id:502,name:'Espresso Double',price:280},
    {id:503,name:'Cappuccino',price:280},{id:504,name:'Latte',price:320},
    {id:505,name:'Flat White',price:300},{id:506,name:'Americano',price:220},
    {id:507,name:'Chai Tea',price:150},{id:508,name:'Masala Tea',price:180},
    {id:509,name:'Hot Chocolate',price:350},{id:510,name:'Smoothie Berry',price:390},
    {id:511,name:'Smoothie Tropical',price:420},{id:512,name:'Fresh Juice Orange',price:250},
    {id:513,name:'Fresh Juice Passion',price:250},{id:514,name:'Sandwich Club',price:420},
    {id:515,name:'Sandwich Chicken',price:480},{id:516,name:'Sandwich Tuna',price:400},
    {id:517,name:'Cake Slice',price:320},{id:518,name:'Muffin',price:180},
    {id:519,name:'Croissant',price:220},{id:520,name:'Breakfast Full',price:850},
    {id:521,name:'Breakfast Light',price:480},{id:522,name:'Avocado Toast',price:550},
    {id:523,name:'Pancakes x3',price:380},{id:524,name:'Waffles',price:420},
    {id:525,name:'Pasta Carbonara',price:680},{id:526,name:'Pizza Margherita',price:850},
    {id:527,name:'Pizza Pepperoni',price:950},{id:528,name:'Burger Classic',price:650},
    {id:529,name:'Burger Chicken',price:700},{id:530,name:'French Fries',price:280},
    {id:531,name:'Salad Garden',price:420},{id:532,name:'Salad Caesar',price:520},
    {id:533,name:'Soup of the Day',price:350},{id:534,name:'Mandazi x4',price:120},
    {id:535,name:'Samosa x3',price:150},{id:536,name:'Chips & Chicken',price:580},
    {id:537,name:'Ugali & Stew',price:350},{id:538,name:'Pilau (Plate)',price:480},
    {id:539,name:'Nyama Choma 200g',price:850},{id:540,name:'Tiramisu',price:450},
  ]},
  laundry: { label:'Laundry', icon:'👕', products:[
    {id:601,name:'Shirt Iron & Press',price:80},{id:602,name:'Trouser Iron & Press',price:100},
    {id:603,name:'Suit Dry Clean',price:850},{id:604,name:'Dress Dry Clean',price:650},
    {id:605,name:'Bedsheet Wash & Iron',price:250},{id:606,name:'Duvet Clean',price:700},
    {id:607,name:'Shoes Clean',price:300},{id:608,name:'Leather Jacket Clean',price:1200},
    {id:609,name:'Express Laundry 2kg',price:450},{id:610,name:'Standard Laundry 5kg',price:800},
  ]},
  hardware: { label:'Hardware', icon:'🔧', products:[
    {id:701,name:'Hammer',price:650},{id:702,name:'Screwdriver Set',price:850},
    {id:703,name:'Measuring Tape 5m',price:380},{id:704,name:'Spirit Level',price:550},
    {id:705,name:'Paint Roller',price:350},{id:706,name:'Paint Brush Set',price:280},
    {id:707,name:'Wall Paint 4L White',price:1800},{id:708,name:'Gloss Paint 1L',price:650},
    {id:709,name:'Cement Bag 50kg',price:950},{id:710,name:'Nails 1kg Assorted',price:280},
    {id:711,name:'Wood Screws x50',price:220},{id:712,name:'PVC Pipe 2m',price:320},
    {id:713,name:'Electrical Wire 1m',price:120},{id:714,name:'Light Switch',price:180},
    {id:715,name:'Door Lock',price:1200},{id:716,name:'Padlock',price:350},
    {id:717,name:'Sandpaper Sheet x5',price:150},{id:718,name:'Glue Gun',price:550},
    {id:719,name:'Safety Gloves',price:320},{id:720,name:'Safety Goggles',price:450},
  ]},
}

export const TODAY = new Date().toISOString().slice(0, 10)

export const defaultSales = (days = 7) => {
  const d = []
  for (let i = days - 1; i >= 0; i--) {
    const x = new Date()
    x.setDate(x.getDate() - i)
    d.push({ date: x.toISOString().slice(0, 10), revenue: 0 })
  }
  return d
}

export const TIERS = [
  { name: 'Bronze', min: 0, disc: 0, color: '#cd7f32' },
  { name: 'Silver', min: 500, disc: 5, color: '#c0c0c0' },
  { name: 'Gold', min: 1500, disc: 10, color: '#ffd700' },
  { name: 'Platinum', min: 5000, disc: 15, color: '#e5e4e2' }
]
export const getTier = p => [...TIERS].reverse().find(t => p >= t.min)

export const NICHES = {
  all: Object.keys(categories),
  retail: ['shop', 'laundry', 'hardware'],
  food: ['cafe'],
  health: ['pharmacy'],
  services: ['airbnb', 'salon'],
  tech: ['electronics']
}
const PAGE_SIZE    = 10
const MPESA_TIMEOUT= 30 // seconds

// ─── LOGIN PORTAL ─────────────────────────────────────────────────────────────
function LoginPortal({ onLogin, darkMode, toggleDark }) {
  const [step, setStep]         = useState('select')
  const [selUser, setSelUser]   = useState(null)
  const [pin, setPin]           = useState('')
  const [tfaCode, setTfaCode]   = useState('')
  const [entered2FA, set2FA]    = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const role = selUser ? ROLES[selUser.role] : null

  const selectUser = u => { setSelUser(u); setPin(''); setError(''); setStep('pin') }

  const handlePin = d => {
    if(pin.length>=4) return
    const np = pin+d
    setPin(np)
    if(np.length===4) {
      setTimeout(()=>{
        if(np===selUser.pin){
          const c = String(Math.floor(100000+Math.random()*900000))
          setTfaCode(c); set2FA(''); setError(''); setStep('2fa')
        } else { setError('Incorrect PIN. Try again.'); setPin('') }
      },200)
    }
  }

  const verify2FA = () => {
    if(entered2FA===tfaCode) onLogin(selUser)
    else { setError('Invalid verification code.'); set2FA('') }
  }

  const doBiometric = async () => {
    setLoading(true); setError('')
    try {
      if(window.PublicKeyCredential) {
        await navigator.credentials.get({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),timeout:60000,allowCredentials:[],userVerification:'preferred'}})
      }
      onLogin(selUser)
    } catch(e) {
      if(e.name==='NotAllowedError') setError('Biometric cancelled or not enrolled.')
      else onLogin(selUser)
    }
    setLoading(false)
  }

  return (
    <div className="login-portal">
      <div className="login-aura" aria-hidden="true"/>
      <div className="login-shell">
        <section className="login-showcase" aria-label="BerylBytes overview">
          <div className="login-showcase-top">
            <img src="/logo.png" alt="" className="login-mark"
            onError={e=>{e.target.style.display='none'; const fb=e.target.nextSibling; if(fb) fb.style.display='flex'}}/>
            <div className="brand-logo-fb login-mark-fb" style={{display:'none'}}>B</div>
            <div>
              <div className="login-brand">Beryl<em>Bytes</em></div>
              <div className="login-brand-sub">Enterprise Point of Sale</div>
            </div>
          </div>
          <div className="login-copy">
            <span className="login-kicker">Retail Operating System for modern teams. 
              Your POS Control Starts Here — Log In</span>
            <h1>Run sales, stock, customers, and payments from one calm dashboard.</h1>
            <p>Fast checkout, role-based access, receipts, M-Pesa, Paystack, PayPal, inventory, and reports built into a single POS workspace.</p>
          </div>
          <div className="login-metrics">
            <div><strong>8</strong><span>Roles</span></div>
            <div><strong>240+</strong><span>Items</span></div>
            <div><strong>24/7</strong><span>Sync</span></div>
          </div>
        </section>

        <div className="login-box" role="main" aria-label="BerylBytes Login">
          <div className="login-logo">
            <div className="login-card-eyebrow">Welcome back</div>
            <h2 className="login-card-title">Sign in to your workspace</h2>
            <p className="login-card-sub">Choose a team account, then verify with PIN and 2FA.</p>
          </div>

        {step==='select' && (<>
          <div className="login-methods" aria-label="Sign in methods">
            <button className="login-method active" type="button">Team PIN</button>
            <button className="login-method" type="button">Passkey</button>
          </div>
          <label className="login-field">
            <span>Workspace</span>
            <input value="beryl_bytes_global" readOnly aria-label="Workspace"/>
          </label>
          <h3 className="login-title">Select Account</h3>
          <div className="user-sel-grid" role="listbox" aria-label="User accounts">
            {SYSTEM_USERS.map(u=>(
              <button key={u.id} className="usc" onClick={()=>selectUser(u)} role="option" aria-label={`${u.name} — ${ROLES[u.role].label}`} tabIndex={0}>
                <div className="usc-av" style={{background:ROLES[u.role].color}}>{u.initial}</div>
                <div className="usc-name">{u.name}</div>
                <div className="usc-role">{ROLES[u.role].label}</div>
              </button>
            ))}
          </div>
        </>)}

        {step==='pin' && selUser && (<>
          <button className="login-back" onClick={()=>{setStep('select');setPin('');setError('')}} aria-label="Go back">
            <SvgIcon icon="arrow_l"/><span>Back</span>
          </button>
          <div className="login-user-preview" aria-live="polite">
            <div className="lup-av" style={{background:role.color}}>{selUser.initial}</div>
            <div><div className="lup-name">{selUser.name}</div><div className="lup-role">{role.label}</div></div>
          </div>
          <h2 className="login-title">Enter PIN</h2>
          <div className="pin-dots" role="status" aria-label={`${pin.length} of 4 digits entered`}>
            {[0,1,2,3].map(i=><div key={i} className={`pin-dot ${pin.length>i?'filled':''}`}/>)}
          </div>
          {error && <div className="login-error" role="alert">{error}</div>}
          <div className="pin-pad" role="group" aria-label="PIN keypad">
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d,i)=>(
              <button key={i} className={`pin-key ${!d?'empty':''}`} aria-label={d==='⌫'?'Backspace':d||''}
                onClick={()=>d==='⌫'?setPin(p=>p.slice(0,-1)):d&&handlePin(d)}>
                {d}
              </button>
            ))}
          </div>
          <button className="bio-btn" onClick={doBiometric} enabled={loading} aria-label="Sign in with biometric or passkey">
            <SvgIcon icon="fingerprint" size={16}/>
            {loading?'Authenticating…':'Biometric / Passkey Sign In'}
          </button>
          <p style={{textAlign:'center',fontSize:10,color:'var(--text3)',marginTop:12}}>Demo PINs — Admin: 1234 · Cashier: 3456 · Inventory: 5678</p>
        </>)}

        {step==='2fa' && (<>
          <button className="login-back" onClick={()=>{setStep('pin');setPin('');setError('')}} aria-label="Go back">
            <SvgIcon icon="arrow_l"/><span>Back</span>
          </button>
          <h2 className="login-title">Two-Factor Verification</h2>
          <p className="login-desc">Enter the 6-digit code sent to your registered device.<br/><strong style={{color:'var(--accent)'}}>Demo code: {tfaCode}</strong></p>
          <input className="twofa-input" placeholder="000000" maxLength={6} value={entered2FA}
            onChange={e=>set2FA(e.target.value.replace(/\D/g,''))} onKeyDown={e=>e.key==='Enter'&&verify2FA()}
            autoFocus aria-label="6-digit verification code"/>
          {error && <div className="login-error" role="alert">{error}</div>}
          <button className="login-submit" onClick={verify2FA} disabled={entered2FA.length!==6} aria-label="Verify and sign in">
            Verify and Sign In
          </button>
          <button className="login-resend" onClick={()=>{const c=String(Math.floor(100000+Math.random()*900000));setTfaCode(c);set2FA('');setError('')}} aria-label="Resend code">
            <SvgIcon icon="refresh" size={11}/>Resend Code
          </button>
        </>)}

        <div className="login-footer">
          <button onClick={toggleDark} style={{background:'none',border:'1px solid var(--border2)',borderRadius:7,padding:'4px 10px',color:'var(--text2)',fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',gap:5,fontFamily:'DM Sans,sans-serif'}}>
            {darkMode?<><SvgIcon icon="sun" size={12}/>Light Mode</>:<><SvgIcon icon="moon" size={12}/>Dark Mode</>}
          </button>
          <span>BerylBytes POS v4.4.0</span>
        </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const PAYSTACK_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || ''
  const PAYPAL_ID    = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'sb'
  const API_URL      = process.env.REACT_APP_API_URL || 'http://localhost:3000'

  // Auth
  const [loggedIn,setLoggedIn]         = useState(false)
  const [currentUser,setCurrentUser]   = useState(null)
  const [showUserMenu,setShowUserMenu] = useState(false)

  // App state
  const [darkMode,setDarkMode]         = useState(true)
  const [loaded,setLoaded]             = useState(false)
  const [view,setView]                 = useState('pos')
  const [niche,setNiche]               = useState('all')
  const [activeCat,setActiveCat]       = useState('shop')
  const [search,setSearch]             = useState('')
  const [cartOpen,setCartOpen]         = useState(false)
  const [schemaBanner,setSchemaBanner] = useState(false)

  // Cart (persisted)
  const [cart,setCart]                 = useState(()=>{try{return JSON.parse(localStorage.getItem('bb_cart')||'[]')}catch{return[]}})
  const [selCust,setSelCust]           = useState(null)
  const [customPrices,setCustomPrices] = useState({})
  const [customItems,setCustomItems]   = useState([])
const [newItem,setNewItem]           = useState({name:'',price:'',category:'shop',icon:''})
  const [customCats,setCustomCats]       = useState(()=>{try{return JSON.parse(localStorage.getItem('bb_custom_cats')||'[]')}catch{return[]}})
  const [showAddCat,setShowAddCat]     = useState(false)
  const [newCat,setNewCat]             = useState({label:'',icon:'🏪',id:''})
  const [outOfStockIds,setOutOfStockIds] = useState(()=>{try{return JSON.parse(localStorage.getItem('bb_oos')||'[]')}catch{return[]}})
  const [showOutOfStock,setShowOutOfStock] = useState(false)

  // Payment
  const [showPay,setShowPay]           = useState(false)
  const [payMethod,setPayMethod]       = useState('mpesa')
  const [phone,setPhone]               = useState('')
  const [phoneConfirmed,setPhoneConfirmed] = useState(false)
  const [cashIn,setCashIn]             = useState('')
  const [custEmail,setCustEmail]       = useState('')
  const [msg,setMsg]                   = useState('')
  const [msgType,setMsgType]           = useState('info')

  // M-Pesa
  const [mpesaStatus,setMpesaStatus]   = useState(null)
  const [lastCheckoutId,setLastCheckoutId] = useState(null)
  const [mpesaTimer,setMpesaTimer]     = useState(MPESA_TIMEOUT)
  const [attempts,setAttempts]         = useState([])
  const timerRef                       = useRef(null)
  const pollRef                        = useRef(null)

  // Data (all start at zero)
  const [salesData,setSalesData]       = useState(defaultSales())
  const [totalRev,setTotalRev]         = useState(0)
  const [totalOrders,setTotalOrders]   = useState(0)
  const [ledger,setLedger]             = useState([])
  const [expenses,setExpenses]         = useState([])
  const [newExp,setNewExp]             = useState({desc:'',amount:'',category:''})
  const [showAddExp,setShowAddExp]     = useState(false)
  const [inventory,setInventory]       = useState([])
  const [newInv,setNewInv]             = useState({name:'',sku:'',category:'General',retailPrice:'',buyingPrice:'',stockLevel:'',minAlert:'',expiry:'',batch:''})
  const [showAddInv,setShowAddInv]     = useState(false)
  const [customers,setCustomers]       = useState([])
  const [newCust,setNewCust]           = useState({name:'',email:'',phone:''})
  const [showAddCust,setShowAddCust]   = useState(false)
  const [crmQ,setCrmQ]                 = useState('')

  // Transactions list features
  const [txnSearch,setTxnSearch]       = useState('')
  const [txnStatus,setTxnStatus]       = useState('all')
  const [txnPage,setTxnPage]           = useState(1)
  const [selTxns,setSelTxns]           = useState([])
  const [detailTxn,setDetailTxn]       = useState(null)
  const [expandedCard,setExpandedCard] = useState(null)

  // Receipt
  const [showReceipt,setShowReceipt]   = useState(false)
  const [receiptData,setReceiptData]   = useState(null)

  // Edit product price
  const [editProd,setEditProd]         = useState('')
  const [editPrice,setEditPrice]       = useState('')

  // Bug reports
  const [showReport,setShowReport]     = useState(false)
  const [reportText,setReportText]     = useState('')
  const [reportCats,setReportCats]     = useState([])
  const [reportScreenshot,setReportScreenshot] = useState(null)
  const [bugReports,setBugReports]     = useState([])
  const [managerFilters,setManagerFilters] = useState({status:'all',role:'all',cat:'all',search:''})

  // Settings payment keys
  const [paystackKeyState,setPaystackKeyState] = useState(PAYSTACK_KEY)
  const [mpesaShortcode,setMpesaShortcode]     = useState(process.env.REACT_APP_MPESA_SHORTCODE||'174379')

  const langState   = useState('English (Kenya)')
  const [lang,setLang] = langState
  const [syncOn,setSyncOn]     = useState(true)
  const [bioOn,setBioOn]       = useState(false)
  const [alertsOn,setAlertsOn] = useState(true)

  // Init
  useEffect(()=>{ setTimeout(()=>setLoaded(true),100) },[])
  useEffect(()=>{ document.documentElement.className=darkMode?'':'light' },[darkMode])

  // Persist cart
  useEffect(()=>{ try{localStorage.setItem('bb_cart',JSON.stringify(cart))}catch{} },[cart])
  useEffect(()=>{ try{localStorage.setItem('bb_oos',JSON.stringify(outOfStockIds))}catch{} },[outOfStockIds])

  // Close user menu
  useEffect(()=>{
    if(!showUserMenu) return
    const h=()=>setShowUserMenu(false)
    setTimeout(()=>document.addEventListener('click',h),0)
    return()=>document.removeEventListener('click',h)
  },[showUserMenu])

  // M-Pesa countdown timer
  useEffect(()=>{
    if(mpesaStatus!=='pending') { clearInterval(timerRef.current); return }
    setMpesaTimer(MPESA_TIMEOUT)
    timerRef.current = setInterval(()=>{
      setMpesaTimer(t=>{
        if(t<=1){
          clearInterval(timerRef.current)
          setMpesaStatus('timeout')
          clearInterval(pollRef.current)
          return 0
        }
        return t-1
      })
    },1000)
    return()=>clearInterval(timerRef.current)
  },[mpesaStatus])

  // M-Pesa poll
  useEffect(()=>{
    if(!lastCheckoutId || mpesaStatus!=='pending') return
    pollRef.current = setInterval(async()=>{
      try{
        const res = await fetch(`${API_URL}/api/mpesa/status/${lastCheckoutId}`)
        const data = await res.json()
        if(data.status==='success'){
          clearInterval(pollRef.current); clearInterval(timerRef.current)
          setMpesaStatus('success')
          setAttempts(a=>a.map(x=>x.id===lastCheckoutId?{...x,status:'success'}:x))
          setTimeout(()=>completeSale('M-Pesa'),800)
        } else if(data.status==='failed'){
          clearInterval(pollRef.current); clearInterval(timerRef.current)
          setMpesaStatus('failed')
          setAttempts(a=>a.map(x=>x.id===lastCheckoutId?{...x,status:'failed'}:x))
          flash('M-Pesa payment failed. Retry?','error')
        }
      }catch{}
    },3000)
    return()=>clearInterval(pollRef.current)
  },[lastCheckoutId,mpesaStatus])

  const canAccess = s => ROLES[currentUser?.role]?.access?.includes(s)
  const canEdit   = () => ROLES[currentUser?.role]?.canEdit
  const flash     = (m,t='success')=>{ setMsg(m);setMsgType(t);setTimeout(()=>setMsg(''),5000) }

  const handleLogin = u => {
    setCurrentUser(u); setLoggedIn(true)
    setView(ROLES[u.role].access[0])
  }
  const handleLogout = ()=>{ setLoggedIn(false);setCurrentUser(null);setCart([]);setShowUserMenu(false);localStorage.removeItem('bb_cart') }

  // Cart
  const getPrice = p => customPrices[p.id]||p.price
  const addToCart = p => {
    if(outOfStockIds.includes(p.id)){
      flash(`${p.name} is marked out of stock.`, 'error')
      return
    }
    setCart(prev=>{
      const ex=prev.find(i=>i.id===p.id)
      return ex?prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...prev,{...p,price:getPrice(p),qty:1}]
    })
    if(window.innerWidth<900) setCartOpen(true)
  }
  const markOutOfStock = p => {
    setOutOfStockIds(ids=>ids.includes(p.id)?ids:[...ids,p.id])
    setCart(items=>items.filter(i=>i.id!==p.id))
    flash(`${p.name} removed from sale until restocked.`)
    setEditProd(null)
  }
  const restoreStock = p => {
    setOutOfStockIds(ids=>ids.filter(id=>id!==p.id))
    flash(`${p.name} is back in stock.`)
    setEditProd(null)
  }
  const remFromCart = id=>setCart(c=>c.filter(i=>i.id!==id))
  const updQty = (id,d)=>setCart(c=>c.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+d)}:i))

  const loyaltyDisc = selCust ? getTier(selCust.points).disc/100 : 0
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0)
  const discount = Math.round(subtotal*loyaltyDisc)
  const afterDisc = subtotal-discount
  const tax = Math.round(afterDisc*0.16)
  const grand = afterDisc+tax
  const change = cashIn ? parseInt(cashIn)-grand : 0

  const completeSale = useCallback((method,extra={})=>{
    const invId=`INV-${String(ledger.length+1001).padStart(4,'0')}`
    const entry={
      id:invId,
      date:new Date().toLocaleDateString('en-KE',{day:'2-digit',month:'short',year:'numeric'}),
      timestamp: new Date().toISOString(),
      customer:selCust?.name||'Walk-in',
      total:grand,method,status:'Paid',
      items:[...cart],
      auditTrail:[
        {status:'initiated',time:new Date().toISOString(),desc:'Sale initiated'},
        {status:'success',time:new Date().toISOString(),desc:`Payment via ${method} confirmed`},
      ],
      reviewed:false,
      ...extra,
    }
    setLedger(p=>[entry,...p])
    setSalesData(p=>p.map(d=>d.date===TODAY?{...d,revenue:d.revenue+grand}:d))
    setTotalRev(p=>p+grand); setTotalOrders(p=>p+1)
    if(selCust){
      const pts=Math.floor(grand/100)
      setCustomers(p=>p.map(c=>c.id===selCust.id?{...c,points:c.points+pts,visits:c.visits+1,totalSpent:(c.totalSpent||0)+grand}:c))
    }
    setReceiptData({method,amount:grand,items:[...cart],invoiceId:invId,change:extra.change,customer:selCust?.name})
    setShowReceipt(true)
    setCart([]); setShowPay(false); setPhone(''); setPhoneConfirmed(false); setCashIn(''); setSelCust(null)
    setMpesaStatus(null); setLastCheckoutId(null); setAttempts([]); setMpesaTimer(MPESA_TIMEOUT)
    localStorage.removeItem('bb_cart')
  },[cart,grand,ledger,selCust])

  const handleMpesa = async () => {
    if(!phone){ flash('Enter customer phone number','error'); return }
    setPhoneConfirmed(true)
    flash('Sending prompt to customer phone…','loading')
    const attemptId = 'TX-'+Date.now()
    const newAttempt = {id:attemptId, status:'pending', time:new Date().toLocaleTimeString('en-KE'), desc:'STK Push sent'}
    setAttempts(a=>[...a,newAttempt])
    setMpesaStatus('pending')
    try {
      const res = await fetch(`${API_URL}/api/mpesa/stkpush`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone,amount:grand})})
      const data = await res.json()
      if(data.ResponseCode==='0'){
        setLastCheckoutId(data.CheckoutRequestID||attemptId)
        setAttempts(a=>a.map(x=>x.id===attemptId?{...x,id:data.CheckoutRequestID||attemptId}:x))
      } else {
        setMpesaStatus('failed')
        setAttempts(a=>a.map(x=>x.id===attemptId?{...x,status:'failed',desc:data.errorMessage||'Request rejected'}:x))
        flash('Payment request failed. Retry?','error')
      }
    } catch {
      // Demo: simulate success after 4s
      setLastCheckoutId(attemptId)
      setTimeout(()=>{
        setMpesaStatus('success')
        setAttempts(a=>a.map(x=>x.id===attemptId?{...x,status:'success',desc:'Payment confirmed'}:x))
        completeSale('M-Pesa')
      },4000)
    }
  }

  const retryMpesa = () => {
    setMpesaStatus(null); setLastCheckoutId(null)
    clearInterval(timerRef.current); clearInterval(pollRef.current)
    setMpesaTimer(MPESA_TIMEOUT)
    handleMpesa()
  }

  const handleCash = () => { if(!cashIn||change<0){flash('Insufficient cash','error');return}; completeSale('Cash',{change}) }
  const handlePaystack = () => {
    if(typeof window.PaystackPop==='undefined'){flash('Paystack not loaded','error');return}
    const h=window.PaystackPop.setup({
      key:paystackKeyState||PAYSTACK_KEY,
      email:custEmail||'customer@berylbytes.co.ke',
      amount:grand*100,currency:'KES',ref:'POS-'+Date.now(),
      callback:r=>completeSale('Paystack',{ref:r.reference}),
      onClose:()=>flash('Payment cancelled','error'),
    })
    h.openIframe()
  }

  // PDF
  const generatePDF = () => {
    if(!receiptData) return
    const doc=new jsPDF(); let y=20
    doc.setFontSize(20);doc.setFont('helvetica','bold');doc.text('BERYLBYTES POS',20,y);y+=9
    doc.setFontSize(9);doc.setFont('helvetica','normal');doc.text('berylbytes.co.ke | berylmunyao8@gmail.com',20,y);y+=6
    doc.line(20,y,190,y);y+=6
    doc.text(`Invoice: ${receiptData.invoiceId}`,20,y);doc.text(`Date: ${new Date().toLocaleString('en-KE')}`,110,y);y+=6
    doc.text(`Customer: ${receiptData.customer||'Walk-in'}`,20,y);doc.text(`Method: ${receiptData.method}`,110,y);y+=8
    doc.line(20,y,190,y);y+=5
    doc.setFont('helvetica','bold');doc.text('ITEM',20,y);doc.text('QTY',120,y);doc.text('UNIT',140,y);doc.text('TOTAL',165,y);y+=5
    doc.line(20,y,190,y);y+=5;doc.setFont('helvetica','normal')
    receiptData.items.forEach(item=>{doc.text(item.name.substring(0,32),20,y);doc.text(String(item.qty),122,y);doc.text(`KES ${item.price.toLocaleString()}`,135,y);doc.text(`KES ${(item.price*item.qty).toLocaleString()}`,162,y);y+=6})
    y+=2;doc.line(20,y,190,y);y+=6
    const sub=receiptData.items.reduce((s,i)=>s+i.price*i.qty,0)
    doc.text('Subtotal:',130,y);doc.text(`KES ${sub.toLocaleString()}`,162,y);y+=6
    doc.text('VAT 16%:',130,y);doc.text(`KES ${Math.round(sub*0.16).toLocaleString()}`,162,y);y+=6
    doc.setFont('helvetica','bold');doc.text('TOTAL:',130,y);doc.text(`KES ${receiptData.amount.toLocaleString()}`,162,y);y+=6
    if(receiptData.change){doc.setFont('helvetica','normal');doc.text('Change:',130,y);doc.text(`KES ${receiptData.change.toLocaleString()}`,162,y);y+=6}
    y+=4;doc.line(20,y,190,y);y+=6;doc.setFontSize(8);doc.text('Thank you for shopping at BerylBytes.',20,y)
    doc.save(`${receiptData.invoiceId}.pdf`)
  }

  // Export transactions
  const exportTxns = (selected) => {
    const rows = selected.length ? selected : filteredLedger
    const csv = ['Invoice,Date,Customer,Amount,Method,Status',
      ...rows.map(r=>`${r.id},${r.date},${r.customer},${r.total},${r.method},${r.status}`)
    ].join('\n')
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='transactions.csv'; a.click()
  }

  const markReviewed = ids => {
    setLedger(p=>p.map(r=>ids.includes(r.id)?{...r,reviewed:true,status:'Reviewed'}:r))
    setSelTxns([])
    flash(`${ids.length} transaction(s) marked as reviewed`)
  }

  // Bug report
  const submitReport = () => {
    if(!reportText) return
    const sig = `${currentUser.role}:${view}:${reportText.slice(0,40)}`
    const dup = bugReports.find(r=>r.sig===sig)
    const entry = {
      id:'BR-'+Date.now(), sig, role:currentUser.role, user:currentUser.name,
      page:view, categories:reportCats, text:reportText,
      screenshot:reportScreenshot, time:new Date().toISOString(),
      status:'open', dupOf: dup?.id||null, dupCount: dup ? (dup.dupCount||1)+1 : 1,
    }
    if(dup) {
      setBugReports(p=>p.map(r=>r.id===dup.id?{...r,dupCount:(r.dupCount||1)+1}:r))
      flash('Similar report already exists — linked to master report.')
    } else {
      setBugReports(p=>[entry,...p])
      flash('Report submitted. Thank you.')
    }
    navigator.clipboard?.writeText(`BerylBytes Bug Report\nUser: ${currentUser.name} (${ROLES[currentUser.role].label})\nPage: ${view}\nCategories: ${reportCats.join(', ')}\n\nIssue:\n${reportText}`)
    setShowReport(false); setReportText(''); setReportCats([]); setReportScreenshot(null)
  }

  // Computed
  const fKES=v=>`KES ${(v||0).toLocaleString()}`
  const totalExp=expenses.reduce((s,e)=>s+e.amount,0)
  const netProfit=totalRev-totalExp
  const maxBar=Math.max(...salesData.map(d=>d.revenue),1)
  const visCats=NICHES[niche]||Object.keys(categories)
  const allProds=[...(categories[activeCat]?.products??[]),...customItems.filter(i=>i.category===activeCat)]
  const products=allProds.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())&&visCats.includes(activeCat)&&(showOutOfStock||!outOfStockIds.includes(p.id)))
  const totalProds=Object.values(categories).reduce((s,c)=>s+c.products.length,0)+customItems.length

  // Filtered ledger
  const filteredLedger = ledger.filter(r=>{
    const q=txnSearch.toLowerCase()
    const matchQ=!q||(r.id.toLowerCase().includes(q)||r.customer.toLowerCase().includes(q)||r.method.toLowerCase().includes(q))
    const matchS=txnStatus==='all'||(txnStatus==='paid'&&r.status==='Paid')||(txnStatus==='reviewed'&&r.status==='Reviewed')
    return matchQ&&matchS
  })
  const totalPages=Math.max(1,Math.ceil(filteredLedger.length/PAGE_SIZE))
  const pagedLedger=filteredLedger.slice((txnPage-1)*PAGE_SIZE,txnPage*PAGE_SIZE)

  // Nav
  const NAV_ITEMS = [
    {id:'pos',icon:'pos',label:'Point of Sale'},
    {id:'dashboard',icon:'dashboard',label:'Dashboard'},
    {id:'crm',icon:'crm',label:'CRM & Loyalty',badge:customers.length||null},
    {id:'orders',icon:'inventory',label:'Inventory'},
    {id:'add',icon:'add',label:'Add Item'},
    {id:'payments',icon:'payments',label:'Payment Settings'},
    {id:'manager',icon:'reports',label:'Bug Reports',badge:bugReports.filter(r=>r.status==='open').length||null},
    {id:'settings',icon:'settings',label:'Settings'},
    {id:'support',icon:'support',label:'Support'},

  ].filter(item=>canAccess(item.id))

  if(!loggedIn) return <LoginPortal onLogin={handleLogin} darkMode={darkMode} toggleDark={()=>setDarkMode(!darkMode)}/>

  return (
    <PayPalScriptProvider options={{'client-id':PAYPAL_ID}}>
      <div className="bg-canvas"><div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/></div>

      {schemaBanner && (
        <div className="schema-banner" role="alert" aria-live="polite">
          <SvgIcon icon="alert" size={13}/>
          <div style={{flex:1}}>Schema cache retry in progress — some features may be slower.</div>
          <button className="sb-action" onClick={()=>window.location.reload()}>Retry Now</button>
          <button className="sb-close" onClick={()=>setSchemaBanner(false)} aria-label="Dismiss">×</button>
        </div>
      )}

      <div className={`shell ${loaded?'in':''}`} style={{paddingTop:schemaBanner?36:0}}>

        {/* TOPBAR */}
        <header className="topbar" role="banner">
          <div className="brand" onClick={()=>canAccess('dashboard')&&setView('dashboard')} role="link" aria-label="BerylBytes — Go to dashboard" tabIndex={0} onKeyDown={e=>e.key==='Enter'&&canAccess('dashboard')&&setView('dashboard')}>
            <img src="/logo.png" alt="BerylBytes logo" className="brand-logo-img" onError={e=>{e.target.style.display='none';const fb=e.target.nextSibling;if(fb)fb.style.display='flex'}}/>
            <div className="brand-logo-fb" style={{display:'none'}}>B</div>
            <div className="brand-text">
              <span className="brand-name">Beryl<em>Bytes</em></span>
              <span className="brand-sub">POS System</span>
            </div>
          </div>

          <nav className="niche-bar" aria-label="Business niche filter">
            {[{id:'all',label:'All'},{id:'retail',label:'Retail'},{id:'food',label:'Food & Cafe'},{id:'health',label:'Health'},{id:'services',label:'Services'},{id:'tech',label:'Electronics'}]
              .map(n=>(
                <button key={n.id} className={`niche-pill ${niche===n.id?'act':''}`} aria-pressed={niche===n.id}
                  onClick={()=>{setNiche(n.id);const c=NICHES[n.id];if(!c.includes(activeCat))setActiveCat(c[0])}}>
                  {n.label}
                </button>
              ))}
          </nav>

          <div className="topbar-right">
            <div className="search-box" role="search">
              <span className="si" aria-hidden="true"><SvgIcon icon="search" size={13}/></span>
              <input placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)} aria-label="Search products"/>
            </div>
            <div className="live-dot" title="System live" aria-label="System is live"/>
            <div className="topbar-stat" aria-label={`Revenue ${fKES(totalRev)}`}>
              <span className="topbar-stat-val">{fKES(totalRev)}</span>
              <span className="topbar-stat-lbl">Revenue</span>
            </div>
            <div className="topbar-stat" aria-label={`${totalOrders} orders`}>
              <span className="topbar-stat-val">{totalOrders}</span>
              <span className="topbar-stat-lbl">Orders</span>
            </div>
            <button className="icon-btn" onClick={()=>setDarkMode(!darkMode)} aria-label={darkMode?'Switch to light mode':'Switch to dark mode'}>
              <SvgIcon icon={darkMode?'sun':'moon'} size={14}/>
            </button>

            {/* USER SWITCHER */}
            <div className="user-sw" onClick={e=>e.stopPropagation()}>
              <button className="user-btn" onClick={()=>setShowUserMenu(!showUserMenu)} aria-label="User menu" aria-expanded={showUserMenu} aria-haspopup="listbox">
                <div className="u-av" style={{background:ROLES[currentUser.role].color}}>{currentUser.initial}</div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
                  <span className="u-name">{currentUser.name}</span>
                  <span className="u-role">{ROLES[currentUser.role].label}</span>
                </div>
                <span className="u-chev" aria-hidden="true">{showUserMenu?'▲':'▼'}</span>
              </button>
              {showUserMenu && (
                <div className="user-dd" role="listbox" aria-label="Switch user">
                  <div className="user-dd-hd">Switch Account</div>
                  {SYSTEM_USERS.map(u=>(
                    <div key={u.id} className={`u-opt ${currentUser.id===u.id?'act-u':''}`} role="option" aria-selected={currentUser.id===u.id} onClick={()=>{handleLogin(u);setShowUserMenu(false)}} tabIndex={0} onKeyDown={e=>e.key==='Enter'&&handleLogin(u)}>
                      <div className="u-opt-av" style={{background:ROLES[u.role].color}}>{u.initial}</div>
                      <div className="u-opt-info">
                        <span className="u-opt-name">{u.name}</span>
                        <span className="u-opt-role">{ROLES[u.role].label}</span>
                      </div>
                      {currentUser.id===u.id && <div className="u-act-dot" aria-label="Current user"/>}
                    </div>
                  ))}
                  <div className="logout-opt" onClick={handleLogout} role="button" tabIndex={0} onKeyDown={e=>e.key==='Enter'&&handleLogout()} aria-label="Sign out">
                    <SvgIcon icon="logout" size={14}/>Sign Out
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* SIDEBAR */}
        <aside className="sidebar" role="navigation" aria-label="Main navigation">
          <div className="sb-sec">
            <span className="sb-lbl">Navigation</span>
            {NAV_ITEMS.map(item=>(
              <button key={item.id} className={`nav-btn ${view===item.id?'act':''}`} onClick={()=>setView(item.id)} aria-current={view===item.id?'page':undefined} aria-label={item.label}>
                <SvgIcon icon={item.icon} size={14}/>
                {item.label}
                {item.badge>0 && <span className="nb-badge" aria-label={`${item.badge} items`}>{item.badge}</span>}
              </button>
            ))}
          </div>
          {view==='pos' && (<>
            <div className="sb-div"/>
            <div className="sb-sec">
              <span className="sb-lbl">Categories</span>
              {Object.entries(categories).filter(([k])=>visCats.includes(k)).map(([k,v])=>(
                <button key={k} className={`cat-btn ${activeCat===k?'act':''}`} onClick={()=>{setActiveCat(k);setSearch('')}} aria-pressed={activeCat===k}>
                  <div className="cat-dot"/>
                  {v.label}
                </button>
              ))}
            </div>
          </>)}
          <div className="sb-foot">
            <div className="sb-stat"><span>Products</span><strong>{totalProds}</strong></div>
            <div className="sb-stat"><span>Customers</span><strong>{customers.length}</strong></div>
            <div className="sb-stat"><span>Transactions</span><strong>{ledger.length}</strong></div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <main className="content" id="main-content" aria-label="Main content">

            {/* POS */}
            {view==='pos' && (<>
              {activeCat==='pharmacy' && <div className="ph-warn" role="alert"><SvgIcon icon="alert" size={13}/>POM items require a valid prescription before dispensing. {canEdit()&&' Click the edit icon to update prices.'}</div>}
              {canEdit() && outOfStockIds.length>0 && (
                <div className="stock-filter-bar">
                  <span>{outOfStockIds.length} product{outOfStockIds.length===1?'':'s'} hidden as out of stock</span>
                  <button className={`stock-filter-toggle ${showOutOfStock?'on':''}`} onClick={()=>setShowOutOfStock(v=>!v)} aria-pressed={showOutOfStock}>
                    {showOutOfStock?'Hide out-of-stock':'Show out-of-stock'}
                  </button>
                </div>
              )}
              <div className="pg" role="list" aria-label="Products">
                {products.length===0
                  ?<div className="no-results" role="status"><SvgIcon icon="search" size={36} style={{margin:'0 auto 12px',display:'block',opacity:.2}}/><p>No products found{search?` for "${search}"`:''}.</p></div>
                  :products.map((p,i)=>{
                    const dp=customPrices[p.id]||p.price
                    const isOut=outOfStockIds.includes(p.id)
                    return(
                      <article key={p.id} className="pc" style={{animationDelay:`${i*0.025}s`}} onClick={()=>addToCart({...p,price:dp})} role="listitem button" tabIndex={0} aria-label={`Add ${p.name} — ${fKES(dp)}`} onKeyDown={e=>e.key==='Enter'&&addToCart({...p,price:dp})}>
                        {canEdit()&&<button className="pc-edit" title="Edit price" aria-label={`Edit price for ${p.name}`} onClick={e=>{e.stopPropagation();setEditProd(p);setEditPrice(String(dp))}}><SvgIcon icon="edit"/></button>}
                        <div className="pc-icon" aria-hidden="true">{(p.name||'?').trim().slice(0,1).toUpperCase()}</div>
                        <div className="pc-nm">{p.name}</div>
                        <div className="pc-pr">{fKES(dp)}</div>
                        {p.tag&&<span className={`pc-tag ${p.tag==='POM'?'pom':'otc'}`}>{p.tag}</span>}
                        <div className="pc-add" aria-hidden="true">+</div>
                      </article>
                    )
                  })
                }
              </div>
            </>)}

            {/* DASHBOARD */}
            {view==='dashboard' && canAccess('dashboard') && (
              <div className="dash-grid">
                <div className="panel full-col">
                  <div className="panel-hd"><h2>Performance Overview</h2></div>
                  <div className="kpi-row">
                    {[{l:'Total Revenue',v:fKES(totalRev),c:'c1'},{l:'Orders',v:totalOrders,c:'c2'},{l:'Net Profit',v:fKES(netProfit),c:'c3'},{l:'Expenses',v:fKES(totalExp),c:'c4'},{l:'Customers',v:customers.length,c:'c5'},{l:'Transactions',v:ledger.length,c:'c6'}]
                      .map(k=><div key={k.l} className={`kpi-card ${k.c}`} role="figure" aria-label={`${k.l}: ${k.v}`}><div className="kpi-val">{k.v}</div><div className="kpi-lbl">{k.l}</div></div>)}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-hd"><h2>Revenue — Last 7 Days</h2></div>
                  {totalRev===0
                    ?<div className="empty-state"><div className="empty-icon"><SvgIcon icon="dashboard" size={22}/></div><p>No sales recorded yet</p><span>Complete your first sale to see revenue data.</span></div>
                    :<div className="bar-chart" role="img" aria-label="Revenue bar chart">{salesData.map((d,i)=><div key={i} className="bar-item"><div className="bar" style={{height:`${(d.revenue/maxBar)*100}%`}} role="img" aria-label={`${d.date}: ${fKES(d.revenue)}`}><span className="bar-tip">{fKES(d.revenue)}</span></div><span className="bar-lbl">{d.date.slice(-5)}</span></div>)}</div>
                  }
                </div>

                <div className="panel">
                  <div className="panel-hd"><h2>Expense Tracker</h2><button className="btn-p btn-sm" onClick={()=>setShowAddExp(true)}>+ Add</button></div>
                  {showAddExp&&(
                    <div className="inline-form">
                      <div className="form-grid">
                        <div className="sf full"><label>Description</label><input placeholder="e.g. Stock restock" value={newExp.desc} onChange={e=>setNewExp({...newExp,desc:e.target.value})}/></div>
                        <div className="sf"><label>Amount (KES)</label><input type="number" value={newExp.amount} onChange={e=>setNewExp({...newExp,amount:e.target.value})}/></div>
                        <div className="sf"><label>Category</label>
                          <select value={newExp.category} onChange={e=>setNewExp({...newExp,category:e.target.value})}>
                            <option value="">Select category</option>
                            {['Inventory','Rent','Staff','Utilities','Marketing','Maintenance','Other'].map(c=><option key={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="btn-row" style={{marginTop:10}}>
                        <button className="btn-p" onClick={()=>{if(!newExp.desc||!newExp.amount)return;setExpenses(p=>[{id:Date.now(),desc:newExp.desc,category:newExp.category||'Other',amount:parseInt(newExp.amount),date:TODAY},...p]);setNewExp({desc:'',amount:'',category:''});setShowAddExp(false);flash('Expense logged.')}}>Save</button>
                        <button className="btn-g" onClick={()=>setShowAddExp(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {expenses.length===0
                    ?<div className="empty-state"><div className="empty-icon"><SvgIcon icon="payments" size={22}/></div><p>No expenses logged</p></div>
                    :<><div className="table-wrap"><table className="data-table"><thead><tr><th>Description</th><th>Category</th><th>Amount</th><th>Date</th></tr></thead><tbody>{expenses.map(e=><tr key={e.id}><td>{e.desc}</td><td>{e.category}</td><td>{fKES(e.amount)}</td><td>{e.date}</td></tr>)}</tbody></table></div><div className="card-list">{expenses.map(e=><div key={e.id} className="m-card"><div className="m-card-hd"><span className="m-card-id">{e.desc}</span><span className="m-tag"><strong>{fKES(e.amount)}</strong></span></div></div>)}</div><div style={{padding:'9px 0',fontSize:12,color:'var(--text2)',borderTop:'1px solid var(--border)',marginTop:8}}>Total Expenses: <strong style={{color:'var(--red)'}}>{fKES(totalExp)}</strong></div></>
                  }
                </div>

                {/* LEDGER with filters */}
                <div className="panel full-col">
                  <div className="panel-hd"><h2>Digital Ledger</h2>
                    <div style={{display:'flex',gap:8}}>
                      {selTxns.length>0&&<><button className="btn-p btn-sm green" onClick={()=>markReviewed(selTxns)}>Mark Reviewed</button><button className="btn-p btn-sm" onClick={()=>exportTxns(ledger.filter(r=>selTxns.includes(r.id)))}><SvgIcon icon="export"/>Export</button></>}
                      <button className="btn-g btn-sm" onClick={()=>exportTxns([])}><SvgIcon icon="export"/>Export All</button>
                    </div>
                  </div>
                  <div className="txn-filters">
                    <div className="filter-search" role="search"><SvgIcon icon="search" size={12} style={{color:'var(--text3)',flexShrink:0}}/><input placeholder="Search transactions…" value={txnSearch} onChange={e=>{setTxnSearch(e.target.value);setTxnPage(1)}} aria-label="Search transactions"/></div>
                    <select className="filter-select" value={txnStatus} onChange={e=>{setTxnStatus(e.target.value);setTxnPage(1)}} aria-label="Filter by status"><option value="all">All Status</option><option value="paid">Paid</option><option value="reviewed">Reviewed</option></select>
                  </div>
                  {selTxns.length>0&&<div className="bulk-bar"><span className="bulk-info">{selTxns.length} selected</span><button className="btn-xs btn-g" onClick={()=>setSelTxns([])}>Clear</button></div>}
                  {ledger.length===0
                    ?<div className="empty-state"><div className="empty-icon"><SvgIcon icon="inventory" size={22}/></div><p>No transactions yet</p><span>Every completed sale appears here automatically.</span></div>
                    :<>
                      <div className="table-wrap">
                        <table className="data-table" role="grid" aria-label="Transactions">
                          <thead><tr><th scope="col"><input type="checkbox" className="cb" aria-label="Select all" checked={selTxns.length===pagedLedger.length&&pagedLedger.length>0} onChange={e=>setSelTxns(e.target.checked?pagedLedger.map(r=>r.id):[])}/></th><th>Invoice</th><th>Date</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th></th></tr></thead>
                          <tbody>{pagedLedger.map(r=>(
                            <tr key={r.id} className={selTxns.includes(r.id)?'sel-row':''} onClick={()=>setDetailTxn(r)} tabIndex={0} onKeyDown={e=>e.key==='Enter'&&setDetailTxn(r)} aria-label={`Transaction ${r.id}`} role="row">
                              <td className="cb-cell" onClick={e=>e.stopPropagation()}><input type="checkbox" className="cb" checked={selTxns.includes(r.id)} onChange={e=>{e.stopPropagation();setSelTxns(p=>e.target.checked?[...p,r.id]:p.filter(x=>x!==r.id))}} aria-label={`Select transaction ${r.id}`}/></td>
                              <td style={{color:'var(--accent)',fontWeight:700,fontFamily:'monospace'}}>{r.id}</td>
                              <td style={{color:'var(--text2)'}}>{r.date}</td>
                              <td>{r.customer}</td>
                              <td><strong>{fKES(r.total)}</strong></td>
                              <td style={{color:'var(--text2)'}}>{r.method}</td>
                              <td><span className={`pill ${r.status==='Reviewed'?'reviewed':'paid'}`}>{r.status}</span></td>
                              <td><button className="btn-g btn-xs" onClick={e=>{e.stopPropagation();setDetailTxn(r)}} aria-label={`View details for ${r.id}`}><SvgIcon icon="eye"/>View</button></td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                      {/* Mobile cards */}
                      <div className="card-list" aria-label="Transactions list">
                        {pagedLedger.map(r=>(
                          <article key={r.id} className={`m-card ${expandedCard===r.id?'expanded':''}`} tabIndex={0} role="article" aria-label={`Transaction ${r.id}, ${r.customer}, ${fKES(r.total)}`} onKeyDown={e=>e.key==='Enter'&&setDetailTxn(r)}>
                            <div className="m-card-hd" onClick={()=>setExpandedCard(expandedCard===r.id?null:r.id)}>
                              <input type="checkbox" className="m-card-sel" checked={selTxns.includes(r.id)} onChange={e=>{e.stopPropagation();setSelTxns(p=>e.target.checked?[...p,r.id]:p.filter(x=>x!==r.id))}} onClick={e=>e.stopPropagation()} aria-label={`Select ${r.id}`}/>
                              <span className="m-card-id">{r.id}</span>
                              <span className={`pill m-card-status ${r.status==='Reviewed'?'reviewed':'paid'}`}>{r.status}</span>
                            </div>
                            <div className="m-card-body">
                              <span className="m-tag">{r.customer}</span>
                              <span className="m-tag"><strong>{fKES(r.total)}</strong></span>
                              <span className="m-tag">{r.method}</span>
                              <span className="m-tag">{r.date}</span>
                            </div>
                            <div className="m-card-expand">
                              {r.items?.map(item=><div key={item.id} className="m-detail-item"><span>{item.name} ×{item.qty}</span><strong>{fKES(item.price*item.qty)}</strong></div>)}
                              <button className="btn-g btn-sm" style={{marginTop:8,width:'100%'}} onClick={()=>setDetailTxn(r)}>Full Details</button>
                            </div>
                          </article>
                        ))}
                      </div>
                      {/* Pagination */}
                      {totalPages>1&&<div className="pagination" role="navigation" aria-label="Transaction pages">
                        <button className="pg-btn" onClick={()=>setTxnPage(p=>Math.max(1,p-1))} disabled={txnPage===1} aria-label="Previous page"><SvgIcon icon="arrow_l" size={12}/></button>
                        {Array.from({length:Math.min(5,totalPages)},(_,i)=>{
                          let p = txnPage<=3 ? i+1 : txnPage+i-2
                          if(p>totalPages) return null
                          return <button key={p} className={`pg-btn ${txnPage===p?'act':''}`} onClick={()=>setTxnPage(p)} aria-current={txnPage===p?'page':undefined}>{p}</button>
                        })}
                        <button className="pg-btn" onClick={()=>setTxnPage(p=>Math.min(totalPages,p+1))} disabled={txnPage===totalPages} aria-label="Next page"><SvgIcon icon="arrow_r" size={12}/></button>
                      </div>}
                    </>
                  }
                </div>
              </div>
            )}

            {/* CRM */}
            {view==='crm' && canAccess('crm') && (
              <div className="dash-grid">
                <div className="panel full-col">
                  <div className="panel-hd"><h2>Customer Management</h2><button className="btn-p btn-sm" onClick={()=>setShowAddCust(true)}>+ Add Customer</button></div>
                  {showAddCust&&(
                    <div className="inline-form">
                      <div className="form-grid">
                        <div className="sf"><label>Full Name</label><input value={newCust.name} onChange={e=>setNewCust({...newCust,name:e.target.value})} placeholder="Jane Doe"/></div>
                        <div className="sf"><label>Email</label><input value={newCust.email} onChange={e=>setNewCust({...newCust,email:e.target.value})} placeholder="jane@email.com"/></div>
                        <div className="sf"><label>Phone</label><input value={newCust.phone} onChange={e=>setNewCust({...newCust,phone:e.target.value})} placeholder="0712345678"/></div>
                      </div>
                      <div className="btn-row" style={{marginTop:10}}>
                        <button className="btn-p" onClick={()=>{if(!newCust.name)return;setCustomers(p=>[...p,{id:Date.now(),...newCust,points:0,visits:0,totalSpent:0,joined:TODAY}]);flash(`${newCust.name} added!`);setNewCust({name:'',email:'',phone:''});setShowAddCust(false)}}>Save</button>
                        <button className="btn-g" onClick={()=>setShowAddCust(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  <div className="search-box" style={{margin:'10px 0',width:'100%'}} role="search">
                    <span className="si"><SvgIcon icon="search" size={13}/></span>
                    <input placeholder="Search customers…" value={crmQ} onChange={e=>setCrmQ(e.target.value)} aria-label="Search customers"/>
                  </div>
                  {customers.length===0
                    ?<div className="empty-state"><div className="empty-icon"><SvgIcon icon="crm" size={22}/></div><p>No customers yet</p><span>Add customers to earn loyalty points at checkout.</span></div>
                    :<div className="crm-grid">{customers.filter(c=>c.name.toLowerCase().includes(crmQ.toLowerCase())).map(c=>{const tier=getTier(c.points);return(
                      <article key={c.id} className="crm-card" style={{borderTopColor:tier.color}} aria-label={`Customer ${c.name}`}>
                        <div className="crm-av" style={{background:tier.color}}>{c.name[0]}</div>
                        <div className="crm-name">{c.name}</div>
                        {c.email&&<div className="crm-meta">{c.email}</div>}
                        {c.phone&&<div className="crm-meta">{c.phone}</div>}
                        <div className="crm-tier" style={{color:tier.color}}>{tier.name} — {tier.disc}% off</div>
                        <div className="crm-row"><span>Points</span><strong>{c.points}</strong></div>
                        <div className="crm-row"><span>Visits</span><strong>{c.visits}</strong></div>
                        <div className="crm-row"><span>Total Spent</span><strong>{fKES(c.totalSpent||0)}</strong></div>
                        {canEdit()&&<button className="btn-g btn-sm danger" style={{marginTop:10,width:'100%'}} onClick={()=>setCustomers(p=>p.filter(x=>x.id!==c.id))} aria-label={`Remove ${c.name}`}>Remove</button>}
                      </article>
                    )})}</div>
                  }
                </div>
                <div className="panel full-col">
                  <div className="panel-hd"><h2>Loyalty Tiers</h2></div>
                  <div className="tier-grid">{TIERS.map(t=><div key={t.name} className="tier-card" style={{borderTop:`3px solid ${t.color}`}}><div className="tier-name" style={{color:t.color}}>{t.name}</div><div className="tier-row">Min Points: <strong>{t.min.toLocaleString()}</strong></div><div className="tier-row">Discount: <strong>{t.disc}%</strong></div><div className="tier-row" style={{fontSize:10,color:'var(--text3)',marginTop:6}}>1 point per KES 100 spent</div></div>)}</div>
                </div>
              </div>
            )}

            {/* INVENTORY */}
            {view==='orders' && canAccess('orders') && (
              <div className="dash-grid">
                <div className="panel full-col">
                  <div className="panel-hd"><h2>Inventory Management</h2>{canEdit()&&<button className="btn-p btn-sm" onClick={()=>setShowAddInv(true)}>+ Add Item</button>}</div>
                  {showAddInv&&(
                    <div className="inline-form">
                      <div className="form-grid">
                        <div className="sf"><label>Product Name</label><input value={newInv.name} onChange={e=>setNewInv({...newInv,name:e.target.value})}/></div>
                        <div className="sf"><label>SKU / Code</label><input value={newInv.sku} onChange={e=>setNewInv({...newInv,sku:e.target.value})}/></div>
                        <div className="sf"><label>Retail Price (KES)</label><input type="number" value={newInv.retailPrice} onChange={e=>setNewInv({...newInv,retailPrice:e.target.value})}/></div>
                        <div className="sf"><label>Buying Price</label><input type="number" value={newInv.buyingPrice} onChange={e=>setNewInv({...newInv,buyingPrice:e.target.value})}/></div>
                        <div className="sf"><label>Stock Level</label><input type="number" value={newInv.stockLevel} onChange={e=>setNewInv({...newInv,stockLevel:e.target.value})}/></div>
                        <div className="sf"><label>Min Alert Level</label><input type="number" value={newInv.minAlert} onChange={e=>setNewInv({...newInv,minAlert:e.target.value})}/></div>
                        <div className="sf"><label>Expiry Date</label><input type="date" value={newInv.expiry} onChange={e=>setNewInv({...newInv,expiry:e.target.value})}/></div>
                        <div className="sf"><label>Batch Number</label><input value={newInv.batch} onChange={e=>setNewInv({...newInv,batch:e.target.value})}/></div>
                        <div className="sf full"><label>Category</label><select value={newInv.category} onChange={e=>setNewInv({...newInv,category:e.target.value})}>{['General','Pharmaceutical Grade','Electronics','Food & Beverage','Services'].map(c=><option key={c}>{c}</option>)}</select></div>
                      </div>
                      <div className="btn-row" style={{marginTop:10}}>
                        <button className="btn-p" onClick={()=>{if(!newInv.name||!newInv.sku)return;setInventory(p=>[...p,{id:Date.now(),...newInv,retailPrice:parseInt(newInv.retailPrice)||0,buyingPrice:parseInt(newInv.buyingPrice)||0,stockLevel:parseInt(newInv.stockLevel)||0,minAlert:parseInt(newInv.minAlert)||5}]);setNewInv({name:'',sku:'',category:'General',retailPrice:'',buyingPrice:'',stockLevel:'',minAlert:'',expiry:'',batch:''});setShowAddInv(false);flash('Item added to inventory.')}}>Add Item</button>
                        <button className="btn-g" onClick={()=>setShowAddInv(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {inventory.length===0
                    ?<div className="empty-state"><div className="empty-icon"><SvgIcon icon="inventory" size={22}/></div><p>No inventory items</p><span>Add items to track stock, cost, and expiry dates.</span></div>
                    :<><div className="table-wrap"><table className="data-table" aria-label="Inventory"><thead><tr><th>Name</th><th>Product Category</th><th>SKU</th><th>Batch No</th><th>Min Stock Level</th><th>Current Stock</th><th>Expiry</th>{canEdit()&&<th></th>}</tr></thead><tbody>{inventory.map(item=>{const low=item.stockLevel<=item.minAlert;return(<tr key={item.id}><td>{item.name}</td><td>{item.category||'—'}</td><td style={{color:'var(--text3)',fontFamily:'monospace'}}>{item.sku||'—'}</td><td style={{color:'var(--text2)',fontFamily:'monospace'}}>{item.batch||'—'}</td><td>{item.minAlert||0}</td><td>{item.stockLevel}{low&&<span className="alert-badge" role="alert">Low</span>}</td><td>{item.expiry||'—'}</td>{canEdit()&&<td><button className="btn-g btn-xs danger" onClick={()=>setInventory(p=>p.filter(i=>i.id!==item.id))} aria-label={`Remove ${item.name}`}>Remove</button></td>}</tr>)})}</tbody></table></div><div className="card-list">{inventory.map(item=>{const low=item.stockLevel<=item.minAlert;return(<div key={item.id} className="m-card"><div className="m-card-hd"><span className="m-card-id">{item.name}</span>{low&&<span className="pill failed" role="alert">Low Stock</span>}</div><div className="m-card-body"><span className="m-tag">{item.category||'—'}</span><span className="m-tag">SKU: <strong style={{color:'var(--text)'}}>{item.sku||'—'}</strong></span><span className="m-tag">Batch: <strong style={{color:'var(--text)'}}>{item.batch||'—'}</strong></span><span className="m-tag">Min: <strong style={{color:'var(--text)'}}>{item.minAlert||0}</strong></span><span className="m-tag">Current: <strong style={{color:'var(--text)'}}>{item.stockLevel}</strong></span><span className="m-tag">Expiry: <strong style={{color:'var(--text)'}}>{item.expiry||'—'}</strong></span></div></div>)})}</div></>
                  }
                </div>
              </div>
            )}

            {/* ADD ITEM */}
            {view==='add' && canAccess('add') && (
              <div className="dash-grid">
                <div className="panel">
                  <div className="panel-hd"><h2>Add Custom Item</h2></div>
                  <div className="form-grid">
                    <div className="sf full"><label>Item Name</label><input value={newItem.name} onChange={e=>setNewItem({...newItem,name:e.target.value})} placeholder="e.g. Special Bundle"/></div>
                    <div className="sf"><label>Price (KES)</label><input type="number" value={newItem.price} onChange={e=>setNewItem({...newItem,price:e.target.value})}/></div>
                    <div className="sf"><label>Icon (Emoji)</label><input value={newItem.icon} onChange={e=>setNewItem({...newItem,icon:e.target.value})} placeholder="Optional"/></div>
                    <div className="sf full"><label>Category</label><select value={newItem.category} onChange={e=>setNewItem({...newItem,category:e.target.value})}>{Object.entries(categories).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
                  </div>
                  <button className="btn-p" style={{marginTop:16,width:'100%'}} onClick={()=>{if(!newItem.name||!newItem.price){flash('Name and price are required.','error');return};setCustomItems(p=>[...p,{id:Date.now(),...newItem,price:parseInt(newItem.price)}]);flash('Item added to catalogue.');setNewItem({name:'',price:'',category:'shop',icon:''});setView('pos')}}>Add to Catalogue</button>
                  <p className="help-text">The item will appear in the selected category immediately and can be sold from the POS.</p>
                </div>
                <div className="panel">
                  <div className="panel-hd"><h2>System Summary</h2></div>
                  <div className="stat-grid">{[{v:totalProds,l:'Products'},{v:customers.length,l:'Customers'},{v:ledger.length,l:'Transactions'},{v:fKES(totalRev),l:'Revenue'},{v:inventory.length,l:'Inventory Items'},{v:Object.keys(categories).length,l:'Niches'}].map((s,i)=><div key={i} className="stat-card"><strong>{s.v}</strong><span>{s.l}</span></div>)}</div>
                </div>
              </div>
            )}

            {/* PAYMENT SETTINGS */}
            {view==='payments' && canAccess('payments') && (
              <div className="pay-settings-grid">
                <div className="panel">
                  <div className="panel-hd"><h2>M-Pesa Configuration</h2></div>
                  <div className="form-grid">
                    <div className="sf full"><label>Business Shortcode</label><input value={mpesaShortcode} onChange={e=>setMpesaShortcode(e.target.value)} placeholder="174379"/></div>
                    <div className="sf full"><label>Consumer Key</label><input type="password" placeholder="From Safaricom Daraja" defaultValue="••••••••"/></div>
                    <div className="sf full"><label>Consumer Secret</label><input type="password" placeholder="From Safaricom Daraja" defaultValue="••••••••"/></div>
                    <div className="sf full"><label>Passkey</label><input type="password" placeholder="Lipa Na M-Pesa Passkey" defaultValue="••••••••"/></div>
                    <div className="sf full"><label>Callback URL</label><input defaultValue={`${API_URL}/api/mpesa/callback`}/></div>
                    <div className="sf full"><label>Environment</label><select><option>Sandbox (Testing)</option><option>Live (Production)</option></select></div>
                  </div>
                  <button className="btn-p" style={{marginTop:14}}>Save M-Pesa Config</button>
                  <div className="settings-note">M-Pesa credentials are stored server-side only. Never expose consumer secret to the browser.</div>
                </div>
                <div className="panel">
                  <div className="panel-hd"><h2>Paystack Configuration</h2></div>
                  <div className="form-grid">
                    <div className="sf full"><label>Public Key</label><input value={paystackKeyState} onChange={e=>setPaystackKeyState(e.target.value)} placeholder="pk_live_…"/></div>
                    <div className="sf full"><label>Secret Key</label><input type="password" defaultValue="••••••••"/></div>
                    <div className="sf full"><label>Webhook URL</label><input defaultValue={`${API_URL}/api/paystack/webhook`}/></div>
                  </div>
                  <button className="btn-p" style={{marginTop:14}}>Save Paystack Config</button>
                </div>
                <div className="panel">
                  <div className="panel-hd"><h2>PayPal Configuration</h2></div>
                  <div className="form-grid">
                    <div className="sf full"><label>Client ID</label><input defaultValue={PAYPAL_ID}/></div>
                    <div className="sf full"><label>Secret</label><input type="password" defaultValue="••••••••"/></div>
                    <div className="sf full"><label>Mode</label><select><option>Sandbox</option><option>Live</option></select></div>
                  </div>
                  <button className="btn-p" style={{marginTop:14}}>Save PayPal Config</button>
                </div>
                <div className="panel">
                  <div className="panel-hd"><h2>Webhook Status</h2></div>
                  {[{l:'M-Pesa Callback',ok:true,url:'/api/mpesa/callback'},{l:'Paystack Webhook',ok:!!paystackKeyState,url:'/api/paystack/webhook'},{l:'PayPal Webhook',ok:PAYPAL_ID!=='sb',url:'/api/paypal/webhook'}].map(w=>(
                    <div key={w.l} className="key-row">
                      <div><div style={{fontSize:12.5,fontWeight:500}}>{w.l}</div><div style={{fontSize:10,color:'var(--text3)',fontFamily:'monospace'}}>{w.url}</div></div>
                      <span className={`pill ${w.ok?'paid':'pending'}`}>{w.ok?'Active':'Not configured'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MANAGER — BUG REPORTS */}
            {view==='manager' && canAccess('manager') && (
              <div className="dash-grid">
                <div className="panel full-col">
                  <div className="panel-hd">
                    <h2>Bug Reports</h2>
                    <span style={{fontSize:11,color:'var(--text3)'}}>{bugReports.filter(r=>r.status==='open').length} open</span>
                  </div>
                  <div className="manager-filters">
                    <div className="filter-search" role="search"><SvgIcon icon="search" size={12} style={{color:'var(--text3)',flexShrink:0}}/><input placeholder="Search reports…" value={managerFilters.search} onChange={e=>setManagerFilters(p=>({...p,search:e.target.value}))} aria-label="Search bug reports"/></div>
                    <select className="filter-select" value={managerFilters.status} onChange={e=>setManagerFilters(p=>({...p,status:e.target.value}))} aria-label="Filter by status"><option value="all">All Status</option><option value="open">Open</option><option value="resolved">Resolved</option></select>
                    <select className="filter-select" value={managerFilters.role} onChange={e=>setManagerFilters(p=>({...p,role:e.target.value}))} aria-label="Filter by role"><option value="all">All Roles</option>{Object.entries(ROLES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select>
                    <select className="filter-select" value={managerFilters.cat} onChange={e=>setManagerFilters(p=>({...p,cat:e.target.value}))} aria-label="Filter by category"><option value="all">All Categories</option>{['payments','inventory','invoices','dashboard','pos','crm'].map(c=><option key={c} value={c}>{c}</option>)}</select>
                  </div>
                  {bugReports.length===0
                    ?<div className="empty-state"><div className="empty-icon"><SvgIcon icon="bug" size={22}/></div><p>No bug reports</p><span>Reports submitted by team members will appear here.</span></div>
                    :bugReports
                      .filter(r=>{
                        const q=managerFilters.search.toLowerCase()
                        return (managerFilters.status==='all'||r.status===managerFilters.status)&&(managerFilters.role==='all'||r.role===managerFilters.role)&&(managerFilters.cat==='all'||r.categories?.includes(managerFilters.cat))&&(!q||(r.text.toLowerCase().includes(q)||r.user.toLowerCase().includes(q)))
                      })
                      .map(r=>(
                        <div key={r.id} className="report-card" role="article" aria-label={`Bug report ${r.id}`}>
                          <div className="report-card-hd">
                            <span className={`pill ${r.status==='open'?'pending':'paid'}`}>{r.status}</span>
                            <span className="report-role-chip" style={{background:ROLES[r.role]?.bg,color:ROLES[r.role]?.color,padding:'2px 8px',borderRadius:20,fontWeight:600,fontSize:10}}>{ROLES[r.role]?.label}</span>
                            {r.categories?.map(c=><span key={c} className="report-category-chip">{c}</span>)}
                            {r.dupOf && <span className="dup-badge">Linked to {r.dupOf}</span>}
                            {r.dupCount>1 && <span className="dup-badge">{r.dupCount} reports</span>}
                            <span style={{marginLeft:'auto',fontSize:10,color:'var(--text3)'}}>{r.id}</span>
                          </div>
                          <div className="report-card-body">{r.text}</div>
                          {r.screenshot && <img src={r.screenshot} alt="Screenshot" className="screenshot-preview" style={{maxHeight:120,objectFit:'cover'}}/>}
                          <div className="report-card-ft">
                            <span>{r.user}</span><span>·</span><span>Page: {r.page}</span><span>·</span><span>{new Date(r.time).toLocaleString('en-KE')}</span>
                            <button className="btn-g btn-xs" style={{marginLeft:'auto'}} onClick={()=>setBugReports(p=>p.map(x=>x.id===r.id?{...x,status:r.status==='open'?'resolved':'open'}:x))}>{r.status==='open'?'Mark Resolved':'Reopen'}</button>
                            <button className="btn-g btn-xs danger" onClick={()=>setBugReports(p=>p.filter(x=>x.id!==r.id))}>Delete</button>
                          </div>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {view==='settings' && canAccess('settings') && (
              <div className="settings-grid">
                <div className="panel">
                  <div className="panel-hd"><h2>Profile</h2></div>
                  <div className="profile-card">
                    <div className="profile-av" style={{background:ROLES[currentUser.role].color}}>{currentUser.initial}</div>
                    <div>
                      <div className="profile-name">{currentUser.name}</div>
                      <div className="profile-email">{currentUser.email}</div>
                      <div className="profile-meta">{ROLES[currentUser.role].label} · beryl_bytes_global</div>
                    </div>
                  </div>
                  <div className="sf" style={{marginBottom:14}}>
                    <label>Theme</label>
                    <div className="theme-sw">
                      <button className={`theme-pill ${!darkMode?'act':''}`} onClick={()=>setDarkMode(false)} aria-pressed={!darkMode}>Light</button>
                      <button className={`theme-pill ${darkMode?'act':''}`} onClick={()=>setDarkMode(true)} aria-pressed={darkMode}>Dark</button>
                    </div>
                  </div>
                  <div className="sf" style={{marginBottom:14}}><label>Language</label><select value={lang} onChange={e=>setLang(e.target.value)}><option>English (Kenya)</option><option>English (United States)</option><option>Swahili (Kenya)</option></select></div>
                  <button className="btn-g btn-sm" onClick={handleLogout} style={{marginTop:8}}><SvgIcon icon="logout"/>Sign Out</button>
                </div>
                <div className="panel">
                  <div className="panel-hd"><h2>System Controls</h2></div>
                  {[{l:'Cloud Realtime Sync',s:syncOn,t:setSyncOn},{l:'Biometric Enforcement',s:bioOn,t:setBioOn},{l:'Inventory Low-Stock Alerts',s:alertsOn,t:setAlertsOn},{l:'Schema Cache Banner',s:schemaBanner,t:setSchemaBanner}]
                    .map(({l,s,t})=><div key={l} className="toggle-row"><span>{l}</span><button className={`toggle-pill ${s?'on':''}`} onClick={()=>t(!s)} aria-pressed={s}>{s?'Enabled':'Disabled'}</button></div>)}
                  <div className="settings-note">BerylBytes OS v4.4.0 Enterprise LTS — All operations logged and encrypted end-to-end.</div>
                </div>
                <div className="panel">
                  <div className="panel-hd"><h2>Role Access Matrix</h2></div>
                  <div style={{fontSize:11,color:'var(--text2)',marginBottom:10}}>Current: <strong style={{color:ROLES[currentUser.role].color}}>{ROLES[currentUser.role].label}</strong></div>
                  {Object.entries(ROLES).map(([k,v])=>(
                    <div key={k} className="toggle-row">
                      <div><div style={{fontSize:12,color:v.color,fontWeight:600}}>{v.label}</div><div style={{fontSize:10,color:'var(--text3)'}}>{v.access.join(', ')}</div></div>
                    </div>
                  ))}
                </div>
                <div className="panel">
                  <div className="panel-hd"><h2>Tax & Currency</h2></div>
                  {[{l:'VAT Rate',v:'16% (Kenya KRA)'},{l:'Currency',v:'KES — Kenyan Shilling'},{l:'Receipt Format',v:'A4 PDF'}].map(r=><div key={r.l} className="toggle-row"><span>{r.l}</span><strong style={{color:'var(--accent)',fontSize:12}}>{r.v}</strong></div>)}
                </div>
              </div>
            )}

          </main>

          {/* CART PANEL */}
          {view==='pos' && (
            <aside className={`cart-panel ${cartOpen?'open':''}`} aria-label="Shopping cart">
              <div className="cp-hd" onClick={()=>setCartOpen(!cartOpen)} style={{cursor:'pointer'}} role="button" aria-expanded={cartOpen} aria-label={`Cart — ${cart.reduce((s,i)=>s+i.qty,0)} items`}>
                <h2>Order {cart.length>0&&`(${cart.reduce((s,i)=>s+i.qty,0)})`}</h2>
                {cart.length>0&&<button className="clr-btn" onClick={e=>{e.stopPropagation();setCart([]); localStorage.removeItem('bb_cart')}} aria-label="Clear cart">Clear all</button>}
              </div>
              <div className="cust-sel">
                <label>Customer (optional)</label>
                <select value={selCust?.id||''} onChange={e=>setSelCust(customers.find(c=>c.id===Number(e.target.value))||null)} aria-label="Select customer">
                  <option value="">Walk-in Customer</option>
                  {customers.map(c=><option key={c.id} value={c.id}>{c.name} — {getTier(c.points).name}</option>)}
                </select>
                {selCust&&<div className="loyalty-badge" style={{borderColor:getTier(selCust.points).color,color:getTier(selCust.points).color}}>{getTier(selCust.points).name} — {getTier(selCust.points).disc}% loyalty discount</div>}
              </div>
              <div className="ci-list" role="list" aria-label="Cart items">
                {cart.length===0
                  ?<div className="ci-empty"><div className="ci-empty-icon"><SvgIcon icon="cart" size={18}/></div><p>Cart is empty</p><span>Tap products to add them</span></div>
                  :cart.map(item=>(
                    <div key={item.id} className="ci" role="listitem">
                      <span className="ci-ico" aria-hidden="true">{(item.name||'?').trim().slice(0,1).toUpperCase()}</span>
                      <div className="ci-inf"><div className="ci-nm">{item.name}</div><div className="ci-pr">{fKES(item.price*item.qty)}</div></div>
                      <div className="ci-ctl" role="group" aria-label={`Quantity controls for ${item.name}`}>
                        <button className="qb" onClick={()=>updQty(item.id,-1)} aria-label="Decrease quantity">−</button>
                        <span aria-label={`Quantity ${item.qty}`}>{item.qty}</span>
                        <button className="qb" onClick={()=>updQty(item.id,1)} aria-label="Increase quantity">+</button>
                        <button className="rb" onClick={()=>remFromCart(item.id)} aria-label={`Remove ${item.name}`}>×</button>
                      </div>
                    </div>
                  ))
                }
              </div>
              {cart.length>0&&(<>
                <div className="tots">
                  <div className="tr"><span>Subtotal</span><span>{fKES(subtotal)}</span></div>
                  {discount>0&&<div className="tr disc"><span>Loyalty Discount</span><span>−{fKES(discount)}</span></div>}
                  <div className="tr"><span>VAT 16%</span><span>{fKES(tax)}</span></div>
                  <div className="tr gd"><span>Total</span><span>{fKES(grand)}</span></div>
                </div>
                <button className="chg-btn" onClick={()=>setShowPay(true)} aria-label={`Charge ${fKES(grand)}`}>
                  Charge {fKES(grand)}<SvgIcon icon="arrow_r" size={14}/>
                </button>
              </>)}
            </aside>
          )}
        </div>

        {/* MOBILE NAV */}
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {NAV_ITEMS.slice(0,4).map(item=>(
            <button key={item.id} className={`mob-nav-btn ${view===item.id?'act':''}`} onClick={()=>setView(item.id)} aria-current={view===item.id?'page':undefined} aria-label={item.label}>
              <SvgIcon icon={item.icon} size={18}/>
              <span className="label">{item.label.split(' ')[0]}</span>
            </button>
          ))}
          {view==='pos'&&(
            <button className="mob-nav-btn" onClick={()=>setCartOpen(!cartOpen)} aria-label={`Cart — ${cart.reduce((s,i)=>s+i.qty,0)} items`} aria-expanded={cartOpen}>
              <SvgIcon icon="cart" size={18}/>
              <span className="label">Cart{cart.length>0?` (${cart.reduce((s,i)=>s+i.qty,0)})`:''}</span>
            </button>
          )}
        </nav>

        {/* PAYMENT MODAL */}
        {showPay && (
          <div className="overlay" role="dialog" aria-modal="true" aria-label="Payment" onClick={e=>e.target===e.currentTarget&&!mpesaStatus&&setShowPay(false)}>
            <div className="modal" id="payment-modal">
              <div className="modal-hd">
                <div><h3>Payment</h3><div className="pay-amount">{fKES(grand)}</div></div>
                <button className="modal-close" onClick={()=>{if(mpesaStatus==='pending')return;setShowPay(false);setMpesaStatus(null);setLastCheckoutId(null);setAttempts([])}} aria-label="Close payment modal"><SvgIcon icon="x" size={18}/></button>
              </div>

              <div className="pay-methods" role="group" aria-label="Payment method">
                {[{id:'mpesa',icon:'mpesa',label:'M-Pesa'},{id:'cash',icon:'cash',label:'Cash'},{id:'paystack',icon:'card',label:'Card'},{id:'paypal',icon:'paypal',label:'PayPal'}]
                  .map(m=>(
                    <button key={m.id} className={`pay-m-btn ${payMethod===m.id?'act':''}`} onClick={()=>{setPayMethod(m.id);setMpesaStatus(null)}} aria-pressed={payMethod===m.id} disabled={mpesaStatus==='pending'}>
                      <SvgIcon icon={m.icon} size={14}/><span>{m.label}</span>
                    </button>
                  ))}
              </div>

              {payMethod==='mpesa' && (
                <div className="pay-form">
                  {(!phoneConfirmed || mpesaStatus==='timeout' || mpesaStatus==='failed') ? (<>
                    <label htmlFor="mpesa-phone">Customer Phone Number</label>
                    <div className="phone-row">
                      <div className="sf">
                        <input id="mpesa-phone" type="tel" placeholder="254712345678" value={phone} onChange={e=>setPhone(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleMpesa()} disabled={mpesaStatus==='pending'} aria-label="Customer phone number"/>
                      </div>
                    </div>
                    <button className="pay-go" onClick={handleMpesa} disabled={mpesaStatus==='pending'||!phone} aria-label="Send M-Pesa STK Push">
                      <SvgIcon icon="mpesa" size={14}/>Send M-Pesa Prompt
                    </button>
                  </>) : (<>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--surface)',borderRadius:'var(--rs)',padding:'9px 12px',marginBottom:4}}>
                      <div><div style={{fontSize:10,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'.5px'}}>Phone</div><div style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{phone}</div></div>
                      {(mpesaStatus==='timeout'||mpesaStatus==='failed')&&<button className="change-num-btn" onClick={()=>{setPhoneConfirmed(false);setMpesaStatus(null)}} aria-label="Change phone number">Change Number</button>}
                    </div>
                  </>)}

                  {mpesaStatus==='pending' && (
                    <div className="mpesa-status" role="status" aria-live="polite" aria-label="Waiting for M-Pesa payment">
                      <div className="mpesa-status-label">Waiting for Customer PIN</div>
                      <div className="mpesa-status-sub">Customer should check their phone and enter M-Pesa PIN</div>
                      <div className="mpesa-timeout" aria-live="polite">Times out in {mpesaTimer}s</div>
                      <div className="mpesa-progress" role="progressbar" aria-valuemin={0} aria-valuemax={MPESA_TIMEOUT} aria-valuenow={mpesaTimer}>
                        <div className="mpesa-progress-bar" style={{width:`${(mpesaTimer/MPESA_TIMEOUT)*100}%`}}/>
                      </div>
                    </div>
                  )}
                  {mpesaStatus==='timeout' && (
                    <div className="mpesa-status" role="alert">
                      <div className="mpesa-status-label" style={{color:'var(--orange)'}}>Request Timed Out</div>
                      <div className="mpesa-status-sub">The customer did not respond in time.</div>
                      <button className="pay-go retry" style={{marginTop:10}} onClick={retryMpesa} aria-label="Retry M-Pesa payment">
                        <SvgIcon icon="refresh" size={14}/>Retry STK Push
                      </button>
                    </div>
                  )}
                  {mpesaStatus==='failed' && (
                    <div className="mpesa-status" role="alert">
                      <div className="mpesa-status-label" style={{color:'var(--red)'}}>Payment Failed</div>
                      <button className="pay-go retry" style={{marginTop:10}} onClick={retryMpesa} aria-label="Retry M-Pesa payment">
                        <SvgIcon icon="refresh" size={14}/>Retry Payment
                      </button>
                    </div>
                  )}
                  {mpesaStatus==='success' && (
                    <div className="mpesa-status" role="status">
                      <div className="mpesa-status-label" style={{color:'var(--green)'}}>Payment Confirmed</div>
                    </div>
                  )}

                  {attempts.length>0 && (
                    <div className="attempts-list">
                      <div className="attempts-hd">Payment Attempts ({attempts.length})</div>
                      {attempts.map((a,i)=>(
                        <div key={a.id} className="attempt-item" aria-label={`Attempt ${i+1}: ${a.status}`}>
                          <div className={`attempt-dot ${a.status}`} aria-hidden="true"/>
                          <span className="attempt-time">{a.time}</span>
                          <span className="attempt-status">{a.desc}</span>
                          <span className="attempt-id">{a.id.slice(-8)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {payMethod==='cash' && (
                <div className="pay-form">
                  <label htmlFor="cash-amount">Cash Received (KES)</label>
                  <input id="cash-amount" type="number" placeholder="Enter amount given" value={cashIn} onChange={e=>setCashIn(e.target.value)} aria-label="Cash amount received"/>
                  {cashIn&&<div className={`pay-change ${change>=0?'pos':'neg'}`} role="status">{change>=0?`Change: ${fKES(change)}`:`Short by: ${fKES(Math.abs(change))}`}</div>}
                  <button className="pay-go" onClick={handleCash} disabled={!cashIn||change<0} aria-label="Confirm cash payment">
                    <SvgIcon icon="cash" size={14}/>Confirm Cash Payment
                  </button>
                </div>
              )}

              {payMethod==='paystack' && (
                <div className="pay-form">
                  <label htmlFor="customer-email">Customer Email (optional)</label>
                  <input id="customer-email" type="email" placeholder="customer@email.com" value={custEmail} onChange={e=>setCustEmail(e.target.value)} aria-label="Customer email address"/>
                  <div className="pay-info">Secured by Paystack. Accepts Visa, Mastercard, and M-Pesa mobile money.</div>
                  <button className="pay-go" onClick={handlePaystack} aria-label="Pay with card via Paystack">
                    <SvgIcon icon="card" size={14}/>Pay with Card
                  </button>
                </div>
              )}

              {payMethod==='paypal' && (
                <div className="pay-form">
                  <div className="pay-info">Complete your payment securely through PayPal. Amount: USD {(grand/130).toFixed(2)}</div>
                  <PayPalButtons
                    style={{layout:'vertical',color:'blue',shape:'rect',height:40}}
                    createOrder={(_,actions)=>actions.order.create({purchase_units:[{amount:{value:(grand/130).toFixed(2),currency_code:'USD'},description:`BerylBytes — ${cart.length} item(s)`}]})}
                    onApprove={(_,actions)=>actions.order.capture().then(d=>completeSale('PayPal',{transactionId:d.id}))}
                    onError={()=>flash('PayPal payment failed. Please try again.','error')}
                  />
                </div>
              )}

              {msg&&<div className={`pay-msg ${msgType}`} role="alert" aria-live="polite"><SvgIcon icon={msgType==='success'?'check':msgType==='error'?'alert':'refresh'} size={13}/>{msg}</div>}
            </div>
          </div>
        )}

        {/* RECEIPT MODAL */}
        {showReceipt && receiptData && (
          <div className="overlay" role="dialog" aria-modal="true" aria-label="Receipt" onClick={e=>e.target===e.currentTarget&&setShowReceipt(false)}>
            <div className="receipt-modal">
              <div className="receipt-top">
                <h3>BerylBytes — Receipt</h3>
                <div className="r-id" aria-label={`Invoice ${receiptData.invoiceId}`}>{receiptData.invoiceId}</div>
              </div>
              <div className="receipt-meta">
                <span>{new Date().toLocaleString('en-KE')}</span>
                <span>Payment: {receiptData.method}</span>
                {receiptData.customer&&<span>Customer: {receiptData.customer}</span>}
              </div>
              <div role="list" aria-label="Purchased items">
                {receiptData.items.map(item=><div key={item.id} className="r-line" role="listitem"><span>{item.name} × {item.qty}</span><span>{fKES(item.price*item.qty)}</span></div>)}
              </div>
              <div className="r-totals">
                {(()=>{const s=receiptData.items.reduce((x,i)=>x+i.price*i.qty,0);return(<>
                  <div className="r-total-line"><span>Subtotal</span><span>{fKES(s)}</span></div>
                  <div className="r-total-line"><span>VAT 16%</span><span>{fKES(Math.round(s*0.16))}</span></div>
                  <div className="r-total-line big"><span>Total Paid</span><span>{fKES(receiptData.amount)}</span></div>
                  {receiptData.change>0&&<div className="r-total-line"><span>Change Given</span><span style={{color:'var(--green)'}}>{fKES(receiptData.change)}</span></div>}
                </>)})()}
              </div>
              <div className="receipt-thanks">Thank you for shopping at BerylBytes.</div>
              <div className="btn-row" style={{marginTop:16}}>
                <button className="btn-p" style={{flex:1}} onClick={generatePDF} aria-label="Download PDF receipt"><SvgIcon icon="download"/>Download PDF</button>
                <button className="btn-g" onClick={()=>setShowReceipt(false)} aria-label="Close receipt">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT PRICE MODAL */}
        {editProd && (
          <div className="overlay" role="dialog" aria-modal="true" aria-label={`Edit price for ${editProd.name}`} onClick={e=>e.target===e.currentTarget&&setEditProd(null)}>
            <div className="modal" style={{width:340}}>
              <div className="modal-hd">
                <h3>Edit Price</h3>
                <button className="modal-close" onClick={()=>setEditProd(null)} aria-label="Close"><SvgIcon icon="x" size={18}/></button>
              </div>
              <div style={{fontSize:12,color:'var(--text2)',marginBottom:12}}>{editProd.name}</div>
              <div className="sf" style={{marginBottom:16}}>
                <label htmlFor="edit-price">New Price (KES)</label>
                <input id="edit-price" type="number" value={editPrice} onChange={e=>setEditPrice(e.target.value)} autoFocus onKeyDown={e=>e.key==='Enter'&&(setCustomPrices(p=>({...p,[editProd.id]:parseInt(editPrice)})),flash('Price updated.'),setEditProd(null))} aria-label="New price in KES"/>
              </div>
              <div className="btn-row">
                <button className="btn-p" style={{flex:1}} onClick={()=>{setCustomPrices(p=>({...p,[editProd.id]:parseInt(editPrice)}));flash(`Price updated to ${fKES(parseInt(editPrice))}`);setEditProd(null)}} aria-label="Save new price">Save Price</button>
                <button className="btn-g" onClick={()=>setEditProd(null)} aria-label="Cancel">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTION DETAIL DRAWER */}
        {detailTxn && (<>
          <div className="drawer-overlay" onClick={()=>setDetailTxn(null)} aria-hidden="true"/>
          <div className="drawer" role="dialog" aria-modal="true" aria-label={`Transaction ${detailTxn.id} details`}>
            <div className="drawer-hd">
              <h3>{detailTxn.id}</h3>
              <button className="modal-close" onClick={()=>setDetailTxn(null)} aria-label="Close drawer"><SvgIcon icon="x" size={18}/></button>
            </div>
            <div className="drawer-body">
              <div className="drawer-sec">
                <h4>Transaction Info</h4>
                {[{l:'Date',v:detailTxn.date},{l:'Customer',v:detailTxn.customer},{l:'Method',v:detailTxn.method},{l:'Status',v:detailTxn.status},{l:'Total',v:fKES(detailTxn.total)}]
                  .map(r=><div key={r.l} className="m-detail-item"><span className="table-card-label">{r.l}</span><strong className="table-card-val">{r.v}</strong></div>)}
              </div>
              <div className="drawer-sec">
                <h4>Items Purchased</h4>
                {detailTxn.items?.map(item=>(
                  <div key={item.id} className="m-detail-item">
                    <span>{item.icon} {item.name} × {item.qty}</span>
                    <strong>{fKES(item.price*item.qty)}</strong>
                  </div>
                ))}
              </div>
              <div className="drawer-sec">
                <h4>Payment Audit Trail</h4>
                <div className="audit-trail">
                  {(detailTxn.auditTrail||[{status:'success',time:detailTxn.timestamp||new Date().toISOString(),desc:'Payment recorded'}]).map((a,i)=>(
                    <div key={i} className="audit-item">
                      <div className={`audit-dot ${a.status}`} aria-hidden="true"/>
                      <span className="audit-time">{new Date(a.time).toLocaleTimeString('en-KE')}</span>
                      <span style={{color:'var(--text2)',fontSize:12}}>{a.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="drawer-sec">
                <h4>Actions</h4>
                <div className="btn-row">
                  <button className="btn-p btn-sm green" onClick={()=>{markReviewed([detailTxn.id]);setDetailTxn(null)}} aria-label="Mark as reviewed"><SvgIcon icon="check"/>Mark Reviewed</button>
                  <button className="btn-g btn-sm" onClick={()=>exportTxns([detailTxn])} aria-label="Export this transaction"><SvgIcon icon="export"/>Export</button>
                </div>
              </div>
            </div>
          </div>
        </>)}

        {/* BUG REPORT MODAL */}
        <button className="report-fab" onClick={()=>setShowReport(true)} aria-label="Report a bug or issue">
          <SvgIcon icon="bug"/>Report Issue
        </button>
        {showReport && (
          <div className="overlay" role="dialog" aria-modal="true" aria-label="Report an issue" onClick={e=>e.target===e.currentTarget&&setShowReport(false)}>
            <div className="report-modal">
              <div className="modal-hd">
                <h3>Report an Issue</h3>
                <button className="modal-close" onClick={()=>setShowReport(false)} aria-label="Close"><SvgIcon icon="x" size={18}/></button>
              </div>
              <div className="report-context" aria-label="Report context">
                User: {currentUser.name} ({ROLES[currentUser.role].label}) | Page: {view}{'\n'}
                Time: {new Date().toLocaleTimeString('en-KE')} | Cart: {cart.length} items
              </div>

              {/* Duplicate check preview */}
              {reportText.length>20 && bugReports.some(r=>r.sig?.includes(reportText.slice(0,20))) && (
                <div className="dup-warning" role="alert"><SvgIcon icon="alert" size={13}/>A similar report already exists. Submitting will link to the master report.</div>
              )}

              <div className="sf" style={{marginBottom:10}}>
                <label>Category (select all that apply)</label>
                <div className="cat-grid" role="group" aria-label="Report categories">
                  {['Payments','Inventory','Invoices','Dashboard','POS','CRM','Settings'].map(c=>(
                    <button key={c} className={`cat-chip ${reportCats.includes(c.toLowerCase())?'sel':''}`} onClick={()=>setReportCats(p=>p.includes(c.toLowerCase())?p.filter(x=>x!==c.toLowerCase()):[...p,c.toLowerCase()])} aria-pressed={reportCats.includes(c.toLowerCase())}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sf" style={{marginBottom:10}}>
                <label htmlFor="report-text">Describe the issue</label>
                <textarea id="report-text" className="sf" style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--rs)',color:'var(--text)',padding:'9px 12px',fontSize:12.5,fontFamily:'DM Sans,sans-serif',outline:'none',resize:'vertical',minHeight:90,transition:'border-color .18s',width:'100%'}}
                  placeholder="What happened? What were you trying to do? Steps to reproduce…" value={reportText} onChange={e=>setReportText(e.target.value)} aria-label="Issue description"/>
              </div>

              <div className="sf" style={{marginBottom:14}}>
                <label>Screenshot (optional)</label>
                <div className="screenshot-zone" role="button" tabIndex={0} aria-label="Attach screenshot" onClick={()=>document.getElementById('ss-input').click()} onKeyDown={e=>e.key==='Enter'&&document.getElementById('ss-input').click()}>
                  <input id="ss-input" type="file" accept="image/*" style={{display:'none'}} onChange={e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>setReportScreenshot(ev.target.result);r.readAsDataURL(f)}}}/>
                  <SvgIcon icon="attach" size={16} style={{display:'block',margin:'0 auto 6px'}}/>
                  {reportScreenshot?'Screenshot attached':'Attach Screenshot'}
                </div>
                {reportScreenshot&&<img src={reportScreenshot} alt="Report screenshot" className="screenshot-preview"/>}
              </div>

              <div className="btn-row">
                <button className="btn-p" style={{flex:1}} onClick={submitReport} disabled={!reportText} aria-label="Submit bug report">Submit Report</button>
                <button className="btn-g" onClick={()=>{setShowReport(false);setReportText('');setReportCats([]);setReportScreenshot(null)}} aria-label="Cancel">Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </PayPalScriptProvider>
  )
}

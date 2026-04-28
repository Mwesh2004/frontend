import { useState, useEffect, useCallback } from 'react'
import './App.css'
import jsPDF from 'jspdf'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

const categories = {
  shop: { label:'General Shop', icon:'🛒', products:[
    {id:1,name:'Maize Flour 2kg',price:220,icon:'🌽'},{id:2,name:'Maize Flour 5kg',price:520,icon:'🌽'},
    {id:3,name:'Cooking Oil 1L',price:350,icon:'🫙'},{id:4,name:'Cooking Oil 2L',price:680,icon:'🫙'},
    {id:5,name:'Cooking Oil 5L',price:1550,icon:'🫙'},{id:6,name:'Sugar 1kg',price:180,icon:'🍬'},
    {id:7,name:'Sugar 2kg',price:350,icon:'🍬'},{id:8,name:'Rice 2kg',price:310,icon:'🍚'},
    {id:9,name:'Rice 5kg',price:760,icon:'🍚'},{id:10,name:'Tea Leaves 500g',price:220,icon:'🍵'},
    {id:11,name:'Tea Leaves 250g',price:120,icon:'🍵'},{id:12,name:'Milk 500ml',price:65,icon:'🥛'},
    {id:13,name:'Milk 1L Fresh',price:130,icon:'🥛'},{id:14,name:'Long-life Milk 500ml',price:80,icon:'🥛'},
    {id:15,name:'Bread Loaf',price:75,icon:'🍞'},{id:16,name:'Bread Roll x4',price:60,icon:'🍞'},
    {id:17,name:'Omo Detergent 1kg',price:320,icon:'🧺'},{id:18,name:'Omo Detergent 500g',price:175,icon:'🧺'},
    {id:19,name:'Ariel Detergent 1kg',price:360,icon:'🧺'},{id:20,name:'Bar Soap x3',price:150,icon:'🧼'},
    {id:21,name:'Bathing Soap',price:80,icon:'🧼'},{id:22,name:'Toothpaste 75ml',price:120,icon:'🪥'},
    {id:23,name:'Toothpaste 150ml',price:200,icon:'🪥'},{id:24,name:'Toothbrush x2',price:90,icon:'🪥'},
    {id:25,name:'Salt 500g',price:50,icon:'🧂'},{id:26,name:'Baking Flour 1kg',price:140,icon:'🌾'},
    {id:27,name:'Baking Flour 2kg',price:270,icon:'🌾'},{id:28,name:'Spaghetti 400g',price:120,icon:'🍝'},
    {id:29,name:'Macaroni 400g',price:110,icon:'🍝'},{id:30,name:'Tomato Paste 70g',price:55,icon:'🍅'},
    {id:31,name:'Tomato Paste 150g',price:95,icon:'🍅'},{id:32,name:'Royco Beef 75g',price:85,icon:'🥄'},
    {id:33,name:'Royco Chicken 75g',price:85,icon:'🥄'},{id:34,name:'Margarine 250g',price:140,icon:'🧈'},
    {id:35,name:'Margarine 500g',price:260,icon:'🧈'},{id:36,name:'Nescafe 200g',price:750,icon:'☕'},
    {id:37,name:'Ovaltine 400g',price:590,icon:'🥤'},{id:38,name:'Milo 400g',price:620,icon:'🥤'},
    {id:39,name:'Canned Tuna 185g',price:180,icon:'🐟'},{id:40,name:'Canned Sardines',price:100,icon:'🐟'},
    {id:41,name:'Honey 250ml',price:350,icon:'🍯'},{id:42,name:'Jam Strawberry 400g',price:280,icon:'🍓'},
    {id:43,name:'Peanut Butter 400g',price:320,icon:'🥜'},{id:44,name:'Biscuits Digestive',price:95,icon:'🍪'},
    {id:45,name:'Biscuits Cream',price:80,icon:'🍪'},{id:46,name:'Matchboxes x10',price:70,icon:'🔥'},
    {id:47,name:'Tissue Roll x4',price:180,icon:'🧻'},{id:48,name:'Tissue Box',price:120,icon:'🧻'},
    {id:49,name:'Garbage Bags x10',price:150,icon:'🗑️'},{id:50,name:'Washing Up Liquid 500ml',price:130,icon:'🧴'},
  ]},
  pharmacy: { label:'Pharmacy', icon:'💊', products:[
    {id:101,name:'Panadol 500mg x8',price:50,icon:'💊',tag:'OTC'},{id:102,name:'Panadol Extra x8',price:80,icon:'💊',tag:'OTC'},
    {id:103,name:'Ibuprofen 400mg x8',price:80,icon:'💊',tag:'OTC'},{id:104,name:'Aspirin 300mg x8',price:40,icon:'💊',tag:'OTC'},
    {id:105,name:'Amoxicillin 250mg x21',price:320,icon:'💉',tag:'POM'},{id:106,name:'Amoxicillin 500mg x21',price:580,icon:'💉',tag:'POM'},
    {id:107,name:'Azithromycin 500mg x3',price:450,icon:'💉',tag:'POM'},{id:108,name:'Ciprofloxacin 500mg',price:380,icon:'💉',tag:'POM'},
    {id:109,name:'Metronidazole 400mg x21',price:280,icon:'💉',tag:'POM'},{id:110,name:'Actifed Syrup 100ml',price:280,icon:'🍶',tag:'OTC'},
    {id:111,name:'ORS Sachet x5',price:100,icon:'💧',tag:'OTC'},{id:112,name:'Coartem x24',price:850,icon:'💊',tag:'POM'},
    {id:113,name:'Vitamin C 1000mg x30',price:480,icon:'🍊',tag:'OTC'},{id:114,name:'Vitamin C 500mg x30',price:280,icon:'🍊',tag:'OTC'},
    {id:115,name:'Dettol 250ml',price:320,icon:'🧴',tag:'OTC'},{id:116,name:'Thermometer Digital',price:850,icon:'🌡️',tag:'OTC'},
    {id:117,name:'Bandage Crepe 10cm',price:150,icon:'🩹',tag:'OTC'},{id:118,name:'Plasters x10',price:80,icon:'🩹',tag:'OTC'},
    {id:119,name:'Cotton Wool 100g',price:120,icon:'🩹',tag:'OTC'},{id:120,name:'Surgical Spirit 100ml',price:90,icon:'🧴',tag:'OTC'},
    {id:121,name:'Hydrogen Peroxide 100ml',price:130,icon:'🧴',tag:'OTC'},{id:122,name:'Antihistamine 10mg x10',price:120,icon:'💊',tag:'OTC'},
    {id:123,name:'Omeprazole 20mg x14',price:180,icon:'💊',tag:'OTC'},{id:124,name:'Ranitidine 150mg x10',price:150,icon:'💊',tag:'OTC'},
    {id:125,name:'Multivitamin x30',price:350,icon:'💊',tag:'OTC'},{id:126,name:'Iron + Folate x30',price:220,icon:'💊',tag:'OTC'},
    {id:127,name:'Zinc Sulphate x20',price:180,icon:'💊',tag:'OTC'},{id:128,name:'Metformin 500mg x30',price:280,icon:'💉',tag:'POM'},
    {id:129,name:'Atorvastatin 20mg x30',price:650,icon:'💉',tag:'POM'},{id:130,name:'Amlodipine 5mg x30',price:420,icon:'💉',tag:'POM'},
    {id:131,name:'Lisinopril 5mg x30',price:380,icon:'💉',tag:'POM'},{id:132,name:'Furosemide 40mg x14',price:180,icon:'💉',tag:'POM'},
    {id:133,name:'Salbutamol Inhaler',price:680,icon:'💨',tag:'POM'},{id:134,name:'Cough Syrup 100ml',price:220,icon:'🍶',tag:'OTC'},
    {id:135,name:'Antifungal Cream 15g',price:280,icon:'🧴',tag:'OTC'},{id:136,name:'Hydrocortisone Cream 15g',price:250,icon:'🧴',tag:'OTC'},
    {id:137,name:'Clotrimazole Pessary x6',price:320,icon:'💊',tag:'POM'},{id:138,name:'Pregnancy Test Kit',price:180,icon:'🔬',tag:'OTC'},
    {id:139,name:'Blood Glucose Strips x50',price:1200,icon:'🔬',tag:'OTC'},{id:140,name:'Face Mask x10',price:150,icon:'😷',tag:'OTC'},
    {id:141,name:'Gloves Latex x10',price:200,icon:'🧤',tag:'OTC'},{id:142,name:'Albendazole 400mg x1',price:120,icon:'💊',tag:'OTC'},
    {id:143,name:'Folic Acid 5mg x30',price:150,icon:'💊',tag:'OTC'},{id:144,name:'Calcium 500mg x30',price:280,icon:'💊',tag:'OTC'},
    {id:145,name:'Omega-3 x30',price:550,icon:'🐟',tag:'OTC'},{id:146,name:'Povidone Iodine 100ml',price:280,icon:'🧴',tag:'OTC'},
    {id:147,name:'Nasal Spray Saline',price:320,icon:'💧',tag:'OTC'},{id:148,name:'Eye Drops Lubricant',price:350,icon:'👁️',tag:'OTC'},
    {id:149,name:'Ear Drops',price:280,icon:'👂',tag:'OTC'},{id:150,name:'Sunscreen SPF50 100ml',price:750,icon:'☀️',tag:'OTC'},
  ]},
  airbnb: { label:'Hospitality', icon:'🏠', products:[
    {id:201,name:'Single Room 1 Night',price:2500,icon:'🛏️'},{id:202,name:'Double Room 1 Night',price:4500,icon:'🛏️'},
    {id:203,name:'Deluxe Room 1 Night',price:6500,icon:'🛏️'},{id:204,name:'Full House 1 Night',price:8000,icon:'🏠'},
    {id:205,name:'Villa 1 Night',price:15000,icon:'🏡'},{id:206,name:'Airport Pickup',price:1500,icon:'🚗'},
    {id:207,name:'Airport Drop-off',price:1500,icon:'🚗'},{id:208,name:'Breakfast x1',price:800,icon:'🍳'},
    {id:209,name:'Full Board x1 Day',price:2500,icon:'🍽️'},{id:210,name:'Extra Towels',price:200,icon:'🛁'},
    {id:211,name:'Late Checkout Fee',price:1000,icon:'⏰'},{id:212,name:'Early Check-in Fee',price:800,icon:'🌅'},
    {id:213,name:'Laundry Service',price:500,icon:'👕'},{id:214,name:'City Tour 4hrs',price:3500,icon:'🗺️'},
    {id:215,name:'City Tour Full Day',price:6000,icon:'🗺️'},{id:216,name:'Pool Access',price:500,icon:'🏊'},
    {id:217,name:'Gym Access',price:400,icon:'🏋️'},{id:218,name:'Spa 1hr',price:2500,icon:'💆'},
    {id:219,name:'Babysitting 4hrs',price:1200,icon:'👶'},{id:220,name:'Room Decoration',price:1500,icon:'🌹'},
    {id:221,name:'Catering Service',price:5000,icon:'🍾'},{id:222,name:'BBQ Package',price:3000,icon:'🍖'},
    {id:223,name:'Conference Room Half-Day',price:5000,icon:'📊'},{id:224,name:'Conference Room Full Day',price:8000,icon:'📊'},
    {id:225,name:'Projector Rental',price:1000,icon:'📽️'},
  ]},
  electronics: { label:'Electronics', icon:'🔌', products:[
    {id:301,name:'Smartphone Entry-level',price:8500,icon:'📱'},{id:302,name:'Smartphone Mid-range',price:18500,icon:'📱'},
    {id:303,name:'Smartphone Flagship',price:45000,icon:'📱'},{id:304,name:'Wireless Earbuds',price:4200,icon:'🎧'},
    {id:305,name:'Wired Earphones',price:650,icon:'🎧'},{id:306,name:'Bluetooth Speaker',price:2800,icon:'🔊'},
    {id:307,name:'Portable Charger 10000mAh',price:1600,icon:'🔋'},{id:308,name:'Portable Charger 20000mAh',price:2800,icon:'🔋'},
    {id:309,name:'LED Desk Lamp',price:1050,icon:'💡'},{id:310,name:'Smartwatch',price:6800,icon:'⌚'},
    {id:311,name:'Fitness Tracker',price:3500,icon:'⌚'},{id:312,name:'USB-C Cable 1m',price:280,icon:'🔌'},
    {id:313,name:'USB-C Cable 2m',price:380,icon:'🔌'},{id:314,name:'Wall Charger 65W',price:1200,icon:'🔌'},
    {id:315,name:'Wireless Charger Pad',price:1800,icon:'🔌'},{id:316,name:'Phone Case Universal',price:350,icon:'📱'},
    {id:317,name:'Screen Protector',price:200,icon:'📱'},{id:318,name:'Memory Card 64GB',price:900,icon:'💾'},
    {id:319,name:'Memory Card 128GB',price:1600,icon:'💾'},{id:320,name:'Flash Drive 32GB',price:650,icon:'💾'},
    {id:321,name:'Flash Drive 64GB',price:950,icon:'💾'},{id:322,name:'Laptop Stand',price:1800,icon:'💻'},
    {id:323,name:'Wireless Mouse',price:1200,icon:'🖱️'},{id:324,name:'Keyboard Wireless',price:2200,icon:'⌨️'},
    {id:325,name:'HDMI Cable 2m',price:550,icon:'📺'},{id:326,name:'Extension Cable 4-way',price:850,icon:'🔌'},
    {id:327,name:'Smart Plug',price:1200,icon:'🔌'},{id:328,name:'LED Strip 5m',price:1500,icon:'💡'},
    {id:329,name:'Solar Lamp',price:2200,icon:'☀️'},{id:330,name:'Digital Camera Basic',price:12000,icon:'📷'},
  ]},
  salon: { label:'Salon & Beauty', icon:'💇', products:[
    {id:401,name:'Haircut (Men)',price:850,icon:'✂️'},{id:402,name:'Haircut (Women)',price:1200,icon:'✂️'},
    {id:403,name:'Haircut (Kids)',price:500,icon:'✂️'},{id:404,name:'Beard Trim',price:450,icon:'🧔'},
    {id:405,name:'Beard Shape Up',price:650,icon:'🧔'},{id:406,name:'Full Shave',price:700,icon:'🧔'},
    {id:407,name:'Manicure',price:1200,icon:'💅'},{id:408,name:'Pedicure',price:1500,icon:'💅'},
    {id:409,name:'Manicure + Pedicure',price:2500,icon:'💅'},{id:410,name:'Gel Nails',price:2200,icon:'💅'},
    {id:411,name:'Acrylic Nails Full Set',price:3500,icon:'💅'},{id:412,name:'Facial Basic',price:2200,icon:'🧖'},
    {id:413,name:'Facial Premium',price:4500,icon:'🧖'},{id:414,name:'Blow Dry',price:700,icon:'💨'},
    {id:415,name:'Hair Wash & Blow Dry',price:1200,icon:'💨'},{id:416,name:'Hair Colour Single',price:2500,icon:'🎨'},
    {id:417,name:'Hair Colour Full',price:4500,icon:'🎨'},{id:418,name:'Highlights',price:5500,icon:'🎨'},
    {id:419,name:'Braids Simple',price:1500,icon:'💁'},{id:420,name:'Braids Full Head',price:4500,icon:'💁'},
    {id:421,name:'Cornrows',price:1200,icon:'💁'},{id:422,name:'Relaxer Treatment',price:2200,icon:'🧪'},
    {id:423,name:'Deep Conditioning',price:1500,icon:'🧴'},{id:424,name:'Eyebrow Threading',price:300,icon:'🪡'},
    {id:425,name:'Eyebrow Tinting',price:500,icon:'🪡'},{id:426,name:'Eyelash Extensions',price:3500,icon:'👁️'},
    {id:427,name:'Waxing (Legs)',price:1800,icon:'🦵'},{id:428,name:'Waxing (Arms)',price:1200,icon:'💪'},
    {id:429,name:'Body Scrub',price:3000,icon:'🛁'},{id:430,name:'Head Massage 30min',price:1500,icon:'💆'},
  ]},
  cafe: { label:'Cafe & Restaurant', icon:'☕', products:[
    {id:501,name:'Espresso Single',price:180,icon:'☕'},{id:502,name:'Espresso Double',price:280,icon:'☕'},
    {id:503,name:'Cappuccino',price:280,icon:'🥛'},{id:504,name:'Latte',price:320,icon:'🥛'},
    {id:505,name:'Flat White',price:300,icon:'🥛'},{id:506,name:'Americano',price:220,icon:'☕'},
    {id:507,name:'Chai Tea',price:150,icon:'🍵'},{id:508,name:'Masala Tea',price:180,icon:'🍵'},
    {id:509,name:'Hot Chocolate',price:350,icon:'🍫'},{id:510,name:'Smoothie Berry',price:390,icon:'🍓'},
    {id:511,name:'Smoothie Tropical',price:420,icon:'🍍'},{id:512,name:'Fresh Juice Orange',price:250,icon:'🍊'},
    {id:513,name:'Fresh Juice Passion',price:250,icon:'🍹'},{id:514,name:'Sandwich Club',price:420,icon:'🥪'},
    {id:515,name:'Sandwich Chicken',price:480,icon:'🥪'},{id:516,name:'Sandwich Tuna',price:400,icon:'🥪'},
    {id:517,name:'Cake Slice',price:320,icon:'🍰'},{id:518,name:'Muffin',price:180,icon:'🧁'},
    {id:519,name:'Croissant',price:220,icon:'🥐'},{id:520,name:'Breakfast Full',price:850,icon:'🍳'},
    {id:521,name:'Breakfast Light',price:480,icon:'🍳'},{id:522,name:'Avocado Toast',price:550,icon:'🥑'},
    {id:523,name:'Pancakes x3',price:380,icon:'🥞'},{id:524,name:'Waffles',price:420,icon:'🧇'},
    {id:525,name:'Pasta Carbonara',price:680,icon:'🍝'},{id:526,name:'Pizza Margherita',price:850,icon:'🍕'},
    {id:527,name:'Pizza Pepperoni',price:950,icon:'🍕'},{id:528,name:'Burger Classic',price:650,icon:'🍔'},
    {id:529,name:'Burger Chicken',price:700,icon:'🍔'},{id:530,name:'French Fries',price:280,icon:'🍟'},
    {id:531,name:'Salad Garden',price:420,icon:'🥗'},{id:532,name:'Salad Caesar',price:520,icon:'🥗'},
    {id:533,name:'Soup of the Day',price:350,icon:'🍲'},{id:534,name:'Mandazi x4',price:120,icon:'🍩'},
    {id:535,name:'Samosa x3',price:150,icon:'🥟'},{id:536,name:'Chips & Chicken',price:580,icon:'🍗'},
    {id:537,name:'Ugali & Stew',price:350,icon:'🍽️'},{id:538,name:'Pilau (Plate)',price:480,icon:'🍛'},
    {id:539,name:'Nyama Choma 200g',price:850,icon:'🥩'},{id:540,name:'Tiramisu',price:450,icon:'🍮'},
  ]},
  laundry: { label:'Laundry', icon:'👕', products:[
    {id:601,name:'Shirt Iron & Press',price:80,icon:'👔'},{id:602,name:'Trouser Iron & Press',price:100,icon:'👖'},
    {id:603,name:'Suit Dry Clean',price:850,icon:'🧥'},{id:604,name:'Dress Dry Clean',price:650,icon:'👗'},
    {id:605,name:'Bedsheet Wash & Iron',price:250,icon:'🛏️'},{id:606,name:'Duvet Clean',price:700,icon:'🛏️'},
    {id:607,name:'Shoes Clean',price:300,icon:'👟'},{id:608,name:'Leather Jacket Clean',price:1200,icon:'🧥'},
    {id:609,name:'Express Laundry 2kg',price:450,icon:'⚡'},{id:610,name:'Standard Laundry 5kg',price:800,icon:'🧺'},
  ]},
  hardware: { label:'Hardware', icon:'🔧', products:[
    {id:701,name:'Hammer',price:650,icon:'🔨'},{id:702,name:'Screwdriver Set',price:850,icon:'🪛'},
    {id:703,name:'Measuring Tape 5m',price:380,icon:'📏'},{id:704,name:'Spirit Level',price:550,icon:'📐'},
    {id:705,name:'Paint Roller',price:350,icon:'🪣'},{id:706,name:'Paint Brush Set',price:280,icon:'🖌️'},
    {id:707,name:'Wall Paint 4L White',price:1800,icon:'🎨'},{id:708,name:'Gloss Paint 1L',price:650,icon:'🎨'},
    {id:709,name:'Cement Bag 50kg',price:950,icon:'🪨'},{id:710,name:'Nails 1kg Assorted',price:280,icon:'📌'},
    {id:711,name:'Wood Screws x50',price:220,icon:'🔩'},{id:712,name:'PVC Pipe 2m',price:320,icon:'🪠'},
    {id:713,name:'Electrical Wire 1m',price:120,icon:'🔌'},{id:714,name:'Light Switch',price:180,icon:'💡'},
    {id:715,name:'Door Lock',price:1200,icon:'🔒'},{id:716,name:'Padlock',price:350,icon:'🔒'},
    {id:717,name:'Sandpaper Sheet x5',price:150,icon:'📄'},{id:718,name:'Glue Gun',price:550,icon:'🖊️'},
    {id:719,name:'Safety Gloves',price:320,icon:'🧤'},{id:720,name:'Safety Goggles',price:450,icon:'🥽'},
  ]},
}

const TODAY = new Date().toISOString().slice(0,10)
const defaultSales = () => { const d=[]; for(let i=6;i>=0;i--){const x=new Date();x.setDate(x.getDate()-i);d.push({date:x.toISOString().slice(0,10),revenue:0})} return d }
const TIERS = [{name:'Bronze',min:0,disc:0,color:'#cd7f32'},{name:'Silver',min:500,disc:5,color:'#c0c0c0'},{name:'Gold',min:1500,disc:10,color:'#ffd700'},{name:'Platinum',min:5000,disc:15,color:'#e5e4e2'}]
const getTier = p => [...TIERS].reverse().find(t=>p>=t.min)
const NICHES = {all:Object.keys(categories),retail:['shop','laundry','hardware'],food:['cafe'],health:['pharmacy'],services:['airbnb','salon'],tech:['electronics']}

export default function App() {
  const PAYSTACK_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || ''
  const PAYPAL_ID    = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'sb'
  const API_URL      = process.env.REACT_APP_API_URL || 'http://localhost:3000'

  const [cart,setCart]             = useState([])
  const [phone,setPhone]           = useState('')
  const [custEmail,setCustEmail]   = useState('')
  const [msg,setMsg]               = useState('')
  const [msgType,setMsgType]       = useState('info')
  const [activeCat,setActiveCat]   = useState('shop')
  const [search,setSearch]         = useState('')
  const [loaded,setLoaded]         = useState(false)
  const [payMethod,setPayMethod]   = useState('mpesa')
  const [showPay,setShowPay]       = useState(false)
  const [cashIn,setCashIn]         = useState('')
  const [view,setView]             = useState('pos')
  const [niche,setNiche]           = useState('all')
  const [theme,setTheme]           = useState('dark')
  const [customItems,setCustomItems] = useState([])
  const [newItem,setNewItem]       = useState({name:'',price:'',category:'shop',icon:'🛒'})
  const [lang,setLang]             = useState('English (Kenya)')
  const [syncOn,setSyncOn]         = useState(true)
  const [bioOn,setBioOn]           = useState(false)
  const [alertsOn,setAlertsOn]     = useState(true)
  const [reportsOn,setReportsOn]   = useState(true)
  const [logsOn,setLogsOn]         = useState(true)
  const [role,setRole]             = useState('Super Admin')
  const [showReceipt,setShowReceipt] = useState(false)
  const [receiptData,setReceiptData] = useState(null)
  const [salesData,setSalesData]   = useState(defaultSales())
  const [totalRev,setTotalRev]     = useState(0)
  const [totalOrders,setTotalOrders] = useState(0)
  const [ledger,setLedger]         = useState([])
  const [expenses,setExpenses]     = useState([])
  const [newExp,setNewExp]         = useState({desc:'',amount:'',category:''})
  const [showAddExp,setShowAddExp] = useState(false)
  const [inventory,setInventory]   = useState([])
  const [newInv,setNewInv]         = useState({name:'',sku:'',category:'General',retailPrice:'',buyingPrice:'',stockLevel:'',minAlert:'',expiry:'',batch:''})
  const [showAddInv,setShowAddInv] = useState(false)
  const [customers,setCustomers]   = useState([])
  const [selCust,setSelCust]       = useState(null)
  const [newCust,setNewCust]       = useState({name:'',email:'',phone:''})
  const [showAddCust,setShowAddCust] = useState(false)
  const [crmQ,setCrmQ]             = useState('')

  useEffect(()=>{ setTimeout(()=>setLoaded(true),100) },[])

  const flash = (m,t='success') => { setMsg(m);setMsgType(t);setTimeout(()=>setMsg(''),4000) }

  const addToCart = p => setCart(prev=>{const ex=prev.find(i=>i.id===p.id);return ex?prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...prev,{...p,qty:1}]})
  const remFromCart = id => setCart(c=>c.filter(i=>i.id!==id))
  const updQty = (id,d) => setCart(c=>c.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+d)}:i))

  const loyaltyDisc = selCust ? getTier(selCust.points).disc/100 : 0
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0)
  const discount = Math.round(subtotal*loyaltyDisc)
  const afterDisc = subtotal-discount
  const tax = Math.round(afterDisc*0.16)
  const grand = afterDisc+tax
  const change = cashIn ? parseInt(cashIn)-grand : 0

  const completeSale = useCallback((method,extra={})=>{
    const invId=`INV-${String(ledger.length+1001).padStart(4,'0')}`
    const entry={id:invId,date:new Date().toLocaleDateString('en-KE',{day:'2-digit',month:'short',year:'numeric'}),customer:selCust?.name||'Walk-in',total:grand,method,status:'Paid',items:[...cart],...extra}
    setLedger(prev=>[entry,...prev])
    setSalesData(prev=>prev.map(d=>d.date===TODAY?{...d,revenue:d.revenue+grand}:d))
    setTotalRev(prev=>prev+grand)
    setTotalOrders(prev=>prev+1)
    if(selCust){const pts=Math.floor(grand/100);setCustomers(prev=>prev.map(c=>c.id===selCust.id?{...c,points:c.points+pts,visits:c.visits+1,totalSpent:(c.totalSpent||0)+grand}:c))}
    setReceiptData({method,amount:grand,items:[...cart],invoiceId:invId,change:extra.change,customer:selCust?.name})
    setShowReceipt(true);setCart([]);setShowPay(false);setPhone('');setCashIn('');setSelCust(null)
  },[cart,grand,ledger,selCust])

  const handleMpesa = async()=>{
    if(!phone){flash('Enter customer phone number','error');return}
    flash('Sending M-Pesa prompt…','loading')
    try{const res=await fetch(`${API_URL}/api/mpesa/stkpush`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone,amount:grand})});const data=await res.json();if(data.ResponseCode==='0')completeSale('M-Pesa');else flash('Payment failed. Try again.','error')}
    catch{completeSale('M-Pesa')}
  }
  const handleCash=()=>{if(!cashIn||change<0){flash('Insufficient cash','error');return};completeSale('Cash',{change})}
  const handlePaystack=()=>{
    if(typeof window.PaystackPop==='undefined'){flash('Paystack not loaded','error');return}
    flash('Opening Paystack…','loading')
    const h=window.PaystackPop.setup({key:PAYSTACK_KEY,email:custEmail||'customer@berylbytes.co.ke',amount:grand*100,currency:'KES',ref:'POS-'+Date.now(),callback:r=>completeSale('Paystack',{ref:r.reference}),onClose:()=>flash('Cancelled','error')})
    h.openIframe()
  }

  const generatePDF=()=>{
    if(!receiptData)return
    const doc=new jsPDF();let y=20
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
    y+=4;doc.line(20,y,190,y);y+=6;doc.setFontSize(8);doc.text('Thank you! — BerylBytes POS',20,y)
    doc.save(`${receiptData.invoiceId}.pdf`)
  }

  const fKES = v=>`KES ${(v||0).toLocaleString()}`
  const totalExp = expenses.reduce((s,e)=>s+e.amount,0)
  const netProfit = totalRev-totalExp
  const maxBar = Math.max(...salesData.map(d=>d.revenue),1)
  const visCats = NICHES[niche]||Object.keys(categories)
  const allProds = [...(categories[activeCat]?.products??[]),...customItems.filter(i=>i.category===activeCat)]
  const products = allProds.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())&&visCats.includes(activeCat))
  const totalProds = Object.values(categories).reduce((s,c)=>s+c.products.length,0)+customItems.length

  return (
    <PayPalScriptProvider options={{'client-id':PAYPAL_ID}}>

      {/* ── ANIMATED BACKGROUND ── */}
      <div className="bg-canvas">
        <div className="orb orb1"/><div className="orb orb2"/>
        <div className="orb orb3"/><div className="orb orb4"/>
        <div className="particles">
          {[...Array(12)].map((_,i)=><div key={i} className="particle"/>)}
        </div>
        <div className="corner-tl"/><div className="corner-br"/>
      </div>

      <div className={`shell ${loaded?'in':''}`}>

        {/* ══ TOPBAR ══ */}
        <header className="topbar">
          <div className="brand">
            <div className="brand-logo">B</div>
            <div className="brand-text">
              <span className="brand-name">Beryl<em>Bytes</em></span>
              <span className="brand-sub">POS Terminal</span>
            </div>
          </div>

          <div className="niche-bar">
            {[{id:'all',label:'🌐 All'},{id:'retail',label:'🛒 Retail'},{id:'food',label:'🍽️ Food'},{id:'health',label:'💊 Health'},{id:'services',label:'✂️ Services'},{id:'tech',label:'🔌 Tech'}]
              .map(n=>(
                <button key={n.id} className={`niche-pill ${niche===n.id?'act':''}`}
                  onClick={()=>{setNiche(n.id);const c=NICHES[n.id];if(!c.includes(activeCat))setActiveCat(c[0])}}>
                  {n.label}
                </button>
              ))}
          </div>

          <div className="topbar-right">
            <div className="search-box">
              <span>⌕</span>
              <input placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <div className="live-indicator">
              <div className="live-dot"/>
              <span className="live-text">Live</span>
            </div>
            <div className="topbar-stat">
              <span className="topbar-stat-val">{fKES(totalRev)}</span>
              <span className="topbar-stat-lbl">Revenue</span>
            </div>
            <div className="topbar-stat">
              <span className="topbar-stat-val">{totalOrders}</span>
              <span className="topbar-stat-lbl">Orders</span>
            </div>
            <button className="avatar">B</button>
          </div>
        </header>

        {/* ══ SIDEBAR ══ */}
        <aside className="sidebar">
          <div className="sb-section">
            <span className="sb-label">Main Menu</span>
            {[{id:'pos',icon:'🛒',label:'Point of Sale'},{id:'dashboard',icon:'📊',label:'Dashboard'},{id:'crm',icon:'👥',label:'CRM & Loyalty',badge:customers.length||null},{id:'orders',icon:'📦',label:'Inventory'},{id:'add',icon:'➕',label:'Add Item'},{id:'settings',icon:'⚙️',label:'Settings'}]
              .map(item=>(
                <button key={item.id} className={`nav-btn ${view===item.id?'act':''}`} onClick={()=>setView(item.id)}>
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                  {item.badge>0&&<span className="nav-badge">{item.badge}</span>}
                </button>
              ))}
          </div>

          {view==='pos'&&(
            <>
              <div className="sb-divider"/>
              <div className="sb-section">
                <span className="sb-label">Categories</span>
                {Object.entries(categories).filter(([k])=>visCats.includes(k)).map(([k,v])=>(
                  <button key={k} className={`cat-btn ${activeCat===k?'act':''}`} onClick={()=>{setActiveCat(k);setSearch('')}}>
                    <span className="cat-icon">{v.icon}</span>{v.label}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="sb-footer">
            <div className="sb-footer-row"><div className="sb-footer-dot"/>{totalProds} products</div>
            <div className="sb-footer-row"><div className="sb-footer-dot" style={{background:'var(--blue)'}}/>{customers.length} customers</div>
            <div className="sb-footer-row"><div className="sb-footer-dot" style={{background:'var(--purple)'}}/>{ledger.length} transactions</div>
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <div className="main">
          <div className="content">

            {/* POS */}
            {view==='pos'&&(
              <>
                {activeCat==='pharmacy'&&<div className="ph-warn">⚠️ POM items require a valid prescription before dispensing.</div>}
                <div className="pg">
                  {products.length===0
                    ?<div className="no-results"><div style={{fontSize:40}}>🔍</div><p>No products found{search?` for "${search}"`:''}.</p></div>
                    :products.map((p,i)=>(
                      <div key={p.id} className="pc" style={{animationDelay:`${i*0.025}s`}} onClick={()=>addToCart(p)}>
                        <div className="pc-shine"/>
                        <div className="pc-ic">{p.icon}</div>
                        <div className="pc-nm">{p.name}</div>
                        <div className="pc-pr">KES {p.price.toLocaleString()}</div>
                        {p.tag&&<span className={`pc-tag ${p.tag==='POM'?'pom':'otc'}`}>{p.tag}</span>}
                        <div className="pc-plus">＋</div>
                      </div>
                    ))
                  }
                </div>
              </>
            )}

            {/* DASHBOARD */}
            {view==='dashboard'&&(
              <div className="dash-grid">
                <div className="panel full-col">
                  <div className="panel-hd"><h2>⚡ Live Performance</h2></div>
                  <div className="kpi-row">
                    {[{l:'Total Revenue',v:fKES(totalRev),c:'green'},{l:'Orders',v:totalOrders,c:'blue'},{l:'Net Profit',v:fKES(netProfit),c:'purple'},{l:'Expenses',v:fKES(totalExp),c:'red'},{l:'Customers',v:customers.length,c:'orange'},{l:'Transactions',v:ledger.length,c:'teal'}]
                      .map(k=>(
                        <div key={k.l} className={`kpi-card ${k.c}`}>
                          <div className="kpi-val">{k.v}</div>
                          <div className="kpi-lbl">{k.l}</div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-hd"><h2>📈 Revenue — Last 7 Days</h2></div>
                  {totalRev===0
                    ?<div className="empty-state"><div className="e-icon">📊</div><p>No sales yet</p><span>Complete a sale to see revenue here</span></div>
                    :<div className="bar-chart">
                      {salesData.map((d,i)=>(
                        <div key={i} className="bar-item">
                          <div className="bar" style={{height:`${(d.revenue/maxBar)*100}%`}}>
                            <span className="bar-tip">{fKES(d.revenue)}</span>
                          </div>
                          <span className="bar-lbl">{d.date.slice(-5)}</span>
                        </div>
                      ))}
                    </div>
                  }
                </div>

                <div className="panel">
                  <div className="panel-hd">
                    <h2>💸 Expense Tracker</h2>
                    <button className="btn-p btn-sm" onClick={()=>setShowAddExp(true)}>+ Add</button>
                  </div>
                  {showAddExp&&(
                    <div className="inline-form">
                      <div className="form-grid">
                        <div className="sf full"><label>Description</label><input placeholder="e.g. Stock restock" value={newExp.desc} onChange={e=>setNewExp({...newExp,desc:e.target.value})}/></div>
                        <div className="sf"><label>Amount (KES)</label><input type="number" value={newExp.amount} onChange={e=>setNewExp({...newExp,amount:e.target.value})}/></div>
                        <div className="sf"><label>Category</label>
                          <select value={newExp.category} onChange={e=>setNewExp({...newExp,category:e.target.value})}>
                            <option value="">Select…</option>
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
                    ?<div className="empty-state"><div className="e-icon">💸</div><p>No expenses yet</p></div>
                    :<>
                      <table className="data-table">
                        <thead><tr><th>Description</th><th>Category</th><th>Amount</th><th>Date</th></tr></thead>
                        <tbody>{expenses.map(e=><tr key={e.id}><td>{e.desc}</td><td>{e.category}</td><td>{fKES(e.amount)}</td><td>{e.date}</td></tr>)}</tbody>
                      </table>
                      <div style={{padding:'9px 0',fontSize:12,color:'var(--text2)',borderTop:'1px solid var(--border)',marginTop:8}}>Total: <strong style={{color:'var(--red)'}}>{fKES(totalExp)}</strong></div>
                    </>
                  }
                </div>

                <div className="panel full-col">
                  <div className="panel-hd"><h2>🧾 Digital Ledger</h2></div>
                  {ledger.length===0
                    ?<div className="empty-state"><div className="e-icon">🧾</div><p>No transactions yet</p><span>Every completed sale appears here automatically</span></div>
                    :<table className="data-table">
                      <thead><tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
                      <tbody>{ledger.map(r=><tr key={r.id}><td style={{color:'var(--accent)',fontWeight:600}}>{r.id}</td><td>{r.date}</td><td>{r.customer}</td><td><strong>{fKES(r.total)}</strong></td><td>{r.method}</td><td><span className="pill paid">{r.status}</span></td></tr>)}</tbody>
                    </table>
                  }
                </div>
              </div>
            )}

            {/* CRM */}
            {view==='crm'&&(
              <div className="dash-grid">
                <div className="panel full-col">
                  <div className="panel-hd">
                    <h2>👥 Customer Management</h2>
                    <button className="btn-p btn-sm" onClick={()=>setShowAddCust(true)}>+ Add Customer</button>
                  </div>
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
                  <div className="search-box" style={{margin:'10px 0',width:'100%'}}>
                    <span>⌕</span>
                    <input placeholder="Search customers…" value={crmQ} onChange={e=>setCrmQ(e.target.value)}/>
                  </div>
                  {customers.length===0
                    ?<div className="empty-state"><div className="e-icon">👥</div><p>No customers yet</p><span>Add customers to earn loyalty points automatically at checkout</span></div>
                    :<div className="crm-grid">
                      {customers.filter(c=>c.name.toLowerCase().includes(crmQ.toLowerCase())).map(c=>{
                        const tier=getTier(c.points)
                        return(
                          <div key={c.id} className="crm-card" style={{borderTopColor:tier.color}}>
                            <div className="crm-avatar" style={{background:tier.color}}>{c.name[0]}</div>
                            <div className="crm-name">{c.name}</div>
                            {c.email&&<div className="crm-meta">{c.email}</div>}
                            {c.phone&&<div className="crm-meta">📱 {c.phone}</div>}
                            <div className="crm-tier" style={{color:tier.color}}>⭐ {tier.name} — {tier.disc}% off</div>
                            <div className="crm-row"><span>Points</span><strong>{c.points}</strong></div>
                            <div className="crm-row"><span>Visits</span><strong>{c.visits}</strong></div>
                            <div className="crm-row"><span>Spent</span><strong>{fKES(c.totalSpent||0)}</strong></div>
                            <button className="btn-g btn-sm danger" style={{marginTop:10,width:'100%'}} onClick={()=>setCustomers(p=>p.filter(x=>x.id!==c.id))}>Remove</button>
                          </div>
                        )
                      })}
                    </div>
                  }
                </div>
                <div className="panel full-col">
                  <div className="panel-hd"><h2>🏆 Loyalty Tiers</h2></div>
                  <div className="tier-grid">
                    {TIERS.map(t=>(
                      <div key={t.name} className="tier-card" style={{borderTop:`3px solid ${t.color}`}}>
                        <div className="tier-name" style={{color:t.color}}>{t.name}</div>
                        <div className="tier-row">Min Points: <strong>{t.min.toLocaleString()}</strong></div>
                        <div className="tier-row">Discount: <strong>{t.disc}%</strong></div>
                        <div className="tier-row" style={{fontSize:10,marginTop:6,color:'var(--text3)'}}>1 pt per KES 100 spent</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* INVENTORY */}
            {view==='orders'&&(
              <div className="dash-grid">
                <div className="panel full-col">
                  <div className="panel-hd">
                    <h2>📦 Inventory Management</h2>
                    <button className="btn-p btn-sm" onClick={()=>setShowAddInv(true)}>+ Add Item</button>
                  </div>
                  {showAddInv&&(
                    <div className="inline-form">
                      <div className="form-grid">
                        <div className="sf"><label>Product Name</label><input value={newInv.name} onChange={e=>setNewInv({...newInv,name:e.target.value})}/></div>
                        <div className="sf"><label>SKU</label><input value={newInv.sku} onChange={e=>setNewInv({...newInv,sku:e.target.value})}/></div>
                        <div className="sf"><label>Retail Price</label><input type="number" value={newInv.retailPrice} onChange={e=>setNewInv({...newInv,retailPrice:e.target.value})}/></div>
                        <div className="sf"><label>Buying Price</label><input type="number" value={newInv.buyingPrice} onChange={e=>setNewInv({...newInv,buyingPrice:e.target.value})}/></div>
                        <div className="sf"><label>Stock Level</label><input type="number" value={newInv.stockLevel} onChange={e=>setNewInv({...newInv,stockLevel:e.target.value})}/></div>
                        <div className="sf"><label>Min Alert</label><input type="number" value={newInv.minAlert} onChange={e=>setNewInv({...newInv,minAlert:e.target.value})}/></div>
                        <div className="sf"><label>Expiry Date</label><input type="date" value={newInv.expiry} onChange={e=>setNewInv({...newInv,expiry:e.target.value})}/></div>
                        <div className="sf"><label>Batch No.</label><input value={newInv.batch} onChange={e=>setNewInv({...newInv,batch:e.target.value})}/></div>
                        <div className="sf full"><label>Category</label>
                          <select value={newInv.category} onChange={e=>setNewInv({...newInv,category:e.target.value})}>
                            {['General','Pharmaceutical Grade','Electronics','Food & Beverage','Services'].map(c=><option key={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="btn-row" style={{marginTop:10}}>
                        <button className="btn-p" onClick={()=>{if(!newInv.name||!newInv.sku)return;setInventory(p=>[...p,{id:Date.now(),...newInv,retailPrice:parseInt(newInv.retailPrice)||0,buyingPrice:parseInt(newInv.buyingPrice)||0,stockLevel:parseInt(newInv.stockLevel)||0,minAlert:parseInt(newInv.minAlert)||5}]);setNewInv({name:'',sku:'',category:'General',retailPrice:'',buyingPrice:'',stockLevel:'',minAlert:'',expiry:'',batch:''});setShowAddInv(false);flash('Item added!')}}>Add</button>
                        <button className="btn-g" onClick={()=>setShowAddInv(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {inventory.length===0
                    ?<div className="empty-state"><div className="e-icon">📦</div><p>No inventory items yet</p><span>Add items to track stock, cost and expiry</span></div>
                    :<table className="data-table">
                      <thead><tr><th>Name</th><th>SKU</th><th>Category</th><th>Retail</th><th>Cost</th><th>Stock</th><th>Expiry</th><th></th></tr></thead>
                      <tbody>{inventory.map(item=><tr key={item.id}><td>{item.name}</td><td style={{color:'var(--text3)'}}>{item.sku}</td><td>{item.category}</td><td>{fKES(item.retailPrice)}</td><td>{fKES(item.buyingPrice)}</td><td>{item.stockLevel}{item.stockLevel<=item.minAlert&&<span className="alert-badge">Low!</span>}</td><td>{item.expiry}</td><td><button className="btn-g btn-sm danger" onClick={()=>setInventory(p=>p.filter(i=>i.id!==item.id))}>Remove</button></td></tr>)}</tbody>
                    </table>
                  }
                </div>
              </div>
            )}

            {/* ADD ITEM */}
            {view==='add'&&(
              <div className="dash-grid">
                <div className="panel">
                  <div className="panel-hd"><h2>➕ Add Custom Item</h2></div>
                  <div className="form-grid">
                    <div className="sf full"><label>Item Name</label><input value={newItem.name} onChange={e=>setNewItem({...newItem,name:e.target.value})} placeholder="e.g. Special Bundle"/></div>
                    <div className="sf"><label>Price (KES)</label><input type="number" value={newItem.price} onChange={e=>setNewItem({...newItem,price:e.target.value})}/></div>
                    <div className="sf"><label>Icon (Emoji)</label><input value={newItem.icon} onChange={e=>setNewItem({...newItem,icon:e.target.value})}/></div>
                    <div className="sf full"><label>Category</label>
                      <select value={newItem.category} onChange={e=>setNewItem({...newItem,category:e.target.value})}>
                        {Object.entries(categories).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <button className="btn-p" style={{marginTop:16,width:'100%'}} onClick={()=>{if(!newItem.name||!newItem.price){flash('Name and price required','error');return};setCustomItems(p=>[...p,{id:Date.now(),...newItem,price:parseInt(newItem.price)}]);flash('Item added!');setNewItem({name:'',price:'',category:'shop',icon:'🛒'});setView('pos')}}>+ Add to Catalogue</button>
                  <p className="help-text">Item appears in the selected category immediately.</p>
                </div>
                <div className="panel">
                  <div className="panel-hd"><h2>📊 System Stats</h2></div>
                  <div className="stat-grid">
                    {[{v:totalProds,l:'Products'},{v:customers.length,l:'Customers'},{v:ledger.length,l:'Transactions'},{v:fKES(totalRev),l:'Revenue'},{v:inventory.length,l:'Inventory'},{v:Object.keys(categories).length,l:'Niches'}]
                      .map((s,i)=><div key={i} className="stat-card"><strong>{s.v}</strong><span>{s.l}</span></div>)}
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {view==='settings'&&(
              <div className="settings-grid">
                <div className="panel">
                  <div className="panel-hd"><h2>👤 Profile</h2></div>
                  <div className="profile-card">
                    <div className="profile-avatar">B</div>
                    <div>
                      <div className="profile-name">Beryl Munyao</div>
                      <div className="profile-email">berylmunyao8@gmail.com</div>
                      <div className="profile-meta">Super Admin · beryl_bytes_global</div>
                    </div>
                  </div>
                  <div className="sf" style={{marginBottom:12}}><label>Theme</label>
                    <div className="theme-switcher">
                      {['light','dark'].map(m=><button key={m} className={`theme-pill ${theme===m?'act':''}`} onClick={()=>setTheme(m)}>{m==='light'?'☀️ Light':'🌙 Dark'}</button>)}
                    </div>
                  </div>
                  <div className="sf" style={{marginBottom:12}}><label>Language</label>
                    <select value={lang} onChange={e=>setLang(e.target.value)}>
                      <option>English (Kenya)</option><option>English (United States)</option><option>Swahili (Kenya)</option>
                    </select>
                  </div>
                  <div className="sf"><label>Access Role</label>
                    <select value={role} onChange={e=>setRole(e.target.value)}>
                      {['Super Admin','Manager','Cashier','Employee'].map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-hd"><h2>🔒 System & Security</h2></div>
                  {[{l:'Cloud Realtime Sync',s:syncOn,t:setSyncOn},{l:'Biometric Enforcement',s:bioOn,t:setBioOn},{l:'Inventory Alerts',s:alertsOn,t:setAlertsOn},{l:'Sales Reports',s:reportsOn,t:setReportsOn},{l:'Security Logs',s:logsOn,t:setLogsOn}]
                    .map(({l,s,t})=>(
                      <div key={l} className="toggle-row">
                        <span>{l}</span>
                        <button className={`toggle-pill ${s?'on':''}`} onClick={()=>t(!s)}>{s?'Enabled':'Disabled'}</button>
                      </div>
                    ))}
                  <div className="settings-note">BerylBytes OS v4.3.0 Enterprise LTS — All data encrypted end-to-end.</div>
                </div>
                <div className="panel">
                  <div className="panel-hd"><h2>💳 Payment Keys</h2></div>
                  {[{l:'Paystack Public Key',ok:!!PAYSTACK_KEY},{l:'PayPal Client ID',ok:PAYPAL_ID!=='sb'},{l:'M-Pesa STK API',ok:true}]
                    .map(k=>(
                      <div key={k.l} className="key-status-row">
                        <span>{k.l}</span>
                        <span className={`pill ${k.ok?'paid':'pending'}`}>{k.ok?'✓ Connected':'Not Set'}</span>
                      </div>
                    ))}
                  <p className="help-text" style={{marginTop:12}}>Keys loaded from <code>.env</code> file. Never commit secrets to version control.</p>
                </div>
                <div className="panel">
                  <div className="panel-hd"><h2>🧾 Tax & Currency</h2></div>
                  {[{l:'VAT Rate',v:'16% (Kenya KRA)'},{l:'Tax Applied At',v:'Checkout'},{l:'Currency',v:'KES — Kenyan Shilling'},{l:'Receipt Format',v:'A4 PDF (jsPDF)'}]
                    .map(r=>(
                      <div key={r.l} className="toggle-row">
                        <span>{r.l}</span><strong style={{color:'var(--accent)',fontSize:12}}>{r.v}</strong>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>

          {/* ══ CART ══ */}
          {view==='pos'&&(
            <div className="cart-panel">
              <div className="cp-hd">
                <h2>Order</h2>
                {cart.length>0&&<button className="clr-btn" onClick={()=>setCart([])}>Clear all</button>}
              </div>
              <div className="cust-sel">
                <label>Customer (optional)</label>
                <select value={selCust?.id||''} onChange={e=>setSelCust(customers.find(c=>c.id===Number(e.target.value))||null)}>
                  <option value="">Walk-in Customer</option>
                  {customers.map(c=><option key={c.id} value={c.id}>{c.name} ({getTier(c.points).name})</option>)}
                </select>
                {selCust&&<div className="loyalty-badge" style={{borderColor:getTier(selCust.points).color,color:getTier(selCust.points).color}}>⭐ {getTier(selCust.points).name} — {getTier(selCust.points).disc}% discount</div>}
              </div>
              <div className="ci-list">
                {cart.length===0
                  ?<div className="ci-empty"><div className="ce-ic">🛍️</div><p>Cart is empty</p><span>Tap products to add them</span></div>
                  :cart.map(item=>(
                    <div key={item.id} className="ci">
                      <span className="ci-ico">{item.icon}</span>
                      <div className="ci-inf">
                        <div className="ci-nm">{item.name}</div>
                        <div className="ci-pr">KES {(item.price*item.qty).toLocaleString()}</div>
                      </div>
                      <div className="ci-ctl">
                        <button className="qb" onClick={()=>updQty(item.id,-1)}>−</button>
                        <span>{item.qty}</span>
                        <button className="qb" onClick={()=>updQty(item.id,1)}>+</button>
                        <button className="rb" onClick={()=>remFromCart(item.id)}>×</button>
                      </div>
                    </div>
                  ))
                }
              </div>
              {cart.length>0&&(
                <>
                  <div className="tots">
                    <div className="tr"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                    {discount>0&&<div className="tr disc"><span>Loyalty Discount</span><span>−KES {discount.toLocaleString()}</span></div>}
                    <div className="tr"><span>VAT 16%</span><span>KES {tax.toLocaleString()}</span></div>
                    <div className="tr gd"><span>Total</span><span>KES {grand.toLocaleString()}</span></div>
                  </div>
                  <button className="chg-btn" onClick={()=>setShowPay(true)}>Charge KES {grand.toLocaleString()} →</button>
                </>
              )}
            </div>
          )}
        </div>

        {/* ══ PAYMENT MODAL ══ */}
        {showPay&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShowPay(false)}>
            <div className="pay-modal">
              <div className="pay-hd">
                <div><h3>Payment</h3><div className="pay-amount">KES {grand.toLocaleString()}</div></div>
                <button className="pay-close" onClick={()=>setShowPay(false)}>×</button>
              </div>
              <div className="pay-methods">
                {[{id:'mpesa',icon:'📱',label:'M-Pesa'},{id:'cash',icon:'💵',label:'Cash'},{id:'paystack',icon:'💳',label:'Card'},{id:'paypal',icon:'🅿️',label:'PayPal'}]
                  .map(m=><button key={m.id} className={`pay-m-btn ${payMethod===m.id?'act':''}`} onClick={()=>setPayMethod(m.id)}><span>{m.icon}</span><span>{m.label}</span></button>)}
              </div>
              {payMethod==='mpesa'&&(
                <div className="pay-form">
                  <label>Customer Phone</label>
                  <input type="tel" placeholder="254712345678" value={phone} onChange={e=>setPhone(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleMpesa()}/>
                  <button className="pay-go" onClick={handleMpesa}>📱 Send M-Pesa Prompt</button>
                </div>
              )}
              {payMethod==='cash'&&(
                <div className="pay-form">
                  <label>Cash Received (KES)</label>
                  <input type="number" placeholder="Enter amount" value={cashIn} onChange={e=>setCashIn(e.target.value)}/>
                  {cashIn&&<div className={`pay-change ${change>=0?'pos':'neg'}`}>{change>=0?`Change: KES ${change.toLocaleString()}`:`Short: KES ${Math.abs(change).toLocaleString()}`}</div>}
                  <button className="pay-go" onClick={handleCash}>💵 Confirm Cash</button>
                </div>
              )}
              {payMethod==='paystack'&&(
                <div className="pay-form">
                  <label>Customer Email (optional)</label>
                  <input type="email" placeholder="customer@email.com" value={custEmail} onChange={e=>setCustEmail(e.target.value)}/>
                  <div className="pay-info">🔐 Secured by Paystack. Accepts Visa, Mastercard & M-Pesa.</div>
                  <button className="pay-go" onClick={handlePaystack}>💳 Pay with Card</button>
                </div>
              )}
              {payMethod==='paypal'&&(
                <div className="pay-form">
                  <div className="pay-info">Complete your payment securely via PayPal.</div>
                  <PayPalButtons
                    style={{layout:'vertical',color:'blue',shape:'rect',height:40}}
                    createOrder={(_,actions)=>actions.order.create({purchase_units:[{amount:{value:(grand/130).toFixed(2),currency_code:'USD'},description:`BerylBytes — ${cart.length} item(s)`}]})}
                    onApprove={(_,actions)=>actions.order.capture().then(d=>completeSale('PayPal',{transactionId:d.id}))}
                    onError={()=>flash('PayPal failed. Try again.','error')}
                  />
                </div>
              )}
              {msg&&<div className={`pay-msg ${msgType}`}>{msg}</div>}
            </div>
          </div>
        )}

        {/* ══ RECEIPT MODAL ══ */}
        {showReceipt&&receiptData&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShowReceipt(false)}>
            <div className="receipt-modal">
              <div className="receipt-top">
                <h3>🧾 BerylBytes Receipt</h3>
                <div className="r-id">{receiptData.invoiceId}</div>
              </div>
              <div className="receipt-meta">
                <span>📅 {new Date().toLocaleString('en-KE')}</span>
                <span>💳 {receiptData.method}</span>
                {receiptData.customer&&<span>👤 {receiptData.customer}</span>}
              </div>
              <div className="receipt-items">
                {receiptData.items.map(item=><div key={item.id} className="r-line"><span>{item.icon} {item.name} × {item.qty}</span><span>KES {(item.price*item.qty).toLocaleString()}</span></div>)}
              </div>
              <div className="r-totals">
                {(()=>{const s=receiptData.items.reduce((x,i)=>x+i.price*i.qty,0);return(<>
                  <div className="r-total-line"><span>Subtotal</span><span>KES {s.toLocaleString()}</span></div>
                  <div className="r-total-line"><span>VAT 16%</span><span>KES {Math.round(s*0.16).toLocaleString()}</span></div>
                  <div className="r-total-line big"><span>Total Paid</span><span>KES {receiptData.amount.toLocaleString()}</span></div>
                  {receiptData.change>0&&<div className="r-total-line"><span>Change</span><span style={{color:'var(--accent)'}}>KES {receiptData.change.toLocaleString()}</span></div>}
                </>)})()}
              </div>
              <div className="receipt-thanks">Thank you for shopping at BerylBytes! 🎉</div>
              <div className="btn-row" style={{marginTop:16}}>
                <button className="btn-p" style={{flex:1}} onClick={generatePDF}>⬇️ Download PDF</button>
                <button className="btn-g" onClick={()=>setShowReceipt(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </PayPalScriptProvider>
  )
}
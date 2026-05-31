import { useState, useEffect, useContext, createContext, useReducer, useRef } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────
const CartContext = createContext();
const UserContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find(i => i.id === action.item.id);
      return {
        ...state,
        items: exists
          ? state.items.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i)
          : [...state.items, { ...action.item, qty: 1 }],
        count: state.count + 1,
        lastAdded: action.item.id,
      };
    }
    case "CLEAR_LAST": return { ...state, lastAdded: null };
    default: return state;
  }
};

// ─── Data ─────────────────────────────────────────────────────────────────────
// Hero slides — rendered as rich SVG/CSS banners (no external image blocking)
const SLIDES = [
  { 
    id: 1, 
    // Using a top-to-bottom gradient overlay that goes from subtle dark transparency to matching your background
    gradient: "linear-gradient(to bottom, rgba(15, 32, 39, 0.4) 0%, rgba(32, 58, 67, 0.7) 70%, #e3e6e6 100%)",
    imgUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1600&q=80", // Replace with your image link
    headline: "Big Summer Sale", 
    sub: "Up to 60% off Electronics & Gadgets", 
    cta: "Shop Now", 
    accent: "#febd69", 
  },
  { 
    id: 2, 
    gradient: "linear-gradient(to bottom, rgba(26, 5, 51, 0.3) 0%, rgba(59, 15, 110, 0.7) 70%, #e3e6e6 100%)",
    imgUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1600&q=80", 
    headline: "Prime Exclusive Deals", 
    sub: "Members save more every single day", 
    cta: "Join Prime", 
    accent: "#00d2ff", 
     
  },
  { 
    id: 3, 
    gradient: "linear-gradient(to bottom, rgba(123, 44, 0, 0.3) 0%, rgba(192, 57, 43, 0.7) 70%, #e3e6e6 100%)",
    imgUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80", 
    headline: "Fashion & Style", 
    sub: "New arrivals updated daily", 
    cta: "Explore Now", 
    accent: "#ffeaa7", 
   
  },
  { 
    id: 4, 
    gradient: "linear-gradient(to bottom, rgba(13, 79, 42, 0.3) 0%, rgba(26, 122, 66, 0.7) 70%, #e3e6e6 100%)",
    imgUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&q=80", 
    headline: "Home & Kitchen", 
    sub: "Transform your space with top-rated picks", 
    cta: "Shop Home", 
    accent: "#a8ff78", 
    
  },
];
const SUBNAV = ["Today's Deals","Customer Service","Registry","Gift Cards","Sell","Buy Again","Prime","Browsing History"];

const PRODUCTS = [
  { id:1, section:"Bestsellers in Electronics", title:"Apple AirPods Pro (2nd Gen) – Active Noise Cancelling, Transparency Mode, H2 Chip", price:189.00, oldPrice:249.00, prime:true, rating:4.7, reviews:92483, badge:"Best Seller",
    img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkfgGOqWWb6x7wV8I8N9MD1jx-dWc9OrKh8w&s", delivery:"Get it by Tomorrow" },
  { id:2, section:"Bestsellers in Electronics", title:'Samsung 65" Class QLED 4K Smart TV Q60D Series, Quantum HDR, Object Tracking Sound', price:697.99, oldPrice:1099.99, prime:true, rating:4.6, reviews:18234, badge:"Deal of the Day",
    img:"https://images.samsung.com/is/image/samsung/p6pim/in/qa43qef6aulxl/gallery/in-qled-tv-qa43qef6aulxl------m------qled-qef---k-samsung-vision-ai-smart-tv-titanium-gray-548462571", delivery:"FREE delivery Tomorrow" },
  { id:3, section:"Bestsellers in Electronics", title:"Logitech MX Master 3S Wireless Performance Mouse, 8K DPI, Quiet Clicks, USB-C Charging", price:74.99, oldPrice:99.99, prime:true, rating:4.8, reviews:34812, badge:"Amazon's Choice",
    img:"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80", delivery:"Get it by Tomorrow" },
  { id:4, section:"Bestsellers in Electronics", title:"Sony WH-1000XM5 Industry Leading Wireless Noise Canceling Headphones, 30hr Battery", price:278.00, oldPrice:399.99, prime:true, rating:4.7, reviews:57203, badge:"Best Seller",
    img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", delivery:"FREE delivery Tomorrow" },
  { id:5, section:"Deals in Computers", title:'Apple MacBook Air 13" Laptop — M3 chip, 8GB Memory, 256GB SSD, 18hr Battery Life', price:949.00, oldPrice:1099.00, prime:true, rating:4.8, reviews:28941, badge:"Best Seller",
    img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80", delivery:"FREE delivery Tomorrow" },
  { id:6, section:"Deals in Computers", title:"Razer DeathAdder V3 HyperSpeed Wireless Gaming Mouse – 285g Lightweight, Focus Pro Sensor", price:59.99, oldPrice:89.99, prime:true, rating:4.6, reviews:8712, badge:null,
    img:"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80", delivery:"Get it by Tomorrow" },
  { id:7, section:"Deals in Computers", title:'LG 27" UltraGear QHD 2560x1440 Nano IPS Gaming Monitor, 165Hz, 1ms GTG, HDMI, DisplayPort', price:296.99, oldPrice:399.99, prime:true, rating:4.7, reviews:21089, badge:"Limited Time Deal",
    img:"https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&q=80", delivery:"FREE delivery Tomorrow" },
  { id:8, section:"Deals in Computers", title:"Keychron K2 Wireless Bluetooth / USB Mechanical Keyboard with RGB Backlight, Aluminum Frame", price:89.99, oldPrice:109.99, prime:false, rating:4.5, reviews:12438, badge:null,
    img:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80", delivery:"FREE delivery in 2 days" },
  { id:9, section:"Home & Kitchen Picks", title:"Instant Pot Duo 7-in-1 Electric Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, 6 Qt", price:79.99, oldPrice:99.95, prime:true, rating:4.7, reviews:128934, badge:"Best Seller",
    img:"https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80", delivery:"Get it by Tomorrow" },
  { id:10, section:"Home & Kitchen Picks", title:"Nespresso Vertuo Pop Coffee and Espresso Maker by De'Longhi, 5 Cup Sizes, 37oz tank", price:119.00, oldPrice:179.00, prime:true, rating:4.5, reviews:19823, badge:"Deal",
    img:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80", delivery:"FREE delivery Tomorrow" },
  { id:11, section:"Home & Kitchen Picks", title:"Dyson V15 Detect Cordless Vacuum Cleaner, Laser Dust Detection, LCD Screen, HEPA filter", price:649.99, oldPrice:749.99, prime:true, rating:4.7, reviews:9234, badge:"Amazon's Choice",
    img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80", delivery:"FREE delivery Tomorrow" },
  { id:12, section:"Home & Kitchen Picks", title:"KitchenAid Artisan Tilt-Head Stand Mixer with Pouring Shield, 5-Quart, Empire Red", price:279.99, oldPrice:449.99, prime:true, rating:4.8, reviews:43921, badge:"Best Seller",
    img:"https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500&q=80", delivery:"Get it by Tomorrow" },
];

const PANELS = [
  { title:"Shop Gaming", link:"See all offers", items:[
    { name:"Headsets", img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" },
    { name:"Mice", img:"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&q=80" },
    { name:"Keyboards", img:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80" },
    { name:"Monitors", img:"https://images.unsplash.com/photo-1547082299-de196ea013d6?w=300&q=80" },
  ]},
  { title:"Home Essentials", link:"See all offers", items:[
    { name:"Pressure Cookers", img:"https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&q=80" },
    { name:"Coffee Makers", img:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80" },
    { name:"Stand Mixers", img:"https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&q=80" },
    { name:"Vacuums", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80" },
  ]},
  { title:"Sign in for your best experience", link:null, isSignIn:true, items:[] },
  { title:"Explore Outdoors", link:"See all offers", items:[
    { name:"Camping", img:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&q=80" },
    { name:"Fitness", img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80" },
    { name:"Sports", img:"https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300&q=80" },
    { name:"Travel", img:"https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&q=80" },
  ]},
];

// ─── Stars ────────────────────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <span style={{ display:"flex", alignItems:"center", gap:1 }}>
    {[1,2,3,4,5].map(i => {
      const pct = Math.min(Math.max(rating - i + 1, 0), 1);
      const id = `g${i}${Math.random().toString(36).slice(2,6)}`;
      return (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24">
          <defs>
            <linearGradient id={id}>
              <stop offset={`${pct*100}%`} stopColor="#f90"/>
              <stop offset={`${pct*100}%`} stopColor="#ddd"/>
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={`url(#${id})`}/>
        </svg>
      );
    })}
  </span>
);

// ─── Prime SVG ────────────────────────────────────────────────────────────────
const Prime = () => (
  <svg width="47" height="16" viewBox="0 0 47 16">
    <rect width="47" height="16" rx="3" fill="#00a8e1"/>
    <text x="23.5" y="11.5" textAnchor="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="Arial" letterSpacing="0.8">prime</text>
  </svg>
);

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const { dispatch, state } = useContext(CartContext);
  const [added, setAdded] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const justAdded = state.lastAdded === product.id;
  const disc = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const intPart = Math.floor(product.price);
  const decPart = product.price.toFixed(2).split(".")[1];

  const handleAdd = e => {
    e.stopPropagation();
    dispatch({ type:"ADD_ITEM", item:product });
    setAdded(true);
    setTimeout(() => { setAdded(false); dispatch({ type:"CLEAR_LAST" }); }, 1800);
  };

  const BADGE_COLORS = { "Best Seller":"#c45500", "Amazon's Choice":"#007185", "Deal of the Day":"#cc0c39", "Limited Time Deal":"#cc0c39", "Deal":"#cc0c39" };

  return (
    <div style={{
      background:"#fff", borderRadius:4, overflow:"visible", display:"flex", flexDirection:"column",
      boxShadow: justAdded ? "0 0 0 2px #f90,0 8px 24px rgba(255,153,0,.2)" : "0 2px 5px rgba(15,17,17,.13)",
      transition:"box-shadow .2s,transform .2s",
      transform: justAdded ? "translateY(-2px)" : "none",
      cursor:"pointer", position:"relative",
    }}
      onMouseEnter={e=>{ if(!justAdded){e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,.18)"; e.currentTarget.style.transform="translateY(-1px)";}}}
      onMouseLeave={e=>{ if(!justAdded){e.currentTarget.style.boxShadow="0 2px 5px rgba(15,17,17,.13)"; e.currentTarget.style.transform="none";}}}
    >
      {product.badge && (
        <div style={{ position:"absolute", top:0, left:0, background:BADGE_COLORS[product.badge]||"#cc0c39", color:"#fff", fontSize:11, fontWeight:700, padding:"4px 9px", borderRadius:"4px 0 8px 0", zIndex:2 }}>
          {product.badge}
        </div>
      )}

      {/* Image */}
      <div style={{ height:190, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px 16px", position:"relative", overflow:"hidden" }}>
        {!imgErr
          ? <img src={product.img} alt={product.title} onError={()=>setImgErr(true)}
              style={{ maxHeight:155, maxWidth:"100%", objectFit:"contain", transition:"transform .35s" }}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.07)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
            />
          : <div style={{ width:80, height:80, background:"#f3f3f3", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:"#999", fontSize:11 }}>No Image</div>
        }
        {disc > 0 && (
          <div style={{ position:"absolute", top:8, right:8, background:"#cc0c39", color:"#fff", borderRadius:"50%", width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10.5, fontWeight:800, textAlign:"center", lineHeight:1.1 }}>-{disc}%</div>
        )}
      </div>

      <div style={{ padding:"8px 14px 14px", flex:1, display:"flex", flexDirection:"column", gap:4 }}>
        <p style={{ fontSize:13.5, color:"#0f1111", lineHeight:1.4, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", minHeight:38, margin:0 }}>
          {product.title}
        </p>

        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <Stars rating={product.rating}/>
          <span style={{ fontSize:12, color:"#007185", textDecoration:"underline", cursor:"pointer" }}>
            {product.reviews.toLocaleString()}
          </span>
        </div>

        <div style={{ display:"flex", alignItems:"flex-start", gap:2, flexWrap:"wrap" }}>
          <span style={{ fontSize:13, color:"#0f1111", lineHeight:1 }}>$</span>
          <span style={{ fontSize:24, fontWeight:400, color:"#0f1111", lineHeight:1, letterSpacing:-1 }}>{intPart}</span>
          <span style={{ fontSize:11, color:"#0f1111", lineHeight:1, marginTop:1 }}>{decPart}</span>
          {product.oldPrice && (
            <span style={{ fontSize:12, color:"#565959", marginLeft:4, alignSelf:"center" }}>
              List: <span style={{ textDecoration:"line-through" }}>${product.oldPrice.toFixed(2)}</span>
            </span>
          )}
        </div>

        {product.prime && (
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <Prime/>
            <span style={{ fontSize:11.5, color:"#007600" }}>FREE delivery</span>
          </div>
        )}

        <p style={{ fontSize:11.5, color:"#007600", margin:0 }}>{product.delivery}</p>

        <button onClick={handleAdd} style={{
          marginTop:6, width:"100%", padding:"8px 0",
          background: added ? "linear-gradient(to bottom,#6dbf67,#5ca85a)" : "linear-gradient(to bottom,#f7dfa5,#f0c14b)",
          border: added ? "1px solid #4e8842" : "1px solid #a88734",
          borderRadius:20, fontSize:13.5, fontWeight:400,
          color: added ? "#fff" : "#111", cursor:"pointer", transition:"all .2s",
          boxShadow:"0 1px 0 rgba(255,255,255,.4) inset",
        }}
          onMouseEnter={e=>{ if(!added) e.currentTarget.style.background="linear-gradient(to bottom,#f5d78e,#eeb933)"; }}
          onMouseLeave={e=>{ if(!added) e.currentTarget.style.background="linear-gradient(to bottom,#f7dfa5,#f0c14b)"; }}
        >{added ? "✓ Added to Cart" : "Add to cart"}</button>
      </div>
    </div>
  );
};

// ─── Hero Carousel (CSS gradient banners — no external image deps) ─────────────
const SLIDE_ICONS = [
  // Electronics — circuit-board pattern
  ({ accent }) => (
    <svg width="340" height="220" viewBox="0 0 340 220" style={{ opacity:.18, position:"absolute", right:40, top:10 }}>
      <rect x="60" y="40" width="220" height="140" rx="12" fill="none" stroke={accent} strokeWidth="2"/>
      <circle cx="170" cy="110" r="38" fill="none" stroke={accent} strokeWidth="2.5"/>
      <circle cx="170" cy="110" r="18" fill={accent} opacity=".4"/>
      {[0,60,120,180,240,300].map((a,i)=><line key={i} x1="170" y1="110" x2={170+55*Math.cos(a*Math.PI/180)} y2={110+55*Math.sin(a*Math.PI/180)} stroke={accent} strokeWidth="1.5"/>)}
      {[[60,40],[280,40],[60,180],[280,180]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="6" fill={accent} opacity=".6"/>)}
      <line x1="60" y1="40" x2="60" y2="10" stroke={accent} strokeWidth="1.5"/><line x1="280" y1="40" x2="280" y2="10" stroke={accent} strokeWidth="1.5"/>
      <line x1="60" y1="180" x2="60" y2="210" stroke={accent} strokeWidth="1.5"/><line x1="280" y1="180" x2="280" y2="210" stroke={accent} strokeWidth="1.5"/>
    </svg>
  ),
  // Prime — crown + stars
  ({ accent }) => (
    <svg width="320" height="200" viewBox="0 0 320 200" style={{ opacity:.2, position:"absolute", right:20, top:20 }}>
      <polygon points="160,30 200,110 270,80 240,160 80,160 50,80 120,110" fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx="160" cy="170" r="12" fill={accent} opacity=".5"/>
      {[[50,70],[160,20],[270,70]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="8" fill={accent} opacity=".7"/>)}
      {[40,80,120,160,200].map((x,i)=><text key={i} x={x} y="195" fontSize="18" fill={accent} opacity=".5">★</text>)}
    </svg>
  ),
  // Fashion — dress silhouette
  ({ accent }) => (
    <svg width="280" height="240" viewBox="0 0 280 240" style={{ opacity:.15, position:"absolute", right:30, top:0 }}>
      <ellipse cx="140" cy="40" rx="30" ry="32" fill="none" stroke={accent} strokeWidth="2"/>
      <path d="M110 70 L60 160 L80 160 L90 240 L190 240 L200 160 L220 160 L170 70 Q150 90 140 90 Q130 90 110 70Z" fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round"/>
      {[0,1,2,3].map(i=><line key={i} x1={90+i*20} y1="150" x2={95+i*20} y2="240" stroke={accent} strokeWidth="1" opacity=".5"/>)}
    </svg>
  ),
  // Home — house illustration
  ({ accent }) => (
    <svg width="300" height="220" viewBox="0 0 300 220" style={{ opacity:.18, position:"absolute", right:20, top:10 }}>
      <polygon points="150,20 280,110 20,110" fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round"/>
      <rect x="50" y="110" width="200" height="110" fill="none" stroke={accent} strokeWidth="2"/>
      <rect x="110" y="150" width="40" height="70" fill="none" stroke={accent} strokeWidth="1.5"/>
      <rect x="160" y="130" width="50" height="40" fill="none" stroke={accent} strokeWidth="1.5"/>
      <line x1="185" y1="130" x2="185" y2="170" stroke={accent} strokeWidth="1"/><line x1="160" y1="150" x2="210" y2="150" stroke={accent} strokeWidth="1"/>
    </svg>
  ),
];

const Hero = () => {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const reset = () => { clearInterval(timer.current); timer.current = setInterval(()=>setIdx(i=>(i+1)%SLIDES.length), 5500); };
  useEffect(()=>{ timer.current=setInterval(()=>setIdx(i=>(i+1)%SLIDES.length), 5500); return()=>clearInterval(timer.current); }, []);
  const go = d => { setIdx(i=>(i+d+SLIDES.length)%SLIDES.length); reset(); };
  const s = SLIDES[idx];
  const Icon = SLIDE_ICONS[idx];

  return (
    <div style={{ position:"relative", overflow:"hidden", lineHeight:0 }}>
      <div style={{ height:460, position:"relative" }}>
        
        {/* Animated background featuring stacked gradients and images */}
        {SLIDES.map((sl, i) => (
          <div key={sl.id} style={{
            position:"absolute", 
            inset:0, 
            backgroundImage: `${sl.gradient}, url(${sl.imgUrl})`,
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            opacity: i===idx ? 1 : 0, 
            transition: "opacity .8s ease",
          }}/>
        ))}

        {/* Decorative SVG */}
        <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
          <Icon accent={s.accent}/>
          {/* Floating orbs */}
          <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle, ${s.accent}22 0%, transparent 70%)`, top:-80, right:-60, pointerEvents:"none" }}/>
          <div style={{ position:"absolute", width:180, height:180, borderRadius:"50%", background:`radial-gradient(circle, ${s.accent}15 0%, transparent 70%)`, bottom:60, left:40, pointerEvents:"none" }}/>
        </div>

        {/* Text content */}
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 80px", pointerEvents:"none" }}>
          <div style={{ fontSize:52, marginBottom:8, filter:"drop-shadow(0 2px 8px rgba(0,0,0,.4))" }}>{s.emoji}</div>
          <h1 style={{ color:"#fff", fontSize:46, fontWeight:800, margin:"0 0 12px", lineHeight:1.1, textShadow:"0 2px 12px rgba(0,0,0,.5)", maxWidth:580 }}>{s.headline}</h1>
          <p style={{ color:"rgba(255,255,255,.85)", fontSize:20, margin:"0 0 28px", maxWidth:480, textShadow:"0 1px 6px rgba(0,0,0,.4)" }}>{s.sub}</p>
          <div style={{ pointerEvents:"all" }}>
            <button style={{ background:s.accent, color:"#111", border:"none", borderRadius:4, padding:"13px 32px", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:`0 4px 16px ${s.accent}55`, transition:"transform .15s,box-shadow .15s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow=`0 6px 24px ${s.accent}88`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow=`0 4px 16px ${s.accent}55`;}}
            >{s.cta} →</button>
          </div>
        </div>

        {/* Edge gradients + bottom fade */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(0,0,0,.18) 0%,transparent 30%,transparent 70%,rgba(0,0,0,.18) 100%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:160, background:"linear-gradient(to bottom,transparent,#e3e6e6)", pointerEvents:"none" }}/>

        {/* Arrows */}
        {[-1,1].map(d=>(
          <button key={d} onClick={()=>go(d)} style={{
            position:"absolute", top:"50%", [d===-1?"left":"right"]:0, transform:"translateY(-65%)",
            background:"rgba(255,255,255,0.82)", border:"none", width:44, height:90,
            cursor:"pointer", fontSize:28, color:"#333",
            borderRadius:d===-1?"0 4px 4px 0":"4px 0 0 4px",
            boxShadow:"0 2px 10px rgba(0,0,0,.25)", transition:"background .15s", lineHeight:1,
          }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,1)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.82)"}
          >{d===-1?"❮":"❯"}</button>
        ))}

        {/* Dots */}
        <div style={{ position:"absolute", bottom:168, left:"50%", transform:"translateX(-50%)", display:"flex", gap:8, zIndex:5 }}>
          {SLIDES.map((_,i)=>(
            <button key={i} onClick={()=>{setIdx(i);reset();}} style={{
              width:i===idx?28:8, height:8, borderRadius:4, padding:0,
              background:i===idx?s.accent:"rgba(255,255,255,0.6)",
              border:"none", cursor:"pointer", transition:"all .3s",
            }}/>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Deal Panels ──────────────────────────────────────────────────────────────
const DealPanels = () => {
  const { setUser } = useContext(UserContext);
  return (
    <div style={{ maxWidth:1500, margin:"-110px auto 0", padding:"0 16px 20px", position:"relative", zIndex:10 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16 }}>
        {PANELS.map((p,pi)=>(
          <div key={pi} style={{ background:"#fff", borderRadius:4, padding:"18px 20px 14px", boxShadow:"0 2px 5px rgba(0,0,0,.1)" }}>
            <h2 style={{ fontSize:20, fontWeight:700, color:"#0f1111", margin:"0 0 14px" }}>{p.title}</h2>
            {p.isSignIn ? (
              <div style={{ padding:"8px 0 12px" }}>
                <p style={{ fontSize:13.5, color:"#555", margin:"0 0 12px" }}>See personalized recommendations</p>
                <button onClick={()=>setUser("Customer")} style={{
                  width:"100%", padding:10, background:"linear-gradient(to bottom,#f7dfa5,#f0c14b)",
                  border:"1px solid #a88734", borderRadius:3, fontSize:14, cursor:"pointer", marginBottom:10,
                }}>Sign in securely</button>
                <p style={{ fontSize:12.5, margin:0, color:"#555" }}>
                  New customer? <span style={{ color:"#c45500", cursor:"pointer", textDecoration:"underline" }}>Start here.</span>
                </p>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {p.items.map((item,ii)=>(
                  <div key={ii} style={{ cursor:"pointer" }}
                    onMouseEnter={e=>e.currentTarget.style.opacity=".8"}
                    onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                  >
                    <img src={item.img} alt={item.name} style={{ width:"100%", height:110, objectFit:"contain", background:"#f8f8f8", borderRadius:4, display:"block" }}/>
                    <p style={{ fontSize:12.5, margin:"6px 0 0", color:"#0f1111" }}>{item.name}</p>
                  </div>
                ))}
              </div>
            )}
            {p.link && <div style={{ marginTop:12 }}><span style={{ fontSize:13, color:"#007185", cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.color="#c45500"} onMouseLeave={e=>e.currentTarget.style.color="#007185"}>{p.link} ›</span></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = () => {
  const { state:cart } = useContext(CartContext);
  const { user, setUser } = useContext(UserContext);
  const [sf, setSf] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [showUser, setShowUser] = useState(false);
  const [bounce, setBounce] = useState(false);
  const prev = useRef(0);

  useEffect(()=>{
    if(cart.count>prev.current){ setBounce(true); setTimeout(()=>setBounce(false),400); }
    prev.current=cart.count;
  },[cart.count]);

  const navItem = (top, bot, onClick) => (
    <div onClick={onClick} style={{ padding:"5px 8px", border:"1px solid transparent", borderRadius:2, cursor:"pointer", flexShrink:0 }}
      onMouseEnter={e=>e.currentTarget.style.borderColor="#fff"}
      onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}
    >
      <div style={{ color:"#ccc", fontSize:11, lineHeight:1.3 }}>{top}</div>
      <div style={{ color:"#fff", fontWeight:700, fontSize:13, whiteSpace:"nowrap" }}>{bot}</div>
    </div>
  );

  return (
    <header style={{ background:"#131921", position:"sticky", top:0, zIndex:200, boxShadow:"0 2px 6px rgba(0,0,0,.6)" }}>
      <div style={{ maxWidth:1500, margin:"0 auto", padding:"0 12px", height:60, display:"flex", alignItems:"center", gap:8 }}>

        {/* Logo */}
        <div style={{ padding:"5px 8px", border:"1px solid transparent", borderRadius:2, cursor:"pointer", flexShrink:0, lineHeight:1 }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="#fff"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}
        >
          <div style={{ color:"#fff", fontSize:22, fontWeight:900, fontFamily:"Arial Black,Arial", letterSpacing:-1 }}>amazon</div>
          <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", marginTop:-4 }}>
            <svg viewBox="0 0 70 12" width="52" height="9">
              <path d="M3 7 Q20 13 35 8 Q50 3 67 9" fill="none" stroke="#f90" strokeWidth="3" strokeLinecap="round"/>
              <polygon points="63,5 70,10 61,13" fill="#f90"/>
            </svg>
            <span style={{ color:"#fff", fontSize:9, fontWeight:700 }}>.in</span>
          </div>
        </div>

        {/* Location */}
        <div style={{ padding:"5px 8px", border:"1px solid transparent", borderRadius:2, cursor:"pointer", flexShrink:0 }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="#fff"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}
        >
          <div style={{ color:"#ccc", fontSize:11 }}>Deliver to</div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <svg width="11" height="14" viewBox="0 0 12 16" fill="#fff"><path d="M6 0C3.8 0 2 1.8 2 4c0 3 4 9 4 9s4-6 4-9c0-2.2-1.8-4-4-4zm0 5.5C5.2 5.5 4.5 4.8 4.5 4S5.2 2.5 6 2.5 7.5 3.2 7.5 4 6.8 5.5 6 5.5z"/></svg>
            <span style={{ color:"#fff", fontSize:13, fontWeight:700 }}>Ghaziabad</span>
          </div>
        </div>

        {/* Search */}
        <div style={{ flex:1, display:"flex", height:40, borderRadius:4, overflow:"hidden", outline:sf?"3px solid #f90":"none", outlineOffset:0, transition:"outline .1s", minWidth:0 }}>
          <select value={cat} onChange={e=>setCat(e.target.value)} style={{ background:"#f3f3f3", border:"none", borderRight:"1px solid #cdcdcd", padding:"0 4px 0 8px", fontSize:12, color:"#333", cursor:"pointer", minWidth:55, maxWidth:75, borderRadius:"4px 0 0 4px" }}>
            {["All","Alexa Skills","Amazon Devices","Appliances","Books","Clothing","Electronics","Fashion","Grocery","Home & Kitchen","Laptops","Mobile Phones","Music","Sports","Toys"].map(c=><option key={c}>{c}</option>)}
          </select>
          <input value={q} onChange={e=>setQ(e.target.value)} onFocus={()=>setSf(true)} onBlur={()=>setSf(false)}
            placeholder="Search Amazon.in"
            style={{ flex:1, border:"none", outline:"none", padding:"0 12px", fontSize:15, background:"#fff", minWidth:0 }}
          />
          <button style={{ background:"#febd69", border:"none", padding:"0 14px", cursor:"pointer", flexShrink:0, transition:"background .15s" }}
            onMouseEnter={e=>e.currentTarget.style.background="#f3a847"}
            onMouseLeave={e=>e.currentTarget.style.background="#febd69"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#333"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          </button>
        </div>

        {/* Flag */}
        <div style={{ padding:"5px 6px", border:"1px solid transparent", borderRadius:2, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:3 }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="#fff"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}
        >
          <span style={{ fontSize:20 }}>🇮🇳</span>
          <span style={{ color:"#fff", fontSize:11, fontWeight:700 }}>EN</span>
          <span style={{ color:"#fff", fontSize:9 }}>▾</span>
        </div>

        {/* Account dropdown */}
        <div style={{ position:"relative" }}
          onMouseEnter={()=>setShowUser(true)}
          onMouseLeave={()=>setShowUser(false)}
        >
          <div style={{ padding:"5px 8px", border:"1px solid transparent", borderRadius:2, cursor:"pointer", borderColor:showUser?"#fff":"transparent" }}>
            <div style={{ color:"#ccc", fontSize:11 }}>Hello, {user||"sign in"}</div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:3, whiteSpace:"nowrap" }}>
              Account &amp; Lists
              <svg width="10" height="6" viewBox="0 0 10 6" fill="#fff"><path d="M0 0l5 6 5-6z"/></svg>
            </div>
          </div>
          {showUser && (
            <div style={{ position:"absolute", top:"100%", right:-20, minWidth:240, background:"#fff", borderRadius:4, boxShadow:"0 8px 28px rgba(0,0,0,.35)", padding:18, zIndex:300 }}>
              <div style={{ marginBottom:14, paddingBottom:14, borderBottom:"1px solid #ddd" }}>
                {user
                  ? <button onClick={()=>setUser(null)} style={{ width:"100%", padding:9, background:"linear-gradient(to bottom,#f7dfa5,#f0c14b)", border:"1px solid #a88734", borderRadius:3, fontSize:14, cursor:"pointer" }}>Sign Out</button>
                  : <>
                      <button onClick={()=>setUser("Customer")} style={{ width:"100%", padding:9, background:"linear-gradient(to bottom,#f7dfa5,#f0c14b)", border:"1px solid #a88734", borderRadius:3, fontSize:14, cursor:"pointer", marginBottom:8 }}>Sign in</button>
                      <p style={{ fontSize:13, margin:0, textAlign:"center" }}>New customer? <span style={{ color:"#c45500", cursor:"pointer" }}>Start here.</span></p>
                    </>
                }
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 20px" }}>
                {["Your Account","Lists","Your Orders","Your Recommendations","Browsing History","Kindle Unlimited","Prime Membership","Content & Devices"].map(item=>(
                  <div key={item} style={{ fontSize:12.5, color:"#0f1111", cursor:"pointer", padding:"2px 0" }}
                    onMouseEnter={e=>e.currentTarget.style.color="#c45500"}
                    onMouseLeave={e=>e.currentTarget.style.color="#0f1111"}
                  >{item}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {navItem("Returns","& Orders")}

        {/* Cart */}
        <div style={{ padding:"4px 8px", border:"1px solid transparent", borderRadius:2, cursor:"pointer", display:"flex", alignItems:"center", gap:4, flexShrink:0 }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="#fff"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}
        >
          <div style={{ position:"relative" }}>
            <svg width="36" height="36" viewBox="0 0 50 50" fill="none">
              <path d="M4 6h5l5 22h22l4-16H14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="22" cy="36" r="3" fill="#fff"/>
              <circle cx="34" cy="36" r="3" fill="#fff"/>
            </svg>
            <span style={{
              position:"absolute", top:-1, right:-4,
              background:"#f90", color:"#131921",
              borderRadius:"50%", minWidth:20, height:20,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:800, padding:"0 2px",
              transition:"transform .15s",
              transform: bounce?"scale(1.5)":cart.count>0?"scale(1.1)":"scale(1)",
            }}>{cart.count}</span>
          </div>
          <span style={{ color:"#fff", fontWeight:700, fontSize:14 }}>Cart</span>
        </div>
      </div>
    </header>
  );
};

// ─── SubNav ───────────────────────────────────────────────────────────────────
const SubNav = () => (
  <nav style={{ background:"#232f3e", overflowX:"auto" }}>
    <div style={{ maxWidth:1500, margin:"0 auto", padding:"0 8px", display:"flex", alignItems:"center", height:38 }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, padding:"0 12px", border:"1px solid transparent", borderRadius:2, cursor:"pointer", color:"#fff", height:34, whiteSpace:"nowrap", flexShrink:0 }}
        onMouseEnter={e=>e.currentTarget.style.borderColor="#fff"}
        onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}
      >
        <svg width="18" height="14" viewBox="0 0 18 14" fill="#fff"><rect width="18" height="2" rx="1"/><rect y="6" width="18" height="2" rx="1"/><rect y="12" width="18" height="2" rx="1"/></svg>
        <span style={{ fontWeight:700, fontSize:14 }}>All</span>
      </div>
      {SUBNAV.map(cat=>(
        <button key={cat} style={{ background:"transparent", border:"1px solid transparent", borderRadius:2, color:"#fff", padding:"0 10px", fontSize:13.5, cursor:"pointer", whiteSpace:"nowrap", height:34, transition:"border-color .1s" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="#fff"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}
        >{cat}</button>
      ))}
      <div style={{ marginLeft:"auto", display:"flex" }}>
        {["Amazon miniTV","Amazon Pay"].map(x=>(
          <button key={x} style={{ background:"transparent", border:"1px solid transparent", borderRadius:2, color:"#fff", padding:"0 10px", fontSize:13.5, cursor:"pointer", whiteSpace:"nowrap", height:34 }}
            onMouseEnter={e=>e.currentTarget.style.borderColor="#fff"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}
          >{x}</button>
        ))}
      </div>
    </div>
  </nav>
);

// ─── Product Sections ─────────────────────────────────────────────────────────
const ProductSections = () => {
  const sections = [...new Set(PRODUCTS.map(p=>p.section))];
  return (
    <div style={{ maxWidth:1500, margin:"0 auto", padding:"16px 16px 32px" }}>
      {sections.map(sec=>(
        <div key={sec} style={{ marginBottom:24, background:"#fff", borderRadius:4, padding:"18px 20px 22px", boxShadow:"0 2px 5px rgba(0,0,0,.08)" }}>
          <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:18 }}>
            <h2 style={{ fontSize:21, fontWeight:700, color:"#0f1111", margin:0 }}>{sec}</h2>
            <span style={{ fontSize:13.5, color:"#007185", cursor:"pointer", whiteSpace:"nowrap" }}
              onMouseEnter={e=>e.currentTarget.style.color="#c45500"}
              onMouseLeave={e=>e.currentTarget.style.color="#007185"}
            >See all results ›</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))", gap:14 }}>
            {PRODUCTS.filter(p=>p.section===sec).map(p=><ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Promo Strip ──────────────────────────────────────────────────────────────
const PromoStrip = () => (
  <div style={{ background:"#fff", borderTop:"1px solid #ddd", borderBottom:"1px solid #ddd", padding:"12px 0" }}>
    <div style={{ maxWidth:1500, margin:"0 auto", padding:"0 16px", display:"flex", justifyContent:"space-around", flexWrap:"wrap", gap:10 }}>
      {[
        {icon:"🚚",t:"FREE Delivery",s:"On orders over ₹499"},
        {icon:"↩",t:"Easy Returns",s:"Hassle-free 30-day returns"},
        {icon:"🔒",t:"Secure Shopping",s:"256-bit SSL protection"},
        {icon:"📦",t:"Wide Selection",s:"Millions of products"},
        {icon:"⚡",t:"Fast Shipping",s:"Prime 2-day delivery"},
      ].map(({icon,t,s})=>(
        <div key={t} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"4px 8px" }}>
          <span style={{ fontSize:24 }}>{icon}</span>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#0f1111" }}>{t}</div>
            <div style={{ fontSize:11.5, color:"#555" }}>{s}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer>
    <div onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{ background:"#37475a", padding:"13px 0", textAlign:"center", cursor:"pointer", transition:"background .15s" }}
      onMouseEnter={e=>e.currentTarget.style.background="#4a5f75"}
      onMouseLeave={e=>e.currentTarget.style.background="#37475a"}
    ><span style={{ color:"#fff", fontSize:13 }}>Back to top</span></div>

    <div style={{ background:"#232f3e", padding:"36px 16px 28px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))", gap:"24px 40px" }}>
        {[
          { title:"Get to Know Us", links:["Careers","Blog","About Amazon","Investor Relations","Amazon Devices","Amazon Science"] },
          { title:"Make Money with Us", links:["Sell on Amazon","Sell under Amazon Accelerator","Associates Programme","Advertise Your Products","Self-Publish with Us","Host an Amazon Hub"] },
          { title:"Amazon Payment Products", links:["Amazon Pay","Amazon Rewards Visa","Shop with Points","Reload Your Balance","Amazon Currency Converter"] },
          { title:"Let Us Help You", links:["Your Account","Your Orders","Shipping Rates & Policies","Amazon Prime","Returns & Replacements","Manage Your Content","Amazon Assistant","Help"] },
        ].map(({title,links})=>(
          <div key={title}>
            <h4 style={{ color:"#fff", fontSize:15, fontWeight:700, marginBottom:12 }}>{title}</h4>
            {links.map(l=>(
              <div key={l} style={{ fontSize:13, color:"#ddd", marginBottom:8, cursor:"pointer", lineHeight:1.3 }}
                onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                onMouseLeave={e=>e.currentTarget.style.color="#ddd"}
              >{l}</div>
            ))}
          </div>
        ))}
      </div>
    </div>

    <div style={{ background:"#131921", padding:"22px 16px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", textAlign:"center" }}>
        <div style={{ marginBottom:14, display:"inline-block" }}>
          <div style={{ color:"#fff", fontSize:24, fontWeight:900, fontFamily:"Arial Black,Arial", letterSpacing:-1 }}>amazon</div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:-5 }}>
            <svg viewBox="0 0 70 12" width="52" height="9"><path d="M3 7 Q20 13 35 8 Q50 3 67 9" fill="none" stroke="#f90" strokeWidth="2.8" strokeLinecap="round"/><polygon points="63,5 70,10 61,13" fill="#f90"/></svg>
            <span style={{ color:"#fff", fontSize:9, fontWeight:700 }}>.in</span>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:10, flexWrap:"wrap", marginBottom:14 }}>
          {["🌐  English","🇮🇳  India"].map(l=>(
            <button key={l} style={{ background:"transparent", border:"1px solid #666", borderRadius:3, color:"#fff", padding:"6px 14px", fontSize:12, cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#fff"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#666"}
            >{l}</button>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:"4px 14px", marginBottom:8 }}>
          {["Conditions of Use & Sale","Privacy Notice","Interest-Based Ads","© 2026, Shubh Mohan - Amazon.com"].map((l,i)=>(
            <span key={l} style={{ fontSize:12, color:"#ddd", cursor:i<3?"pointer":"default" }}
              onMouseEnter={e=>{ if(i<3) e.currentTarget.style.textDecoration="underline"; }}
              onMouseLeave={e=>e.currentTarget.style.textDecoration="none"}
            >{l}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [cartState, cartDispatch] = useReducer(cartReducer, { items:[], count:0, lastAdded:null });
  const [user, setUser] = useState(null);

  return (
    <CartContext.Provider value={{ state:cartState, dispatch:cartDispatch }}>
      <UserContext.Provider value={{ user, setUser }}>
        <div style={{ fontFamily:"'Amazon Ember','Helvetica Neue',Arial,sans-serif", background:"#e3e6e6", minHeight:"100vh" }}>
          <Header/>
          <SubNav/>
          <Hero/>
          <DealPanels/>
          <PromoStrip/>
          <ProductSections/>
          <Footer/>
        </div>
      </UserContext.Provider>
    </CartContext.Provider>
  );
}
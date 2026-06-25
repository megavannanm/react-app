import { useState, useEffect, useRef } from "react";

/* ─── DATA ─────────────────────────────────────────────────────────────── */
const COMPONENTS = {
  cpu: {
    label: "Processor (CPU)", icon: "🧠", cat: "Processing",
    options: [
      { id: "i5", name: "Intel Core i5-13600K", price: 19999, spec: "14-core · 125W · LGA1700", tier: "mid", brand: "Intel" },
      { id: "i7", name: "Intel Core i7-13700K", price: 32999, spec: "16-core · 125W · LGA1700", tier: "high", brand: "Intel" },
      { id: "i9", name: "Intel Core i9-13900K", price: 54999, spec: "24-core · 125W · LGA1700", tier: "ultra", brand: "Intel" },
      { id: "r5", name: "AMD Ryzen 5 7600X",    price: 17999, spec: "6-core · 105W · AM5",    tier: "mid",  brand: "AMD" },
      { id: "r7", name: "AMD Ryzen 7 7700X",    price: 28999, spec: "8-core · 105W · AM5",    tier: "high", brand: "AMD" },
      { id: "r9", name: "AMD Ryzen 9 7950X",    price: 59999, spec: "16-core · 170W · AM5",   tier: "ultra", brand: "AMD" },
    ],
  },
  gpu: {
    label: "Graphics Card (GPU)", icon: "🎮", cat: "Graphics",
    options: [
      { id: "rx6600",  name: "AMD RX 6600",      price: 17999, spec: "8GB GDDR6 · 132W",  tier: "mid",  brand: "AMD" },
      { id: "rtx3060", name: "NVIDIA RTX 3060",  price: 22999, spec: "12GB GDDR6 · 170W", tier: "mid",  brand: "NVIDIA" },
      { id: "rx7700xt",name: "AMD RX 7700 XT",   price: 34999, spec: "12GB GDDR6 · 245W", tier: "high", brand: "AMD" },
      { id: "rtx4070", name: "NVIDIA RTX 4070",  price: 49999, spec: "12GB GDDR6X · 200W",tier: "high", brand: "NVIDIA" },
      { id: "rx7900xt",name: "AMD RX 7900 XT",   price: 74999, spec: "20GB GDDR6 · 315W", tier: "ultra",brand: "AMD" },
      { id: "rtx4090", name: "NVIDIA RTX 4090",  price: 149999,spec: "24GB GDDR6X · 450W",tier: "ultra",brand: "NVIDIA" },
    ],
  },
  ram: {
    label: "Memory (RAM)", icon: "💾", cat: "Memory",
    options: [
      { id: "16ddr4", name: "16GB DDR4 3200MHz", price: 3999,  spec: "Dual Channel · CL16", tier: "mid",  brand: "Corsair" },
      { id: "32ddr4", name: "32GB DDR4 3200MHz", price: 6999,  spec: "Dual Channel · CL16", tier: "high", brand: "Corsair" },
      { id: "16ddr5", name: "16GB DDR5 5600MHz", price: 5999,  spec: "Dual Channel · CL36", tier: "mid",  brand: "G.Skill" },
      { id: "32ddr5", name: "32GB DDR5 5600MHz", price: 10999, spec: "Dual Channel · CL36", tier: "high", brand: "G.Skill" },
      { id: "64ddr5", name: "64GB DDR5 6000MHz", price: 19999, spec: "Quad Channel · CL30", tier: "ultra",brand: "G.Skill" },
    ],
  },
  motherboard: {
    label: "Motherboard", icon: "🔲", cat: "Platform",
    options: [
      { id: "b660",  name: "MSI PRO B660M-A DDR4",       price: 8999,  spec: "LGA1700 · DDR4 · mATX",   tier: "mid",  brand: "MSI" },
      { id: "z690",  name: "ASUS ROG STRIX Z690-E",       price: 22999, spec: "LGA1700 · DDR5 · ATX",    tier: "high", brand: "ASUS" },
      { id: "b650",  name: "MSI PRO B650-P WiFi",         price: 12999, spec: "AM5 · DDR5 · ATX",        tier: "mid",  brand: "MSI" },
      { id: "x670",  name: "ASUS ROG Crosshair X670E",    price: 34999, spec: "AM5 · DDR5 · ATX",        tier: "ultra",brand: "ASUS" },
    ],
  },
  storage: {
    label: "Storage", icon: "💿", cat: "Storage",
    options: [
      { id: "500ssd", name: "500GB NVMe Gen3 SSD", price: 2999,  spec: "3500 MB/s read",  tier: "mid",  brand: "Samsung" },
      { id: "1tbssd", name: "1TB NVMe Gen4 SSD",   price: 5999,  spec: "7000 MB/s read",  tier: "mid",  brand: "Samsung" },
      { id: "2tbssd", name: "2TB NVMe Gen4 SSD",   price: 10999, spec: "7400 MB/s read",  tier: "high", brand: "WD" },
      { id: "4tbhdd", name: "4TB HDD 7200RPM",     price: 3999,  spec: "256MB Cache",     tier: "mid",  brand: "Seagate" },
    ],
  },
  psu: {
    label: "Power Supply", icon: "⚡", cat: "Power",
    options: [
      { id: "550w",  name: "EVGA 550W 80+ Bronze",        price: 3499,  spec: "550W · ATX · 80+ Bronze",  tier: "mid",  brand: "EVGA" },
      { id: "650w",  name: "Corsair 650W 80+ Gold",       price: 5499,  spec: "650W · ATX · 80+ Gold",    tier: "mid",  brand: "Corsair" },
      { id: "850w",  name: "Seasonic 850W 80+ Gold",      price: 8499,  spec: "850W · ATX · 80+ Gold",    tier: "high", brand: "Seasonic" },
      { id: "1000w", name: "be quiet! 1000W Platinum",    price: 13999, spec: "1000W · ATX · 80+ Platinum",tier:"ultra", brand: "be quiet!" },
    ],
  },
  case: {
    label: "PC Case", icon: "🖥️", cat: "Chassis",
    options: [
      { id: "meshify", name: "Fractal Meshify C",     price: 5999,  spec: "ATX Mid · Mesh front",     tier: "mid",  brand: "Fractal" },
      { id: "h510",    name: "NZXT H510",             price: 5499,  spec: "ATX Mid · Steel + Tempered",tier: "mid",  brand: "NZXT" },
      { id: "4000d",   name: "Corsair 4000D Airflow", price: 7499,  spec: "ATX Mid · Airflow optimised",tier:"high", brand: "Corsair" },
      { id: "o11",     name: "Lian Li O11 Dynamic",   price: 10999, spec: "ATX Full · Dual-chamber",   tier: "ultra",brand: "Lian Li" },
    ],
  },
  cooling: {
    label: "CPU Cooler", icon: "❄️", cat: "Thermal",
    options: [
      { id: "stock",   name: "Stock Cooler",              price: 0,    spec: "Included with CPU",       tier: "mid",  brand: "OEM" },
      { id: "hyper212",name: "Cooler Master Hyper 212",   price: 1999, spec: "Air · 120mm fan",         tier: "mid",  brand: "Cooler Master" },
      { id: "nhd15",   name: "Noctua NH-D15",             price: 6499, spec: "Air · Dual 140mm",        tier: "high", brand: "Noctua" },
      { id: "aio240",  name: "NZXT Kraken 240mm AIO",     price: 6999, spec: "Liquid · 240mm radiator", tier: "high", brand: "NZXT" },
      { id: "aio360",  name: "Corsair H150i 360mm AIO",   price: 11999,spec: "Liquid · 360mm radiator", tier: "ultra",brand: "Corsair" },
    ],
  },
};

const PRESETS = {
  budget: {
    label: "Budget Build", emoji: "💸", desc: "Great for everyday computing & light gaming",
    color: "#0f6e56", bg: "linear-gradient(135deg,#1a2e28 0%,#0d1f1b 100%)",
    selections: { cpu:"r5", gpu:"rx6600", ram:"16ddr4", motherboard:"b650", storage:"500ssd", psu:"550w", case:"h510", cooling:"hyper212" },
  },
  gaming: {
    label: "Gaming Rig", emoji: "🎮", desc: "Smooth 1440p gaming, VR-ready beast",
    color: "#185FA5", bg: "linear-gradient(135deg,#0d1b2e 0%,#091523 100%)",
    selections: { cpu:"i7", gpu:"rtx4070", ram:"32ddr5", motherboard:"z690", storage:"1tbssd", psu:"850w", case:"4000d", cooling:"aio240" },
  },
  workstation: {
    label: "Workstation", emoji: "🚀", desc: "Content creation, 3D rendering & AI work",
    color: "#534AB7", bg: "linear-gradient(135deg,#16122e 0%,#0e0b1f 100%)",
    selections: { cpu:"r9", gpu:"rx7900xt", ram:"64ddr5", motherboard:"x670", storage:"2tbssd", psu:"1000w", case:"o11", cooling:"aio360" },
  },
};

const TIER = {
  mid:   { label:"Mid-Range", bg:"#EAF3DE", color:"#3B6D11" },
  high:  { label:"High-End",  bg:"#E6F1FB", color:"#185FA5" },
  ultra: { label:"Ultra",     bg:"#EEEDFE", color:"#534AB7" },
};

/* ─── TOAST ─────────────────────────────────────────────────────────────── */
function Toast({ toasts }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type==="success" ? "#0f6e56" : t.type==="error" ? "#A32D2D" : "#185FA5",
          color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:14, fontWeight:500,
          boxShadow:"0 8px 32px rgba(0,0,0,0.25)", animation:"slideIn 0.3s ease",
          display:"flex", alignItems:"center", gap:10,
        }}>
          <span>{t.type==="success"?"✅":t.type==="error"?"❌":"ℹ️"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─── CART DRAWER ─────────────────────────────────────────────────────────── */
function CartDrawer({ cart, onClose, onRemove, onEnquire }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex" }}>
      <div onClick={onClose} style={{ flex:1, background:"rgba(0,0,0,0.5)", cursor:"pointer" }} />
      <div style={{
        width: Math.min(420, window.innerWidth),
        background:"#fff", display:"flex", flexDirection:"column",
        boxShadow:"-8px 0 40px rgba(0,0,0,0.2)", animation:"drawerIn 0.3s ease",
      }}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #eee", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:"#111" }}>🛒 Your Cart</div>
            <div style={{ fontSize:12, color:"#888", marginTop:2 }}>{cart.length} item{cart.length!==1?"s":""}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#666" }}>✕</button>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"16px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 0", color:"#bbb" }}>
              <div style={{ fontSize:48 }}>🛒</div>
              <div style={{ marginTop:12, fontSize:15 }}>Your cart is empty</div>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{
              display:"flex", gap:12, padding:"14px 0", borderBottom:"1px solid #f5f5f5",
              animation:"fadeUp 0.3s ease",
            }}>
              <div style={{ fontSize:28, width:44, height:44, background:"#f8f8f8", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {item.icon}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, color:"#111" }}>{item.name}</div>
                <div style={{ fontSize:12, color:"#888", marginTop:2 }}>{item.spec}</div>
                <div style={{ fontSize:13, fontWeight:700, color:"#185FA5", marginTop:4 }}>₹{item.price.toLocaleString("en-IN")}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                <button onClick={() => onRemove(item.id)} style={{
                  background:"#FFF0F0", border:"none", color:"#A32D2D", fontSize:14,
                  width:28, height:28, borderRadius:8, cursor:"pointer", fontWeight:700,
                }}>✕</button>
                <div style={{ fontSize:11, color:"#aaa" }}>Qty: {item.qty}</div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={{ padding:"20px 24px", borderTop:"1px solid #eee" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <span style={{ fontSize:15, color:"#444" }}>Total</span>
              <span style={{ fontSize:20, fontWeight:700, color:"#111" }}>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <button onClick={onEnquire} style={{
              width:"100%", padding:"14px", background:"linear-gradient(135deg,#185FA5,#0d3d6e)",
              color:"#fff", border:"none", borderRadius:12, fontSize:15, fontWeight:700,
              cursor:"pointer", letterSpacing:"0.02em",
            }}>
              📋 Enquire for This Build
            </button>
            <div style={{ fontSize:11, color:"#aaa", textAlign:"center", marginTop:8 }}>
              We'll contact you within 24 hours with a quote
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ENQUIRY / CONTACT MODAL ─────────────────────────────────────────────── */
function EnquiryModal({ onClose, cart, buildSelections, addToast }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"", city:"", message:"", purpose:"gaming" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) {
      addToast("Please fill all required fields", "error"); return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{
        background:"#fff", borderRadius:20, width:"100%", maxWidth:580,
        maxHeight:"90vh", overflowY:"auto", animation:"scaleIn 0.3s ease",
      }}>
        {!submitted ? (
          <>
            <div style={{ padding:"24px 28px", borderBottom:"1px solid #f0f0f0" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:22, fontWeight:700, color:"#111" }}>📋 Enquire About Your Build</div>
                  <div style={{ fontSize:13, color:"#888", marginTop:4 }}>
                    {cart.length > 0 ? `${cart.length} component${cart.length>1?"s":""} · ₹${total.toLocaleString("en-IN")}` : "Custom build enquiry"}
                  </div>
                </div>
                <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#999" }}>✕</button>
              </div>
            </div>

            {cart.length > 0 && (
              <div style={{ padding:"16px 28px", background:"#f8faff", borderBottom:"1px solid #eee" }}>
                <div style={{ fontSize:12, color:"#185FA5", fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>Your Selected Components</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {cart.map(c => (
                    <span key={c.id} style={{ background:"#E6F1FB", color:"#185FA5", padding:"4px 10px", borderRadius:20, fontSize:12, fontWeight:500 }}>
                      {c.icon} {c.name.split(" ").slice(0,3).join(" ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ padding:"20px 28px", display:"flex", flexDirection:"column", gap:14 }}>
              {[
                { key:"name",  label:"Full Name *",    type:"text",  placeholder:"Your name" },
                { key:"email", label:"Email *",        type:"email", placeholder:"you@email.com" },
                { key:"phone", label:"Phone Number *", type:"tel",   placeholder:"+91 XXXXX XXXXX" },
                { key:"city",  label:"City",           type:"text",  placeholder:"e.g. Coimbatore" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:13, fontWeight:600, color:"#444", display:"block", marginBottom:6 }}>{f.label}</label>
                  <input
                    type={f.type} placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => set(f.key, e.target.value)}
                    style={{
                      width:"100%", padding:"11px 14px", border:"1.5px solid #ddd",
                      borderRadius:10, fontSize:14, outline:"none", boxSizing:"border-box",
                      transition:"border-color 0.2s",
                    }}
                    onFocus={e => e.target.style.borderColor="#185FA5"}
                    onBlur={e => e.target.style.borderColor="#ddd"}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontSize:13, fontWeight:600, color:"#444", display:"block", marginBottom:6 }}>Build Purpose</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {[["gaming","🎮 Gaming"],["work","💼 Work"],["editing","🎬 Editing"],["server","🗄️ Server"]].map(([v,l]) => (
                    <button key={v} onClick={() => set("purpose",v)} style={{
                      padding:"8px 14px", borderRadius:20, fontSize:13, fontWeight:500, cursor:"pointer",
                      border: form.purpose===v ? "2px solid #185FA5" : "1.5px solid #ddd",
                      background: form.purpose===v ? "#E6F1FB" : "#fff",
                      color: form.purpose===v ? "#185FA5" : "#555",
                    }}>{l}</button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize:13, fontWeight:600, color:"#444", display:"block", marginBottom:6 }}>Additional Message</label>
                <textarea
                  rows={3} placeholder="Any special requirements, budget constraints, or questions..."
                  value={form.message} onChange={e => set("message", e.target.value)}
                  style={{
                    width:"100%", padding:"11px 14px", border:"1.5px solid #ddd", borderRadius:10,
                    fontSize:14, resize:"vertical", outline:"none", boxSizing:"border-box", fontFamily:"inherit",
                  }}
                  onFocus={e => e.target.style.borderColor="#185FA5"}
                  onBlur={e => e.target.style.borderColor="#ddd"}
                />
              </div>

              <button onClick={handleSubmit} disabled={loading} style={{
                padding:"14px", background: loading ? "#aaa" : "linear-gradient(135deg,#185FA5,#0d3d6e)",
                color:"#fff", border:"none", borderRadius:12, fontSize:15, fontWeight:700,
                cursor: loading ? "not-allowed" : "pointer", marginTop:4,
                display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              }}>
                {loading ? <span style={{ animation:"spin 1s linear infinite", display:"inline-block" }}>⏳</span> : "🚀"}
                {loading ? "Sending enquiry..." : "Send Enquiry"}
              </button>

              <div style={{ display:"flex", gap:16, marginTop:4 }}>
                {[["📞","Call us","+(91) 98765 43210"],["📧","Email","builds@pccraft.in"]].map(([ico,l,v]) => (
                  <div key={l} style={{ flex:1, background:"#f8f8f8", borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
                    <div style={{ fontSize:16 }}>{ico}</div>
                    <div style={{ fontSize:11, color:"#888", marginTop:2 }}>{l}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:"#333" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding:"60px 40px", textAlign:"center" }}>
            <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
            <div style={{ fontSize:24, fontWeight:700, color:"#111", marginBottom:8 }}>Enquiry Sent!</div>
            <div style={{ fontSize:15, color:"#666", marginBottom:24 }}>
              Hi <strong>{form.name}</strong>! We've received your enquiry and will contact you at <strong>{form.email}</strong> within 24 hours.
            </div>
            <div style={{ background:"#EAF3DE", borderRadius:12, padding:"16px 20px", marginBottom:24, textAlign:"left" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#3B6D11", marginBottom:8 }}>Enquiry Summary</div>
              {cart.map(c => <div key={c.id} style={{ fontSize:13, color:"#444", marginBottom:2 }}>{c.icon} {c.name} — ₹{c.price.toLocaleString("en-IN")}</div>)}
              {cart.length > 0 && <div style={{ marginTop:8, fontWeight:700, color:"#3B6D11", fontSize:14 }}>Total: ₹{total.toLocaleString("en-IN")}</div>}
            </div>
            <button onClick={onClose} style={{
              padding:"12px 32px", background:"#111", color:"#fff", border:"none",
              borderRadius:12, fontSize:15, fontWeight:600, cursor:"pointer",
            }}>Back to Builder</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── COMPONENT CARD ─────────────────────────────────────────────────────── */
function ComponentCard({ option, selected, onSelect, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const tier = TIER[option.tier];

  const handleCart = (e) => {
    e.stopPropagation();
    onAddToCart(option);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onSelect(option.id)}
      style={{
        border: selected ? "2px solid #185FA5" : "1.5px solid #e8e8e8",
        borderRadius: 14, padding:"14px 16px", cursor:"pointer",
        background: selected ? "#f0f6ff" : "#fff",
        transform: selected ? "scale(1.01)" : "scale(1)",
        transition:"all 0.2s ease", position:"relative",
      }}
    >
      {selected && (
        <div style={{
          position:"absolute", top:-10, right:12, background:"#185FA5", color:"#fff",
          fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20,
        }}>✓ Selected</div>
      )}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#111", flex:1, paddingRight:8 }}>{option.name}</div>
        <span style={{ background:tier.bg, color:tier.color, fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:20, whiteSpace:"nowrap" }}>
          {tier.label}
        </span>
      </div>
      <div style={{ fontSize:12, color:"#888", marginBottom:10 }}>{option.spec}</div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:16, fontWeight:800, color:"#111" }}>
          {option.price === 0 ? <span style={{ color:"#3B6D11" }}>Free</span> : `₹${option.price.toLocaleString("en-IN")}`}
        </div>
        <button onClick={handleCart} style={{
          padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer", border:"none",
          background: added ? "#EAF3DE" : "linear-gradient(135deg,#185FA5,#0d3d6e)",
          color: added ? "#3B6D11" : "#fff",
          transition:"all 0.3s ease",
        }}>
          {added ? "✓ Added!" : "🛒 Add"}
        </button>
      </div>
    </div>
  );
}

/* ─── SECTION ─────────────────────────────────────────────────────────────── */
function ComponentSection({ type, config, selected, onSelect, onAddToCart }) {
  const [open, setOpen] = useState(true);
  const sel = config.options.find(o => o.id === selected);

  return (
    <div style={{ marginBottom:20, background:"#fff", borderRadius:16, border:"1px solid #eeeeee", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 20px", cursor:"pointer", userSelect:"none" }}
      >
        <div style={{ fontSize:26, width:44, height:44, background:"#f5f5f5", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {config.icon}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, color:"#aaa", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{config.cat}</div>
          <div style={{ fontSize:15, fontWeight:700, color:"#111" }}>{config.label}</div>
          {sel && <div style={{ fontSize:12, color:"#185FA5", marginTop:2 }}>{sel.name}</div>}
        </div>
        {sel && <div style={{ fontSize:15, fontWeight:800, color:"#111" }}>₹{sel.price.toLocaleString("en-IN")}</div>}
        <div style={{ fontSize:18, color:"#ccc", transform:open?"rotate(180deg)":"none", transition:"transform 0.25s" }}>▾</div>
      </div>

      {open && (
        <div style={{ padding:"0 16px 16px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:10, borderTop:"1px solid #f5f5f5" }}>
          {config.options.map(opt => (
            <ComponentCard
              key={opt.id}
              option={opt}
              selected={selected === opt.id}
              onSelect={(id) => onSelect(type, id)}
              onAddToCart={(opt) => onAddToCart({ ...opt, icon: config.icon, category: config.label })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── SUMMARY PANEL ──────────────────────────────────────────────────────── */
function SummaryPanel({ selections, onEnquire, cartCount }) {
  const items = Object.entries(selections).filter(([,v])=>v).map(([type,id]) => {
    const opt = COMPONENTS[type].options.find(o=>o.id===id);
    return { type, opt };
  });
  const total = items.reduce((s,{opt}) => s + opt.price, 0);
  const done = items.length;
  const max = Object.keys(COMPONENTS).length;
  const pct = Math.round((done/max)*100);

  return (
    <div style={{ position:"sticky", top:20 }}>
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #eee", overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.06)" }}>
        <div style={{ padding:"18px 20px 14px", background:"linear-gradient(135deg,#0d1b2e,#162440)" }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Build Total</div>
          <div style={{ fontSize:30, fontWeight:800, color:"#fff", marginTop:4 }}>₹{total.toLocaleString("en-IN")}</div>
          <div style={{ marginTop:10, background:"rgba(255,255,255,0.15)", borderRadius:20, height:6, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:"#4fa3e0", borderRadius:20, transition:"width 0.4s ease" }} />
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:6 }}>{done}/{max} components selected</div>
        </div>

        <div style={{ padding:"12px 20px", maxHeight:340, overflowY:"auto" }}>
          {items.length === 0 ? (
            <div style={{ textAlign:"center", padding:"20px 0", color:"#ccc", fontSize:13 }}>Select components to start your build</div>
          ) : items.map(({type,opt}) => (
            <div key={type} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #f8f8f8" }}>
              <div>
                <div style={{ fontSize:11, color:"#aaa" }}>{COMPONENTS[type].label}</div>
                <div style={{ fontSize:13, fontWeight:600, color:"#222" }}>{opt.name.split(" ").slice(0,4).join(" ")}</div>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:"#185FA5" }}>₹{opt.price.toLocaleString("en-IN")}</div>
            </div>
          ))}
        </div>

        {done > 0 && (
          <div style={{ padding:"14px 20px", borderTop:"1px solid #f0f0f0" }}>
            {done === max && (
              <div style={{ background:"#EAF3DE", borderRadius:10, padding:"10px 14px", marginBottom:10, fontSize:13, color:"#3B6D11", fontWeight:600 }}>
                🎉 All components selected!
              </div>
            )}
            <button onClick={onEnquire} style={{
              width:"100%", padding:"13px", background:"linear-gradient(135deg,#185FA5,#0d3d6e)",
              color:"#fff", border:"none", borderRadius:12, fontSize:14, fontWeight:700,
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}>
              📋 Enquire for This Build
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── HERO ───────────────────────────────────────────────────────────────── */
function Hero({ onScrollDown }) {
  return (
    <div style={{
      background:"linear-gradient(135deg,#050d1a 0%,#0a1628 50%,#0d1f3c 100%)",
      padding:"72px 24px 56px", textAlign:"center", position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"absolute", inset:0, opacity:0.04, backgroundImage:"radial-gradient(circle,#4fa3e0 1px,transparent 1px)", backgroundSize:"40px 40px" }} />
      <div style={{ position:"relative", zIndex:1, maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"inline-block", background:"rgba(24,95,165,0.3)", border:"1px solid rgba(79,163,224,0.4)", color:"#4fa3e0", fontSize:12, fontWeight:700, padding:"6px 16px", borderRadius:20, letterSpacing:"0.1em", marginBottom:20 }}>
          ⚙️ CUSTOM PC BUILDER
        </div>
        <h1 style={{ fontSize:"clamp(32px,6vw,56px)", fontWeight:900, color:"#fff", lineHeight:1.1, margin:"0 0 16px" }}>
          Build Your{" "}
          <span style={{ background:"linear-gradient(90deg,#4fa3e0,#9b8ff5)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Dream PC
          </span>
        </h1>
        <p style={{ fontSize:17, color:"rgba(255,255,255,0.6)", maxWidth:480, margin:"0 auto 32px" }}>
          Select components, add to cart, and enquire — we'll build & deliver your custom rig.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={onScrollDown} style={{
            padding:"14px 28px", background:"linear-gradient(135deg,#185FA5,#0d3d6e)", color:"#fff",
            border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer",
          }}>🔧 Start Building</button>
          <button onClick={onScrollDown} style={{
            padding:"14px 28px", background:"rgba(255,255,255,0.08)", color:"#fff",
            border:"1px solid rgba(255,255,255,0.2)", borderRadius:12, fontSize:15, fontWeight:600, cursor:"pointer",
          }}>⚡ Use a Preset</button>
        </div>
        <div style={{ display:"flex", gap:24, justifyContent:"center", marginTop:36, flexWrap:"wrap" }}>
          {[["500+","Builds Completed"],["24h","Delivery Support"],["1 Year","Warranty"],["Free","Assembly"]].map(([n,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:900, color:"#4fa3e0" }}>{n}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN APP ────────────────────────────────────────────────────────────── */
export default function PCBuilderApp() {
  const [selections, setSelections] = useState({});
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState("build");
  const builderRef = useRef(null);

  const addToast = (msg, type="success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const handleSelect = (type, id) => setSelections(p => ({ ...p, [type]: id }));

  const handleAddToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === item.id);
      if (exists) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty+1 } : c);
      return [...prev, { ...item, qty:1 }];
    });
    addToast(`${item.name.split(" ").slice(0,3).join(" ")} added to cart`);
  };

  const handleRemove = (id) => setCart(p => p.filter(c => c.id !== id));

  const handlePreset = (preset) => {
    setSelections(preset.selections);
    setActiveTab("build");
    addToast(`${preset.label} loaded!`, "success");
    setTimeout(() => builderRef.current?.scrollIntoView({ behavior:"smooth" }), 100);
  };

  const cartTotal = cart.reduce((s,i) => s+i.price*i.qty, 0);

  return (
    <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background:"#f7f8fc", minHeight:"100vh", color:"#111" }}>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
        @keyframes drawerIn { from { transform:translateX(100%); } to { transform:translateX(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      {/* NAV */}
      <nav style={{
        position:"sticky", top:0, zIndex:100, background:"rgba(5,13,26,0.95)",
        backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,0.08)",
        display:"flex", alignItems:"center", padding:"0 24px", height:60,
      }}>
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:20, fontWeight:900, color:"#fff", letterSpacing:"-0.02em" }}>⚙️ <span style={{ color:"#4fa3e0" }}>PC</span>Craft</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={() => setShowEnquiry(true)} style={{
            padding:"8px 16px", background:"rgba(24,95,165,0.3)", color:"#4fa3e0",
            border:"1px solid rgba(79,163,224,0.3)", borderRadius:20, fontSize:13, fontWeight:600, cursor:"pointer",
          }}>📋 Enquire</button>
          <button onClick={() => setShowCart(true)} style={{
            padding:"8px 16px", background:"linear-gradient(135deg,#185FA5,#0d3d6e)", color:"#fff",
            border:"none", borderRadius:20, fontSize:13, fontWeight:700, cursor:"pointer",
            display:"flex", alignItems:"center", gap:6, position:"relative",
          }}>
            🛒 Cart
            {cart.length > 0 && (
              <span style={{
                background:"#e74c3c", color:"#fff", fontSize:10, fontWeight:900,
                width:18, height:18, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
              }}>{cart.length}</span>
            )}
          </button>
        </div>
      </nav>

      <Hero onScrollDown={() => builderRef.current?.scrollIntoView({ behavior:"smooth" })} />

      {/* PRESETS */}
      <div style={{ padding:"32px 24px 0", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ fontSize:12, color:"#aaa", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Start with a preset</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12, marginBottom:32 }}>
          {Object.entries(PRESETS).map(([k,p]) => (
            <div key={k} onClick={() => handlePreset(p)} style={{
              padding:"18px 20px", borderRadius:14, cursor:"pointer",
              background:p.bg, border:"1px solid rgba(255,255,255,0.06)",
              transition:"transform 0.2s, box-shadow 0.2s",
              boxShadow:"0 4px 20px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.15)"; }}
            >
              <div style={{ fontSize:28, marginBottom:8 }}>{p.emoji}</div>
              <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>{p.label}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginTop:4 }}>{p.desc}</div>
              <div style={{ marginTop:12, fontSize:12, color:p.color, fontWeight:700, background:"rgba(255,255,255,0.1)", padding:"4px 10px", borderRadius:20, display:"inline-block" }}>
                Load Preset →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BUILDER */}
      <div ref={builderRef} style={{ padding:"0 24px 60px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ fontSize:12, color:"#aaa", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16 }}>Configure components</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:24, alignItems:"start" }}>
          <div>
            {Object.entries(COMPONENTS).map(([type,config]) => (
              <ComponentSection
                key={type} type={type} config={config}
                selected={selections[type]}
                onSelect={handleSelect}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
          <SummaryPanel selections={selections} onEnquire={() => setShowEnquiry(true)} cartCount={cart.length} />
        </div>
      </div>

      {/* CONTACT STRIP */}
      <div style={{ background:"linear-gradient(135deg,#0a1628,#050d1a)", padding:"40px 24px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:8 }}>Not sure what to pick?</div>
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.5)", marginBottom:28 }}>Our experts will build the perfect rig for your budget and needs.</div>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            {[["📞","Call Us","+(91) 98765 43210","tel:+919876543210"],["📧","Email","builds@pccraft.in","mailto:builds@pccraft.in"],["💬","WhatsApp","Chat Now","https://wa.me/919876543210"]].map(([ico,l,v,href]) => (
              <a key={l} href={href} style={{
                display:"flex", alignItems:"center", gap:10, padding:"14px 22px",
                background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:12, textDecoration:"none", color:"#fff", minWidth:160,
                transition:"background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.07)"}
              >
                <span style={{ fontSize:22 }}>{ico}</span>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{l}</div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{v}</div>
                </div>
              </a>
            ))}
          </div>
          <button onClick={() => setShowEnquiry(true)} style={{
            marginTop:24, padding:"14px 36px", background:"linear-gradient(135deg,#185FA5,#0d3d6e)",
            color:"#fff", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer",
          }}>📋 Send Enquiry Now</button>
        </div>
      </div>

      {showCart && (
        <CartDrawer
          cart={cart} onClose={() => setShowCart(false)}
          onRemove={handleRemove}
          onEnquire={() => { setShowCart(false); setShowEnquiry(true); }}
        />
      )}

      {showEnquiry && (
        <EnquiryModal
          onClose={() => setShowEnquiry(false)}
          cart={cart}
          buildSelections={selections}
          addToast={addToast}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
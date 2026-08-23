import { useState, useEffect, useReducer, useContext, createContext, useCallback, useRef, useMemo } from "react"
import { Home, Car, DollarSign, Plus, X, Search, Trash2, ChevronRight, Bell, AlertTriangle, AlertCircle, CheckCircle, ArrowLeft, Download, Upload, FileText, Shield, Wrench, RefreshCw, List, Edit, Camera, Globe, Eye, EyeOff, LogOut } from "lucide-react"

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2)
const fmt = n => `QAR ${(+n || 0).toLocaleString()}`
const fmtD = d => d ? new Date(d + "T12:00:00").toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—"
const today = () => new Date().toISOString().split("T")[0]
const daysUntil = d => d ? Math.round((new Date(d + "T12:00:00") - new Date()) / 86400000) : null
const calcDur = (a, b) => (a && b) ? Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000)) : 0
const barsFrom = arr => { const max = Math.max(1, ...arr); return arr.map(v => Math.max(8, Math.round((v / max) * 100))) }

const CAR_STATUS = {
  available:   { label:"Available",   cls:"bg-emerald-100 text-emerald-700", emoji:"✅" },
  rented:      { label:"Rented",      cls:"bg-violet-100 text-violet-700",   emoji:"🔑" },
  maintenance: { label:"Maintenance", cls:"bg-amber-100 text-amber-700",     emoji:"🔧" },
  accident:    { label:"Accident",    cls:"bg-rose-100 text-rose-700",       emoji:"🚨" },
  sold:        { label:"Sold",        cls:"bg-gray-200 text-gray-500",       emoji:"📦" },
}
const RENT_STATUS = {
  active:    { label:"Active",    cls:"bg-violet-100 text-violet-700" },
  completed: { label:"Completed", cls:"bg-emerald-100 text-emerald-700" },
  late:      { label:"Late",      cls:"bg-rose-100 text-rose-700" },
  cancelled: { label:"Cancelled", cls:"bg-gray-100 text-gray-500" },
}
const ACC_STATUS = {
  open:         { label:"Open",         cls:"bg-rose-100 text-rose-700" },
  under_repair: { label:"Under Repair", cls:"bg-amber-100 text-amber-700" },
  insurance:    { label:"Insurance",    cls:"bg-blue-100 text-blue-700" },
  completed:    { label:"Completed",    cls:"bg-emerald-100 text-emerald-700" },
}
const EXP_TYPES = ["maintenance","repair","insurance","registration","carwash","fuel","other"]
const DOC_CATS = [["doc_registration","📋 Registration"],["doc_insurance","🛡️ Insurance"],["doc_inspection","🔍 Inspection"],["doc_other","📎 Other"]]
const STATUS_ACCENT = { available:"from-emerald-400 to-teal-500", rented:"from-violet-500 to-indigo-500", maintenance:"from-amber-400 to-orange-400", accident:"from-rose-500 to-pink-500", sold:"from-gray-300 to-gray-400" }
const CAR_FEATURES_LIST = ["AC","Bluetooth","GPS","USB","Backup Camera","Cruise Control","Sunroof","Leather Seats","Keyless Entry","Apple CarPlay","Android Auto","Push Start"]
const MEDIA_PFX = "fm-media:"

const DEMO = {
  ownerName:"Ahmed",
  business:{ name:"Car'e Car Rental", tagline:"Easiest Way to Rent a Car in Doha", whatsapp:"+97470469346", phone:"+97470469346", location:"Doha, Qatar", instagram:"carsychatrist", facebook:"", about:"Car'e Car Rental makes renting a car in Doha simple, fast and affordable. Modern fleet, transparent pricing, and friendly service!", publicGistId:"" },
  cars:[
    { id:"c1", nickname:"Farida", brand:"FORD", model:"Sedan", year:2018, plateNumber:"815266", color:"White", vin:"", currentMileage:161000, status:"rented", purchaseDate:"2020-01-15", purchasePrice:45000, estimatedValue:28000, notes:"", registrationExpiry:"2026-08-15", insuranceExpiry:"2026-07-04", inspectionExpiry:"2026-09-20", roadPermitExpiry:"2026-12-01", warrantyExpiry:"", lastOilChangeMileage:158000, nextOilChangeMileage:163000, lastOilChangeDate:"2026-04-28", oilType:"5W-30", garage:"Al Mana Garage", oilChangeCost:120, published:true, dailyRate:150, weeklyRate:900, monthlyRate:3000, features:["AC","Bluetooth","GPS"], publicDescription:"Comfortable family sedan in excellent condition.", publicPhotoUrl:"", createdAt:new Date().toISOString() },
    { id:"c2", nickname:"MG Silver", brand:"MG", model:"SUV", year:2023, plateNumber:"916941", color:"Silver", vin:"", currentMileage:54000, status:"available", purchaseDate:"2023-03-15", purchasePrice:75000, estimatedValue:65000, notes:"", registrationExpiry:"2026-12-01", insuranceExpiry:"2026-07-03", inspectionExpiry:"2026-06-24", roadPermitExpiry:"2027-03-01", warrantyExpiry:"2028-03-15", lastOilChangeMileage:52000, nextOilChangeMileage:57000, lastOilChangeDate:"2026-05-28", oilType:"0W-20", garage:"MG Service Center", oilChangeCost:180, published:true, dailyRate:220, weeklyRate:1300, monthlyRate:4800, features:["AC","GPS","Leather Seats","Backup Camera"], publicDescription:"Modern SUV with premium features.", publicPhotoUrl:"", createdAt:new Date().toISOString() },
    { id:"c3", nickname:"Chery Black", brand:"CHERY", model:"Sedan", year:2026, plateNumber:"3", color:"Black", vin:"", currentMileage:5000, status:"available", purchaseDate:"2025-12-01", purchasePrice:90000, estimatedValue:88000, notes:"New car", registrationExpiry:"2027-12-01", insuranceExpiry:"2027-06-01", inspectionExpiry:"2027-06-01", roadPermitExpiry:"2027-12-01", warrantyExpiry:"2029-12-01", lastOilChangeMileage:0, nextOilChangeMileage:5000, lastOilChangeDate:"", oilType:"5W-30", garage:"", oilChangeCost:0, published:false, dailyRate:190, weeklyRate:1100, monthlyRate:4000, features:["AC","Bluetooth"], publicDescription:"", publicPhotoUrl:"", createdAt:new Date().toISOString() },
  ],
  rentals:[
    { id:"r1", carId:"c1", customerName:"REEM", customerPhone:"+974 5555 1234", customerIdNumber:"QA12345678", startDate:"2026-01-06", endDate:"2026-01-11", actualReturnDate:null, rateType:"daily", rateAmount:900, deposit:1000, paymentReceived:4500, startMileage:156000, endMileage:null, fuelOut:80, fuelIn:null, conditionOut:"Good", conditionIn:"", status:"active", notes:"", createdAt:new Date().toISOString() },
  ],
  accidents:[], expenses:[
    { id:"e1", carId:"c1", type:"maintenance", amount:120, date:"2026-04-28", description:"Oil change", notes:"", createdAt:new Date().toISOString() },
    { id:"e2", carId:"c2", type:"insurance", amount:2500, date:"2025-07-03", description:"Annual insurance", notes:"", createdAt:new Date().toISOString() },
  ], media:[],
}

const mediaCache = new Map()
async function saveMedia(id, dataUrl) { mediaCache.set(id, dataUrl); try { localStorage.setItem(MEDIA_PFX + id, dataUrl) } catch(e) {} }
async function loadMedia(id) { if (mediaCache.has(id)) return mediaCache.get(id); const v = localStorage.getItem(MEDIA_PFX + id); if (v) { mediaCache.set(id, v); return v }; return null }
async function deleteMedia(id) { mediaCache.delete(id); localStorage.removeItem(MEDIA_PFX + id) }
function resizeImage(file, maxDim = 1100, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxDim || height > maxDim) { if (width > height) { height = Math.round(height * maxDim / width); width = maxDim } else { width = Math.round(width * maxDim / height); height = maxDim } }
        const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height
        canvas.getContext("2d").drawImage(img, 0, 0, width, height)
        const out = canvas.toDataURL("image/jpeg", quality)
        if (out.length > 4500000 && quality > 0.5) resolve(resizeImage(file, 800, 0.5)); else resolve(out)
      }
      img.onerror = () => reject(new Error("Bad image")); img.src = e.target.result
    }
    reader.onerror = () => reject(); reader.readAsDataURL(file)
  })
}

const Ctx = createContext()
function reduce(s, a) {
  switch(a.t) {
    case "ADD_CAR":   return { ...s, cars: [...s.cars, a.p] }
    case "UPD_CAR":   return { ...s, cars: s.cars.map(x => x.id === a.p.id ? a.p : x) }
    case "DEL_CAR":   return { ...s, cars: s.cars.filter(x => x.id !== a.p), rentals: s.rentals.filter(x => x.carId !== a.p), accidents: s.accidents.filter(x => x.carId !== a.p), expenses: s.expenses.filter(x => x.carId !== a.p), media: s.media.filter(x => !(x.ownerType === "car" && x.ownerId === a.p)) }
    case "ADD_RENT":  return { ...s, rentals: [...s.rentals, a.p] }
    case "UPD_RENT":  return { ...s, rentals: s.rentals.map(x => x.id === a.p.id ? a.p : x) }
    case "DEL_RENT":  return { ...s, rentals: s.rentals.filter(x => x.id !== a.p), media: s.media.filter(x => !(x.ownerType === "rental" && x.ownerId === a.p)) }
    case "ADD_ACC":   return { ...s, accidents: [...s.accidents, a.p] }
    case "UPD_ACC":   return { ...s, accidents: s.accidents.map(x => x.id === a.p.id ? a.p : x) }
    case "DEL_ACC":   return { ...s, accidents: s.accidents.filter(x => x.id !== a.p), media: s.media.filter(x => !(x.ownerType === "accident" && x.ownerId === a.p)) }
    case "ADD_EXP":   return { ...s, expenses: [...s.expenses, a.p] }
    case "UPD_EXP":   return { ...s, expenses: s.expenses.map(x => x.id === a.p.id ? a.p : x) }
    case "DEL_EXP":   return { ...s, expenses: s.expenses.filter(x => x.id !== a.p) }
    case "ADD_MEDIA": return { ...s, media: [...s.media, a.p] }
    case "DEL_MEDIA": return { ...s, media: s.media.filter(x => x.id !== a.p) }
    case "SET_NAME":  return { ...s, ownerName: a.p }
    case "SET_BIZ":   return { ...s, business: { ...s.business, ...a.p } }
    case "LOAD":      return { ...DEMO, ...a.p }
    case "RESET":     return DEMO
    default: return s
  }
}
function Store({ children }) {
  const [state, dispatch] = useReducer(reduce, null, () => {
    try { const r = localStorage.getItem("fleet-v2"); if (r) return { ...DEMO, ...JSON.parse(r) } } catch(_) {}
    return DEMO
  })
  const timer = useRef(null)
  useEffect(() => { clearTimeout(timer.current); timer.current = setTimeout(() => { try { localStorage.setItem("fleet-v2", JSON.stringify(state)) } catch(e) {} }, 700) }, [state])
  return <Ctx.Provider value={{ s:state, d:dispatch }}>{children}</Ctx.Provider>
}
const useStore = () => useContext(Ctx)

// ── PRIMITIVES ──
const Btn = ({ children, onClick, v="primary", size="md", className="", disabled=false }) => {
  const vs = { primary:"bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md shadow-violet-200 active:opacity-80", success:"bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-200 active:opacity-80", danger:"bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200 active:opacity-80", outline:"border-2 border-gray-200 bg-white text-gray-600 active:bg-gray-50", secondary:"bg-gray-100 text-gray-600 active:bg-gray-200" }
  const ss = { sm:"px-3 py-1.5 text-xs", md:"px-4 py-3 text-sm", lg:"px-5 py-4 text-base" }
  return <button onClick={onClick} disabled={disabled} className={`${vs[v]} ${ss[size]} font-black rounded-2xl transition-all disabled:opacity-40 ${className}`}>{children}</button>
}
const Badge = ({ status, map }) => { const c = map[status] || { label:status, cls:"bg-gray-100 text-gray-500" }; return <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${c.cls}`}>{c.label}</span> }
const Inp = ({ className="", ...p }) => <input className={`w-full px-4 py-3 border-2 border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-violet-300 bg-white transition-colors ${className}`} {...p} />
const Sel = ({ children, className="", ...p }) => <select className={`w-full px-4 py-3 border-2 border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-violet-300 bg-white transition-colors ${className}`} {...p}>{children}</select>
const Txa = ({ className="", ...p }) => <textarea className={`w-full px-4 py-3 border-2 border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-violet-300 bg-white resize-none transition-colors ${className}`} rows={3} {...p} />
const Fld = ({ label, children, className="" }) => <div className={`mb-4 ${className}`}><label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>{children}</div>

// ── MEDIA ──
function CarThumb({ mediaId, size="w-14 h-14", iconSize=20, rounded="rounded-2xl" }) {
  const [src, setSrc] = useState(mediaId ? mediaCache.get(mediaId) : null)
  useEffect(() => { if (mediaId && !src) loadMedia(mediaId).then(setSrc) }, [mediaId])
  return (
    <div className={`${size} ${rounded} bg-gradient-to-br from-gray-100 to-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center`}>
      {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-300" style={{fontSize:iconSize}}>🚗</span>}
    </div>
  )
}
function PhotoThumb({ id, onView, onDelete }) {
  const [src, setSrc] = useState(mediaCache.get(id) || null)
  useEffect(() => { if (!src) loadMedia(id).then(setSrc) }, [id])
  return (
    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
      {src ? <img src={src} alt="" onClick={() => onView?.(src)} className="w-full h-full object-cover active:opacity-75" /> : <div className="w-full h-full animate-pulse bg-gray-200 flex items-center justify-center"><span className="text-2xl">📷</span></div>}
      {onDelete && <button onClick={e => { e.stopPropagation(); onDelete() }} className="absolute top-1 right-1 bg-black/60 rounded-full p-1"><X size={10} className="text-white" /></button>}
    </div>
  )
}
function PhotoPicker({ ownerType, ownerId, category }) {
  const { d } = useStore(); const ref = useRef(null); const [busy, setBusy] = useState(false)
  const handle = async e => {
    const file = e.target.files?.[0]; e.target.value = ""; if (!file) return
    setBusy(true)
    try { const dataUrl = await resizeImage(file); const id = uid(); await saveMedia(id, dataUrl); d({ t:"ADD_MEDIA", p:{ id, ownerType, ownerId, category, createdAt:new Date().toISOString() } }) }
    catch(err) { alert("Could not process photo.") }
    setBusy(false)
  }
  return (
    <button onClick={() => ref.current?.click()} disabled={busy} className="w-20 h-20 rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50 flex flex-col items-center justify-center gap-1 active:bg-violet-100 flex-shrink-0">
      <input ref={ref} type="file" accept="image/*" capture="environment" className="hidden" onChange={handle} />
      {busy ? <RefreshCw size={16} className="animate-spin text-violet-400" /> : <><span className="text-xl">📷</span><span className="text-[9px] font-black text-violet-400">ADD</span></>}
    </button>
  )
}
function MediaSection({ title, ownerType, ownerId, category, single=false }) {
  const { s, d } = useStore(); const items = s.media.filter(m => m.ownerType === ownerType && m.ownerId === ownerId && m.category === category)
  const [viewSrc, setViewSrc] = useState(null); const [delId, setDelId] = useState(null)
  const confirmDelete = async () => { await deleteMedia(delId); d({ t:"DEL_MEDIA", p:delId }); setDelId(null) }
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-xs font-black text-gray-500 mb-2">{title}</p>
      <div className="flex gap-2 overflow-x-auto no-scroll pb-1">
        {items.map(m => <PhotoThumb key={m.id} id={m.id} onView={setViewSrc} onDelete={() => setDelId(m.id)} />)}
        {(!single || items.length === 0) && <PhotoPicker ownerType={ownerType} ownerId={ownerId} category={category} />}
      </div>
      {viewSrc && <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6" onClick={() => setViewSrc(null)}><img src={viewSrc} alt="" className="max-w-full max-h-full rounded-3xl" /><button className="absolute top-5 right-5 p-2 bg-white/20 rounded-full"><X size={20} className="text-white" /></button></div>}
      {delId && <Confirm msg="Delete this photo?" onOk={confirmDelete} onCancel={() => setDelId(null)} />}
    </div>
  )
}

// ── LAYOUT ──
function Header({ title, onBack, action }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
      <div className="flex items-center h-14 px-4 gap-2">
        {onBack && <button onClick={onBack} className="p-2 -ml-2 rounded-2xl active:bg-gray-100"><ArrowLeft size={20} className="text-gray-500" /></button>}
        <h1 className="flex-1 text-xl font-black text-gray-900 truncate">{title}</h1>
        {action}
      </div>
    </div>
  )
}
function BottomNav({ tab, setTab }) {
  const NAV = [
    { id:"home", Icon:Home, label:"Home", color:"text-violet-600", bg:"bg-violet-100" },
    { id:"cars", Icon:Car, label:"Cars", color:"text-blue-600", bg:"bg-blue-100" },
    { id:"rentals", Icon:List, label:"Rentals", color:"text-teal-600", bg:"bg-teal-100" },
    { id:"finance", Icon:DollarSign, label:"Money", color:"text-amber-600", bg:"bg-amber-100" },
    { id:"more", Icon:Globe, label:"More", color:"text-violet-600", bg:"bg-violet-100" },
  ]
  return (
    <div className="fixed bottom-3 left-0 right-0 max-w-md mx-auto z-20 px-3">
      <nav className="bg-white rounded-3xl shadow-2xl shadow-black/10 flex py-2 px-2">
        {NAV.map(({ id, Icon, label, color, bg }) => (
          <button key={id} onClick={() => setTab(id)} className="flex-1 flex flex-col items-center gap-0.5 py-1">
            <div className={`w-10 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${tab === id ? `${bg} scale-110` : ""}`}>
              <Icon size={19} className={tab === id ? color : "text-gray-300"} strokeWidth={tab === id ? 2.5 : 1.8} />
            </div>
            <span className={`text-[10px] font-black transition-colors ${tab === id ? color : "text-gray-300"}`}>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
function Modal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col justify-end" onClick={onClose}>
      <div className="bg-gray-50 rounded-t-3xl max-h-[93vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-1 flex-shrink-0" />
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
          <h2 className="font-black text-gray-900 text-base">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-2xl bg-gray-100"><X size={15} className="text-gray-500" /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-4 py-2">{children}</div>
        {footer && <div className="px-4 py-4 bg-white border-t border-gray-100 flex-shrink-0">{footer}</div>}
      </div>
    </div>
  )
}
function Confirm({ msg, onOk, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end" onClick={onCancel}>
      <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
        <div className="text-4xl mb-3 text-center">🗑️</div>
        <p className="font-black text-gray-800 text-center mb-1">Are you sure?</p>
        <p className="text-sm text-gray-400 text-center mb-5">{msg}</p>
        <div className="flex gap-3"><Btn onClick={onCancel} v="outline" className="flex-1">Cancel</Btn><Btn onClick={onOk} v="danger" className="flex-1">Yes, Delete</Btn></div>
      </div>
    </div>
  )
}
function SCard({ title, children, className="" }) {
  return (
    <div className={`bg-white rounded-3xl shadow-sm overflow-hidden ${className}`}>
      {title && <div className="px-4 py-3 border-b border-gray-50"><p className="text-sm font-black text-gray-800">{title}</p></div>}
      <div className="p-4">{children}</div>
    </div>
  )
}
function InfoRow({ label, value, danger=false }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-50 last:border-0 gap-2">
      <span className="text-xs text-gray-400 flex-shrink-0">{label}</span>
      <span className={`text-sm font-bold text-right ${danger ? "text-rose-600" : "text-gray-800"}`}>{value || "—"}</span>
    </div>
  )
}
function StatTile({ emoji, label, value, sub, bars, gradient, onClick }) {
  return (
    <button onClick={onClick} className={`bg-gradient-to-br ${gradient} rounded-3xl p-4 text-left active:scale-95 transition-transform shadow-lg w-full`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-2xl">{emoji}</span>
        <div className="flex items-end gap-0.5 h-7 opacity-40">{bars.map((h, i) => <div key={i} className="w-1.5 rounded-full bg-white" style={{ height:`${h}%` }} />)}</div>
      </div>
      <div className="text-white font-black text-lg leading-tight">{value}</div>
      <div className="text-white/70 text-[11px] font-bold mt-0.5">{label}</div>
      {sub && <div className="text-white/50 text-[10px] mt-0.5 truncate">{sub}</div>}
    </button>
  )
}

// ════════════ CLOUD SYNC ════════════
function CloudSync() {
  const { s, d } = useStore()
  const [token, setToken] = useState(() => localStorage.getItem("fleet-gh-token") || "")
  const [gistId, setGistId] = useState(() => localStorage.getItem("fleet-gh-gist") || "")
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const [lastSync, setLastSync] = useState(() => localStorage.getItem("fleet-gh-lastsync") || "")
  const [showToken, setShowToken] = useState(false)
  const headers = tok => ({ "Authorization":`Bearer ${tok}`, "Content-Type":"application/json", "X-GitHub-Api-Version":"2022-11-28" })

  const push = async () => {
    if (!token) { setStatus({ ok:false, msg:"Enter your GitHub token first." }); return }
    setBusy(true); setStatus({ ok:null, msg:"☁️ Saving to GitHub…" })
    try {
      const payload = JSON.stringify({ description:"🚗 Fleet Manager Backup", public:false, files:{ "fleet-manager-data.json":{ content:JSON.stringify(s) } } })
      const method = gistId ? "PATCH" : "POST"; const url = gistId ? `https://api.github.com/gists/${gistId}` : "https://api.github.com/gists"
      const res = await fetch(url, { method, headers:headers(token), body:payload })
      if (!res.ok) { const e = await res.json().catch(()=>{}); throw new Error(e?.message || `HTTP ${res.status}`) }
      const data = await res.json()
      if (!gistId) { setGistId(data.id); localStorage.setItem("fleet-gh-gist", data.id) }
      localStorage.setItem("fleet-gh-token", token)
      const ts = new Date().toLocaleString("en-GB"); setLastSync(ts); localStorage.setItem("fleet-gh-lastsync", ts)
      setStatus({ ok:true, msg:`✅ Saved to cloud!` })
    } catch(e) { setStatus({ ok:false, msg:`❌ ${e.message}` }) }
    setBusy(false)
  }

  const pull = async () => {
    if (!token || !gistId) { setStatus({ ok:false, msg:"Enter token and Gist ID." }); return }
    setBusy(true); setStatus({ ok:null, msg:"⬇️ Loading from GitHub…" })
    try {
      const res = await fetch(`https://api.github.com/gists/${gistId}`, { headers:headers(token) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json(); const content = data.files?.["fleet-manager-data.json"]?.content
      if (!content) throw new Error("No fleet data in Gist.")
      d({ t:"LOAD", p:JSON.parse(content) })
      const ts = new Date().toLocaleString("en-GB"); setLastSync(ts); localStorage.setItem("fleet-gh-lastsync", ts)
      localStorage.setItem("fleet-gh-token", token)
      setStatus({ ok:true, msg:"✅ Data loaded! 🎉" })
    } catch(e) { setStatus({ ok:false, msg:`❌ ${e.message}` }) }
    setBusy(false)
  }

  return (
    <SCard title="☁️ Cloud Sync — GitHub Gist">
      <Fld label="GitHub Personal Access Token">
        <div className="relative"><Inp value={token} onChange={e => setToken(e.target.value)} type={showToken ? "text" : "password"} placeholder="ghp_xxxx…" className="pr-16" /><button onClick={() => setShowToken(v => !v)} className="absolute right-3 top-3 text-xs text-violet-500 font-black">{showToken ? "Hide" : "Show"}</button></div>
      </Fld>
      <Fld label="Gist ID (auto-filled after first push)">
        <Inp value={gistId} onChange={e => setGistId(e.target.value)} placeholder="Leave empty to create new" />
      </Fld>
      {lastSync && <p className="text-xs text-gray-400 mb-3">🕐 Last synced: {lastSync}</p>}
      {status && <div className={`p-3 rounded-2xl text-xs font-semibold mb-4 ${status.ok===true?"bg-emerald-50 text-emerald-700":status.ok===false?"bg-rose-50 text-rose-700":"bg-blue-50 text-blue-700"}`}>{status.msg}</div>}
      <div className="flex gap-2">
        <Btn onClick={push} disabled={busy} className="flex-1 flex items-center justify-center gap-1.5"><Upload size={14}/>Push to Cloud</Btn>
        <Btn onClick={pull} v="outline" disabled={busy} className="flex-1 flex items-center justify-center gap-1.5"><Download size={14}/>Pull from Cloud</Btn>
      </div>
    </SCard>
  )
}

// ════════════ PUBLISH TO WEBSITE ════════════
function PublishWebsite() {
  const { s, d } = useStore()
  const [token, setToken] = useState(() => localStorage.getItem("fleet-gh-token") || "")
  const [publicGistId, setPublicGistId] = useState(() => s.business?.publicGistId || "")
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const publishedCount = s.cars.filter(c => c.published).length

  const publish = async () => {
    if (!token) { setStatus({ ok:false, msg:"Enter your GitHub token in Cloud Sync first." }); return }
    setBusy(true); setStatus({ ok:null, msg:"🌐 Publishing to website…" })
    try {
      const websiteData = {
        business: s.business || {},
        cars: s.cars.filter(c => c.published).map(c => ({
          id:c.id, nickname:c.nickname, brand:c.brand, model:c.model, year:c.year, color:c.color,
          status:c.status, dailyRate:c.dailyRate, weeklyRate:c.weeklyRate, monthlyRate:c.monthlyRate,
          features:c.features||[], publicDescription:c.publicDescription||"", publicPhotoUrl:c.publicPhotoUrl||"", published:c.published,
        })),
        updatedAt: new Date().toISOString(),
      }
      const headers = { "Authorization":`Bearer ${token}`, "Content-Type":"application/json" }
      const method = publicGistId ? "PATCH" : "POST"
      const url = publicGistId ? `https://api.github.com/gists/${publicGistId}` : "https://api.github.com/gists"
      const res = await fetch(url, { method, headers, body: JSON.stringify({ description:"🚗 Car Rental Website Data (Public)", public:true, files:{ "fleet-website.json":{ content:JSON.stringify(websiteData, null, 2) } } }) })
      if (!res.ok) { const e = await res.json().catch(()=>{}); throw new Error(e?.message || `HTTP ${res.status}`) }
      const data = await res.json()
      const newId = data.id
      setPublicGistId(newId)
      d({ t:"SET_BIZ", p:{ publicGistId: newId } })
      localStorage.setItem("fleet-public-gist-id", newId)
      const sUrl = `${window.location.origin}${window.location.pathname}?g=${newId}`
      setShareUrl(sUrl)
      setStatus({ ok:true, msg:`✅ Website updated! ${publishedCount} cars published.` })
    } catch(e) { setStatus({ ok:false, msg:`❌ ${e.message}` }) }
    setBusy(false)
  }

  const copyUrl = () => { navigator.clipboard?.writeText(shareUrl); alert("URL copied! Share this link with customers.") }

  return (
    <SCard title="🌐 Publish to Website">
      <div className="mb-4 p-3.5 bg-emerald-50 rounded-2xl text-xs text-emerald-800 leading-relaxed">
        <p className="font-black mb-1">How it works:</p>
        <p>Mark cars as "Published" in their settings → click Publish → your public website updates instantly!</p>
        <p className="mt-1 text-emerald-600">Currently <strong>{publishedCount}</strong> cars marked as published.</p>
      </div>
      {shareUrl && (
        <div className="mb-4 p-3 bg-violet-50 rounded-2xl">
          <p className="text-xs font-black text-violet-700 mb-1">🔗 Your Website URL:</p>
          <p className="text-xs text-violet-600 break-all mb-2">{shareUrl}</p>
          <Btn onClick={copyUrl} v="outline" size="sm" className="w-full">Copy & Share URL</Btn>
        </div>
      )}
      {status && <div className={`p-3 rounded-2xl text-xs font-semibold mb-4 ${status.ok===true?"bg-emerald-50 text-emerald-700":status.ok===false?"bg-rose-50 text-rose-700":"bg-blue-50 text-blue-700"}`}>{status.msg}</div>}
      <Btn onClick={publish} disabled={busy} className="w-full flex items-center justify-center gap-2" size="lg">
        <Globe size={16}/>{busy?"Publishing…":"Publish to Website"}
      </Btn>
    </SCard>
  )
}

// ════════════ DASHBOARD ════════════
function Dashboard({ nav }) {
  const { s } = useStore()
  const stats = useMemo(() => ({ total:s.cars.length, available:s.cars.filter(c=>c.status==="available").length, rented:s.cars.filter(c=>c.status==="rented").length, issues:s.cars.filter(c=>c.status==="maintenance"||c.status==="accident").length }), [s.cars])
  const alerts = useMemo(() => {
    const list = []
    s.cars.forEach(car => {
      [["registrationExpiry","Registration"],["insuranceExpiry","Insurance"],["inspectionExpiry","Inspection"]].forEach(([f,lbl]) => { const dd = daysUntil(car[f]); if (dd !== null && dd <= 30) list.push({ type:dd<=7?"error":"warn", text:`${car.nickname} – ${lbl} ${dd<0?`expired ${Math.abs(dd)}d ago`:dd===0?"expires TODAY":`in ${dd}d`}` }) })
      const km = (car.nextOilChangeMileage||0)-(car.currentMileage||0); if (km<=500) list.push({ type:km<=0?"error":"warn", text:`${car.nickname} – Oil ${km<=0?"OVERDUE 🛢️":`due in ${km}km`}` })
    })
    s.rentals.filter(r=>r.status==="active"&&r.endDate<today()).forEach(r => { const car=s.cars.find(c=>c.id===r.carId); list.push({ type:"error", text:`${car?.nickname||"Car"} overdue – ${r.customerName}` }) })
    return list
  }, [s.cars, s.rentals])
  const activeRentals = s.rentals.filter(r=>r.status==="active")
  const activeSorted = [...activeRentals].sort((a,b)=>new Date(a.endDate)-new Date(b.endDate))
  const monthIncome = useMemo(() => { const m=new Date().getMonth(),y=new Date().getFullYear(); return s.rentals.filter(r=>r.status!=="cancelled"&&new Date(r.startDate).getMonth()===m&&new Date(r.startDate).getFullYear()===y).reduce((a,r)=>a+(r.paymentReceived||0),0) }, [s.rentals])
  const last6 = useMemo(() => { const out=[],n=new Date(); for(let i=5;i>=0;i--){const dt=new Date(n.getFullYear(),n.getMonth()-i,1);out.push(s.rentals.filter(r=>r.status!=="cancelled"&&new Date(r.startDate).getMonth()===dt.getMonth()&&new Date(r.startDate).getFullYear()===dt.getFullYear()).reduce((a,r)=>a+(r.paymentReceived||0),0))} return out }, [s.rentals])
  const h = new Date().getHours()
  const greet = h<6?"🌙 Up late?":h<12?"☀️ Good morning":h<17?"👋 Good afternoon":"🌅 Good evening"
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/40 pb-28">
      <div className="px-5 pt-12 pb-4 bg-white">
        <div className="flex items-center justify-between mb-1">
          <div><p className="text-gray-400 text-sm font-semibold">{greet}, {s.ownerName||"Ahmed"}!</p><h1 className="text-3xl font-black text-gray-900 tracking-tight">Fleet Manager</h1></div>
          <div className="flex items-center gap-2">
            <button onClick={()=>nav("renewals",{})} className="relative p-2.5 bg-gray-50 rounded-2xl active:bg-gray-100"><Bell size={18} className="text-gray-500" />{alerts.length>0&&<span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-[9px] font-black text-white flex items-center justify-center shadow-sm">{alerts.length}</span>}</button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-md shadow-violet-200">{(s.ownerName||"A")[0].toUpperCase()}</div>
          </div>
        </div>
      </div>
      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        <StatTile emoji="🚗" label="Total Fleet" value={`${stats.total} Cars`} sub={`${stats.available} ready · ${stats.rented} rented`} bars={barsFrom([stats.available||0,stats.rented||0,stats.issues||0])} gradient="from-violet-500 to-indigo-600" onClick={()=>nav("cars",{})} />
        <StatTile emoji="🔑" label="Active Rentals" value={activeRentals.length||"None"} sub={activeSorted[0]?`Due ${fmtD(activeSorted[0].endDate)}`:"All quiet 🎉"} bars={barsFrom(s.rentals.slice(-3).map(r=>calcDur(r.startDate,r.endDate)||1))} gradient="from-blue-500 to-cyan-400" onClick={()=>nav("rentals",{})} />
        <StatTile emoji="💰" label="This Month" value={fmt(monthIncome)} sub="Rental income" bars={barsFrom(last6)} gradient="from-amber-400 to-orange-500" onClick={()=>nav("finance",{})} />
        <StatTile emoji={alerts.length?"🔔":"✅"} label="Alerts" value={alerts.length||"All clear!"} sub={alerts.length?alerts[0].text:"Looking great 💪"} bars={barsFrom([alerts.filter(a=>a.type==="error").length||0,alerts.filter(a=>a.type==="warn").length||0,1])} gradient={alerts.length?"from-rose-400 to-pink-500":"from-emerald-400 to-teal-500"} onClick={()=>nav("renewals",{})} />
      </div>
      <div className="px-4 mt-4">
        <SCard title="✨ Quick Actions">
          <div className="grid grid-cols-3 gap-3">
            {[{em:"🚗",label:"Add Car",fn:()=>nav("car-form",{}),bg:"bg-violet-50"},{em:"🔑",label:"New Rental",fn:()=>nav("rental-form",{}),bg:"bg-blue-50"},{em:"🔔",label:"Renewals",fn:()=>nav("renewals",{}),bg:"bg-amber-50"},{em:"💵",label:"Add Expense",fn:()=>nav("expense-form",{}),bg:"bg-emerald-50"},{em:"🚨",label:"Accident",fn:()=>nav("accidents",{}),bg:"bg-rose-50"},{em:"🌐",label:"Website",fn:()=>nav("website",{}),bg:"bg-indigo-50"}].map(({em,label,fn,bg})=>(
              <button key={label} onClick={fn} className={`flex flex-col items-center gap-2 p-3 ${bg} rounded-2xl active:scale-95 transition-transform`}>
                <span className="text-2xl">{em}</span><span className="text-[11px] font-black text-gray-600 text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </SCard>
      </div>
      {alerts.length>0&&<div className="px-4 mt-3"><SCard title="⚠️ Needs Attention"><div className="space-y-2">{alerts.map((a,i)=><div key={i} className={`flex items-start gap-2.5 p-3 rounded-2xl text-sm font-semibold ${a.type==="error"?"bg-rose-50 text-rose-700":"bg-amber-50 text-amber-700"}`}><span className="text-base flex-shrink-0">{a.type==="error"?"🚨":"⚠️"}</span><span>{a.text}</span></div>)}</div></SCard></div>}
      {activeSorted.length>0&&<div className="px-4 mt-3"><SCard title="🔑 Active Rentals">{activeSorted.map(r=>{ const car=s.cars.find(c=>c.id===r.carId); const photo=s.media.find(m=>m.ownerType==="car"&&m.ownerId===r.carId&&m.category==="exterior"); const dd=daysUntil(r.endDate); return <button key={r.id} onClick={()=>nav("rental-detail",{id:r.id})} className="w-full flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 active:bg-gray-50 rounded-2xl px-1"><CarThumb mediaId={photo?.id} size="w-11 h-11" iconSize={16} rounded="rounded-xl"/><div className="text-left flex-1 min-w-0"><div className="font-black text-sm text-gray-800 truncate">{r.customerName}</div><div className="text-xs text-gray-400 truncate">{car?.nickname} · {car?.plateNumber}</div></div><div className="text-right flex-shrink-0"><div className={`text-xs font-black ${dd<0?"text-rose-600":dd<=2?"text-amber-500":"text-gray-400"}`}>{dd<0?`${Math.abs(dd)}d overdue 🚨`:dd===0?"Today! ⚡":`${dd}d left`}</div><div className="text-xs text-gray-400">{fmt(r.paymentReceived||0)}</div></div></button> })}</SCard></div>}
    </div>
  )
}

// ════════════ CARS ════════════
function CarsScreen({ nav }) {
  const { s } = useStore(); const [q,setQ]=useState(""); const [f,setF]=useState("all")
  const list = useMemo(()=>{ let c=s.cars; if(q)c=c.filter(x=>`${x.nickname} ${x.brand} ${x.plateNumber}`.toLowerCase().includes(q.toLowerCase())); if(f!=="all")c=c.filter(x=>x.status===f); return c },[s.cars,q,f])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pb-28">
      <Header title="🚗 My Fleet" action={<Btn onClick={()=>nav("car-form",{})} size="sm" className="flex items-center gap-1"><Plus size={13}/>Add</Btn>}/>
      <div className="px-4 py-3 space-y-3">
        <div className="relative"><Search size={15} className="absolute left-3.5 top-3.5 text-gray-300"/><Inp value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" className="pl-10"/></div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scroll">{[["all","All 🚗"],["available","✅ Available"],["rented","🔑 Rented"],["maintenance","🔧 Workshop"],["accident","🚨 Accident"],["sold","📦 Sold"]].map(([v,l])=><button key={v} onClick={()=>setF(v)} className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap flex-shrink-0 transition-all ${f===v?"bg-violet-600 text-white shadow-sm":"bg-white text-gray-400 border border-gray-200"}`}>{l}</button>)}</div>
        {list.length===0&&<div className="text-center py-16"><div className="text-5xl mb-3">🚗</div><p className="font-black text-gray-400">No cars found</p></div>}
        {list.map(car=><CarCard key={car.id} car={car} onClick={()=>nav("car-detail",{id:car.id})}/>)}
      </div>
    </div>
  )
}
function CarCard({ car, onClick }) {
  const { s } = useStore(); const photo=s.media.find(m=>m.ownerType==="car"&&m.ownerId===car.id&&m.category==="exterior"); const activeRent=s.rentals.find(r=>r.carId===car.id&&r.status==="active"); const oilKm=(car.nextOilChangeMileage||0)-(car.currentMileage||0); const accent=STATUS_ACCENT[car.status]||"from-gray-300 to-gray-400"
  return (
    <button onClick={onClick} className="w-full bg-white rounded-3xl shadow-sm overflow-hidden text-left active:scale-[0.98] transition-transform mb-3">
      <div className={`h-1.5 bg-gradient-to-r ${accent}`}/>
      <div className="p-4">
        <div className="flex gap-3 mb-3">
          <CarThumb mediaId={photo?.id} size="w-14 h-14" iconSize={22}/>
          <div className="flex-1 min-w-0 flex justify-between items-start gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5"><span className="font-black text-gray-900 text-base truncate">{car.nickname}</span>{car.published&&<span className="text-[9px] bg-emerald-100 text-emerald-600 font-black px-1.5 py-0.5 rounded-full">🌐 Live</span>}</div>
              <div className="text-xs text-gray-400 mt-0.5">{car.brand} {car.model} · {car.year}</div>
            </div>
            <Badge status={car.status} map={CAR_STATUS}/>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-0 text-xs bg-gray-50 rounded-2xl overflow-hidden">
          <div className="text-center p-2.5"><div className="text-gray-400 text-[10px] font-black mb-0.5">PLATE</div><div className="font-black text-gray-700">{car.plateNumber}</div></div>
          <div className="text-center p-2.5 border-x border-gray-100"><div className="text-gray-400 text-[10px] font-black mb-0.5">KM</div><div className="font-black text-gray-700">{(car.currentMileage||0).toLocaleString()}</div></div>
          <div className="text-center p-2.5"><div className="text-gray-400 text-[10px] font-black mb-0.5">DAILY</div><div className="font-black text-emerald-600">{car.dailyRate?`${car.dailyRate} QAR`:"—"}</div></div>
        </div>
        {activeRent&&<div className="mt-2.5 flex justify-between items-center text-xs bg-violet-50 rounded-xl px-3 py-2"><span className="text-violet-600 font-black">🔑 {activeRent.customerName}</span><span className={`font-black ${daysUntil(activeRent.endDate)<0?"text-rose-500":"text-violet-400"}`}>{daysUntil(activeRent.endDate)<0?"⚠️ Overdue":`Due ${fmtD(activeRent.endDate)}`}</span></div>}
      </div>
    </button>
  )
}

// ════════════ CAR DETAIL ════════════
function CarDetail({ carId, nav }) {
  const { s, d } = useStore(); const [tab,setTab]=useState("info"); const [confirmDel,setConfirmDel]=useState(false)
  const car=s.cars.find(c=>c.id===carId); if(!car) return null
  const carRentals=s.rentals.filter(r=>r.carId===carId); const carExp=s.expenses.filter(e=>e.carId===carId); const carAcc=s.accidents.filter(a=>a.carId===carId)
  const totalIncome=carRentals.reduce((a,r)=>a+(r.paymentReceived||0),0); const totalExp=carExp.reduce((a,e)=>a+(e.amount||0),0); const oilKm=(car.nextOilChangeMileage||0)-(car.currentMileage||0)
  const renewals=[["Registration",car.registrationExpiry],["Insurance",car.insuranceExpiry],["Inspection",car.inspectionExpiry],["Road Permit",car.roadPermitExpiry],["Warranty",car.warrantyExpiry]].filter(([,dt])=>dt)
  const heroPhoto=s.media.find(m=>m.ownerType==="car"&&m.ownerId===carId&&m.category==="exterior"); const accent=STATUS_ACCENT[car.status]||"from-gray-300 to-gray-400"
  const delCar=async()=>{ const rel=s.media.filter(m=>m.ownerType==="car"&&m.ownerId===carId); await Promise.all(rel.map(m=>deleteMedia(m.id))); d({t:"DEL_CAR",p:carId}); nav("cars",{}) }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50/30 pb-28">
      <Header title={car.nickname} onBack={()=>nav("cars",{})} action={<div className="flex gap-1"><button onClick={()=>nav("car-form",{id:carId})} className="p-2 active:bg-gray-100 rounded-2xl"><Edit size={17} className="text-gray-500"/></button><button onClick={()=>setConfirmDel(true)} className="p-2 active:bg-gray-100 rounded-2xl"><Trash2 size={17} className="text-rose-400"/></button></div>}/>
      <div className={`bg-gradient-to-br ${accent} text-white px-5 py-5`}>
        <div className="flex gap-3 items-start mb-4"><CarThumb mediaId={heroPhoto?.id} size="w-16 h-16" iconSize={28} rounded="rounded-2xl"/><div className="flex-1 min-w-0"><div className="text-lg font-black">{car.brand} {car.model} {car.year}</div><div className="text-white/70 text-sm">🔖 {car.plateNumber} · {car.color}</div><div className="flex items-center gap-2 mt-1"><Badge status={car.status} map={CAR_STATUS}/>{car.published&&<span className="text-[10px] bg-white/20 text-white font-black px-2 py-0.5 rounded-full">🌐 On Website</span>}</div></div></div>
        <div className="grid grid-cols-3 gap-3 text-center bg-white/10 rounded-2xl p-3"><div><div className="text-lg font-black">{(car.currentMileage||0).toLocaleString()}</div><div className="text-xs text-white/60">km</div></div><div className="border-x border-white/20"><div className="text-lg font-black">{fmt(totalIncome)}</div><div className="text-xs text-white/60">income</div></div><div><div className="text-lg font-black">{carRentals.length}</div><div className="text-xs text-white/60">rentals</div></div></div>
      </div>
      <div className="bg-white border-b border-gray-100 flex overflow-x-auto no-scroll">{[["info","ℹ️ Info"],["web","🌐 Website"],["photos","📷 Photos"],["rentals","🔑 Rentals"],["docs","📋 Docs"],["finance","💰 Finance"]].map(([v,l])=><button key={v} onClick={()=>setTab(v)} className={`px-4 py-3 text-xs font-black whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${tab===v?"border-violet-500 text-violet-600":"border-transparent text-gray-400"}`}>{l}</button>)}</div>
      <div className="px-4 py-4 space-y-3">
        {tab==="info"&&<><SCard title="🚗 Vehicle Info">{[["Brand",car.brand],["Model",car.model],["Year",car.year],["Color",car.color],["VIN",car.vin],["Purchase Date",fmtD(car.purchaseDate)],["Purchase Price",fmt(car.purchasePrice)],["Est. Value",fmt(car.estimatedValue)]].map(([l,v])=><InfoRow key={l} label={l} value={v}/>)}</SCard><SCard title="🛢️ Oil Change"><InfoRow label="Current KM" value={`${(car.currentMileage||0).toLocaleString()} km`}/><InfoRow label="Last Change" value={fmtD(car.lastOilChangeDate)}/><InfoRow label="Next at" value={`${(car.nextOilChangeMileage||0).toLocaleString()} km`}/><InfoRow label="Remaining" value={oilKm<=0?"🚨 OVERDUE!":oilKm<=500?`⚠️ ${oilKm} km`:`✅ ${oilKm.toLocaleString()} km`} danger={oilKm<=0}/><InfoRow label="Oil Type" value={car.oilType}/><InfoRow label="Garage" value={car.garage}/></SCard><Btn onClick={()=>nav("car-form",{id:carId})} v="outline" className="w-full flex items-center justify-center gap-2"><Edit size={15}/>Edit Car Details</Btn></>}
        {tab==="web"&&<><SCard title="🌐 Website Settings">
          <div className={`flex items-center justify-between p-3 rounded-2xl mb-4 ${car.published?"bg-emerald-50":"bg-gray-50"}`}>
            <div><div className="font-black text-sm text-gray-800">{car.published?"🌐 Published":"⚪ Hidden"}</div><div className="text-xs text-gray-500">{car.published?"Visible to customers":"Not shown on website"}</div></div>
            <button onClick={()=>d({t:"UPD_CAR",p:{...car,published:!car.published}})} className={`w-12 h-6 rounded-full transition-colors relative ${car.published?"bg-emerald-500":"bg-gray-300"}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${car.published?"left-7":"left-1"}`}/></button>
          </div>
          <InfoRow label="Daily Rate" value={car.dailyRate?`QAR ${car.dailyRate}`:"Not set"}/>
          <InfoRow label="Weekly Rate" value={car.weeklyRate?`QAR ${car.weeklyRate}`:"Not set"}/>
          <InfoRow label="Monthly Rate" value={car.monthlyRate?`QAR ${car.monthlyRate}`:"Not set"}/>
          {car.features?.length>0&&<div className="py-2.5 border-b border-gray-50"><div className="flex justify-between items-start gap-2"><span className="text-xs text-gray-400">Features</span><div className="flex flex-wrap gap-1 justify-end max-w-[70%]">{car.features.map(f=><span key={f} className="text-[10px] bg-violet-50 text-violet-600 font-semibold px-2 py-0.5 rounded-full">{f}</span>)}</div></div></div>}
          {car.publicDescription&&<div className="py-2.5"><span className="text-xs text-gray-400">Description</span><p className="text-sm text-gray-700 mt-1">{car.publicDescription}</p></div>}
        </SCard>
        <Btn onClick={()=>nav("car-form",{id:carId,tab:"web"})} v="outline" className="w-full flex items-center justify-center gap-2"><Edit size={15}/>Edit Website Settings</Btn></>}
        {tab==="photos"&&<SCard title="📷 Car Photos"><MediaSection title="Exterior Photos" ownerType="car" ownerId={carId} category="exterior"/><MediaSection title="Interior Photos" ownerType="car" ownerId={carId} category="interior"/></SCard>}
        {tab==="rentals"&&<><Btn onClick={()=>nav("rental-form",{carId})} className="w-full flex items-center justify-center gap-2"><Plus size={15}/>🔑 New Rental</Btn>{carRentals.length===0&&<div className="text-center py-10"><div className="text-4xl mb-2">📋</div><p className="font-black text-gray-300">No rentals yet</p></div>}{carRentals.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map(r=><button key={r.id} onClick={()=>nav("rental-detail",{id:r.id})} className="w-full bg-white rounded-3xl p-4 shadow-sm text-left active:scale-[0.98] mb-2"><div className="flex justify-between items-start"><div><div className="font-bold text-gray-800">{r.customerName}</div><div className="text-xs text-gray-400">{fmtD(r.startDate)} → {fmtD(r.endDate)}</div></div><Badge status={r.status} map={RENT_STATUS}/></div><div className="flex justify-between text-xs text-gray-400 mt-2"><span>{fmt(r.rateAmount)}/{r.rateType}</span><span>💰 {fmt(r.paymentReceived||0)}</span></div></button>)}</>}
        {tab==="docs"&&<><SCard title="📅 Document Expiry">{renewals.map(([l,dt],i)=>{ const dd=daysUntil(dt); return <div key={i} className={`flex justify-between items-center p-3 rounded-2xl mb-2 last:mb-0 ${dd<0?"bg-rose-50":dd<=7?"bg-orange-50":dd<=30?"bg-amber-50":"bg-emerald-50"}`}><div className="text-sm font-bold text-gray-700">{l}</div><div className="text-right"><div className={`text-xs font-black ${dd<0?"text-rose-600":dd<=7?"text-orange-600":dd<=30?"text-amber-600":"text-emerald-600"}`}>{dd<0?`🚨 Expired ${Math.abs(dd)}d ago`:dd===0?"⚡ Today!":dd<=30?`⚠️ ${dd}d left`:"✅ OK"}</div><div className="text-xs text-gray-400">{fmtD(dt)}</div></div></div> })}{renewals.length===0&&<p className="text-sm text-gray-300 text-center py-4">No expiry dates set</p>}</SCard><SCard title="📎 Document Copies">{DOC_CATS.map(([cat,label])=><MediaSection key={cat} title={label} ownerType="car" ownerId={carId} category={cat} single/>)}</SCard></>}
        {tab==="finance"&&<><div className="grid grid-cols-3 gap-2"><div className="bg-emerald-50 rounded-2xl p-3 text-center"><div className="text-base font-black text-emerald-700">{fmt(totalIncome)}</div><div className="text-xs text-emerald-500">💰 Income</div></div><div className="bg-rose-50 rounded-2xl p-3 text-center"><div className="text-base font-black text-rose-600">{fmt(totalExp)}</div><div className="text-xs text-rose-400">💸 Expenses</div></div><div className={`${totalIncome-totalExp>=0?"bg-violet-50":"bg-amber-50"} rounded-2xl p-3 text-center`}><div className={`text-base font-black ${totalIncome-totalExp>=0?"text-violet-700":"text-amber-700"}`}>{fmt(totalIncome-totalExp)}</div><div className="text-xs text-gray-400">📈 Net</div></div></div><Btn onClick={()=>nav("expense-form",{carId})} v="outline" className="w-full flex items-center justify-center gap-2 mt-2"><Plus size={15}/>Add Expense</Btn>{carExp.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(e=><div key={e.id} className="bg-white rounded-2xl p-3 shadow-sm flex justify-between items-center mt-2"><div><div className="text-sm font-bold text-gray-700 capitalize">{e.type}</div><div className="text-xs text-gray-400">{e.description} · {fmtD(e.date)}</div></div><span className="text-rose-600 font-black text-sm">{fmt(e.amount)}</span></div>)}</>}
      </div>
      {confirmDel&&<Confirm msg={`Delete ${car.nickname}? All records and photos go too 😢`} onOk={delCar} onCancel={()=>setConfirmDel(false)}/>}
    </div>
  )
}

// ════════════ CAR FORM ════════════
function CarForm({ carId, initialTab, nav }) {
  const { s, d } = useStore(); const existing=carId?s.cars.find(c=>c.id===carId):null; const [tab,setTab]=useState(initialTab||"basic")
  const [form,setForm]=useState(existing||{id:uid(),nickname:"",brand:"",model:"",year:new Date().getFullYear(),plateNumber:"",color:"",vin:"",currentMileage:"",status:"available",purchaseDate:"",purchasePrice:"",estimatedValue:"",notes:"",registrationExpiry:"",insuranceExpiry:"",inspectionExpiry:"",roadPermitExpiry:"",warrantyExpiry:"",lastOilChangeMileage:"",nextOilChangeMileage:"",lastOilChangeDate:"",oilType:"5W-30",garage:"",oilChangeCost:"",published:false,dailyRate:"",weeklyRate:"",monthlyRate:"",features:[],publicDescription:"",publicPhotoUrl:"",createdAt:new Date().toISOString()})
  const set=(k,v)=>setForm(f=>({...f,[k]:v}))
  const toggleFeature=(f)=>setForm(fm=>({...fm,features:fm.features?.includes(f)?fm.features.filter(x=>x!==f):[...(fm.features||[]),f]}))
  const save=()=>{ if(!form.nickname||!form.brand){alert("Please enter car name and brand");return}; const p={...form,year:+form.year||2020,currentMileage:+form.currentMileage||0,purchasePrice:+form.purchasePrice||0,estimatedValue:+form.estimatedValue||0,lastOilChangeMileage:+form.lastOilChangeMileage||0,nextOilChangeMileage:+form.nextOilChangeMileage||5000,oilChangeCost:+form.oilChangeCost||0,dailyRate:+form.dailyRate||0,weeklyRate:+form.weeklyRate||0,monthlyRate:+form.monthlyRate||0}; d({t:existing?"UPD_CAR":"ADD_CAR",p}); nav("car-detail",{id:p.id}) }
  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Header title={existing?"✏️ Edit Car":"🚗 Add Car"} onBack={()=>nav(existing?"car-detail":"cars",existing?{id:carId}:{})}/>
      <div className="bg-white border-b border-gray-100 flex overflow-x-auto no-scroll">{[["basic","🚗 Basic"],["website","🌐 Website"],["docs","📅 Docs"],["oil","🛢️ Oil"]].map(([v,l])=><button key={v} onClick={()=>setTab(v)} className={`px-4 py-3 text-xs font-black whitespace-nowrap border-b-2 flex-shrink-0 ${tab===v?"border-violet-500 text-violet-600":"border-transparent text-gray-400"}`}>{l}</button>)}</div>
      <div className="px-4 py-4 space-y-4">
        {tab==="basic"&&<><SCard title="🚗 Basic Info"><Fld label="Nickname *"><Inp value={form.nickname} onChange={e=>set("nickname",e.target.value)} placeholder="Farida, Black MG…"/></Fld><Fld label="Brand *"><Inp value={form.brand} onChange={e=>set("brand",e.target.value)} placeholder="FORD, MG, CHERY…"/></Fld><div className="grid grid-cols-2 gap-3"><Fld label="Model"><Inp value={form.model} onChange={e=>set("model",e.target.value)}/></Fld><Fld label="Year"><Inp type="number" value={form.year} onChange={e=>set("year",e.target.value)}/></Fld></div><div className="grid grid-cols-2 gap-3"><Fld label="Plate"><Inp value={form.plateNumber} onChange={e=>set("plateNumber",e.target.value)}/></Fld><Fld label="Color"><Inp value={form.color} onChange={e=>set("color",e.target.value)}/></Fld></div><Fld label="VIN"><Inp value={form.vin} onChange={e=>set("vin",e.target.value)}/></Fld><Fld label="Status"><Sel value={form.status} onChange={e=>set("status",e.target.value)}>{Object.entries(CAR_STATUS).map(([v,{label,emoji}])=><option key={v} value={v}>{emoji} {label}</option>)}</Sel></Fld></SCard>
        <SCard title="📊 Mileage & Value"><Fld label="Current Mileage (km)"><Inp type="number" value={form.currentMileage} onChange={e=>set("currentMileage",e.target.value)}/></Fld><div className="grid grid-cols-2 gap-3"><Fld label="Purchase Date"><Inp type="date" value={form.purchaseDate} onChange={e=>set("purchaseDate",e.target.value)}/></Fld><Fld label="Purchase Price (QAR)"><Inp type="number" value={form.purchasePrice} onChange={e=>set("purchasePrice",e.target.value)}/></Fld></div><Fld label="Estimated Value (QAR)"><Inp type="number" value={form.estimatedValue} onChange={e=>set("estimatedValue",e.target.value)}/></Fld></SCard>
        <SCard title="📝 Notes"><Txa value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Any notes…"/></SCard></>}
        {tab==="website"&&<><SCard title="🌐 Website Listing">
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-2xl">
            <div><div className="font-black text-sm text-gray-800">Show on Public Website</div><div className="text-xs text-gray-500">{form.published?"Customers can see this car":"Hidden from website"}</div></div>
            <button onClick={()=>set("published",!form.published)} className={`w-12 h-6 rounded-full transition-colors relative ${form.published?"bg-emerald-500":"bg-gray-300"}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.published?"left-7":"left-1"}`}/></button>
          </div>
          <div className="grid grid-cols-3 gap-3"><Fld label="Daily Rate (QAR)"><Inp type="number" value={form.dailyRate} onChange={e=>set("dailyRate",e.target.value)} placeholder="150"/></Fld><Fld label="Weekly Rate"><Inp type="number" value={form.weeklyRate} onChange={e=>set("weeklyRate",e.target.value)} placeholder="900"/></Fld><Fld label="Monthly Rate"><Inp type="number" value={form.monthlyRate} onChange={e=>set("monthlyRate",e.target.value)} placeholder="3000"/></Fld></div>
          <Fld label="Photo URL (for website)"><Inp value={form.publicPhotoUrl} onChange={e=>set("publicPhotoUrl",e.target.value)} placeholder="https://… (paste any image URL)"/></Fld>
          <Fld label="Public Description"><Txa value={form.publicDescription} onChange={e=>set("publicDescription",e.target.value)} placeholder="Describe this car for customers…" rows={2}/></Fld>
          <Fld label="Car Features">
            <div className="flex flex-wrap gap-2">{CAR_FEATURES_LIST.map(f=><button key={f} type="button" onClick={()=>toggleFeature(f)} className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${(form.features||[]).includes(f)?"bg-violet-600 text-white shadow-sm":"bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{f}</button>)}</div>
          </Fld>
        </SCard></>}
        {tab==="docs"&&<SCard title="📅 Document Expiry"><div className="grid grid-cols-2 gap-3"><Fld label="Registration"><Inp type="date" value={form.registrationExpiry} onChange={e=>set("registrationExpiry",e.target.value)}/></Fld><Fld label="Insurance"><Inp type="date" value={form.insuranceExpiry} onChange={e=>set("insuranceExpiry",e.target.value)}/></Fld><Fld label="Inspection"><Inp type="date" value={form.inspectionExpiry} onChange={e=>set("inspectionExpiry",e.target.value)}/></Fld><Fld label="Road Permit"><Inp type="date" value={form.roadPermitExpiry} onChange={e=>set("roadPermitExpiry",e.target.value)}/></Fld><Fld label="Warranty"><Inp type="date" value={form.warrantyExpiry} onChange={e=>set("warrantyExpiry",e.target.value)}/></Fld></div></SCard>}
        {tab==="oil"&&<SCard title="🛢️ Oil Change"><div className="grid grid-cols-2 gap-3"><Fld label="Last KM"><Inp type="number" value={form.lastOilChangeMileage} onChange={e=>set("lastOilChangeMileage",e.target.value)}/></Fld><Fld label="Next KM"><Inp type="number" value={form.nextOilChangeMileage} onChange={e=>set("nextOilChangeMileage",e.target.value)}/></Fld><Fld label="Last Date"><Inp type="date" value={form.lastOilChangeDate} onChange={e=>set("lastOilChangeDate",e.target.value)}/></Fld><Fld label="Cost (QAR)"><Inp type="number" value={form.oilChangeCost} onChange={e=>set("oilChangeCost",e.target.value)}/></Fld></div><Fld label="Oil Type"><Inp value={form.oilType} onChange={e=>set("oilType",e.target.value)}/></Fld><Fld label="Garage"><Inp value={form.garage} onChange={e=>set("garage",e.target.value)}/></Fld></SCard>}
        <Btn onClick={save} size="lg" className="w-full">{existing?"💾 Save Changes":"🚗 Add Car"}</Btn>
      </div>
    </div>
  )
}

// ════════════ RENTALS ════════════
function RentalsScreen({ nav }) {
  const { s } = useStore(); const [f,setF]=useState("active"); const [q,setQ]=useState("")
  const list=useMemo(()=>{ let r=s.rentals; if(f!=="all")r=r.filter(x=>x.status===f); if(q)r=r.filter(x=>x.customerName.toLowerCase().includes(q.toLowerCase())); return r.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)) },[s.rentals,f,q])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 pb-28">
      <Header title="🔑 Rentals" action={<Btn onClick={()=>nav("rental-form",{})} size="sm" className="flex items-center gap-1"><Plus size={13}/>New</Btn>}/>
      <div className="px-4 py-3 space-y-3">
        <div className="relative"><Search size={15} className="absolute left-3.5 top-3.5 text-gray-300"/><Inp value={q} onChange={e=>setQ(e.target.value)} placeholder="Search customer…" className="pl-10"/></div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scroll">{[["all","All"],["active","🔵 Active"],["completed","✅ Done"],["late","⚠️ Late"],["cancelled","❌ Cancelled"]].map(([v,l])=><button key={v} onClick={()=>setF(v)} className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap flex-shrink-0 transition-all ${f===v?"bg-violet-600 text-white shadow-sm":"bg-white text-gray-400 border border-gray-200"}`}>{l}</button>)}</div>
        {list.length===0&&<div className="text-center py-16"><div className="text-5xl mb-3">📋</div><p className="font-black text-gray-400">No rentals</p></div>}
        {list.map(r=>{ const car=s.cars.find(c=>c.id===r.carId); const photo=s.media.find(m=>m.ownerType==="car"&&m.ownerId===r.carId&&m.category==="exterior"); const dur=calcDur(r.startDate,r.endDate); const total=r.rateAmount*dur; const dd=daysUntil(r.endDate); const isLate=r.status==="active"&&dd<0; return (
          <button key={r.id} onClick={()=>nav("rental-detail",{id:r.id})} className="w-full bg-white rounded-3xl p-4 shadow-sm text-left active:scale-[0.98] transition-transform mb-3">
            <div className="flex items-start gap-3 mb-3"><CarThumb mediaId={photo?.id} size="w-11 h-11" iconSize={16} rounded="rounded-xl"/><div className="flex-1 min-w-0 flex justify-between items-start gap-2"><div className="min-w-0"><div className="font-black text-gray-900 truncate">{r.customerName}</div><div className="text-xs text-gray-400 truncate">{car?.nickname} · {car?.plateNumber}</div></div><Badge status={r.status} map={RENT_STATUS}/></div></div>
            <div className="grid grid-cols-3 gap-0 text-xs bg-gray-50 rounded-2xl overflow-hidden"><div className="p-2.5 text-center"><div className="text-gray-400 text-[10px] font-black mb-0.5">START</div><div className="font-bold text-gray-700">{fmtD(r.startDate)}</div></div><div className="p-2.5 text-center border-x border-gray-100"><div className="text-gray-400 text-[10px] font-black mb-0.5">END</div><div className={`font-bold ${isLate?"text-rose-600":"text-gray-700"}`}>{fmtD(r.endDate)}</div></div><div className="p-2.5 text-center"><div className="text-gray-400 text-[10px] font-black mb-0.5">TOTAL</div><div className="font-bold text-gray-700">{fmt(total)}</div></div></div>
            {isLate&&<div className="mt-2 text-xs text-rose-500 flex items-center gap-1 font-black bg-rose-50 rounded-xl px-3 py-2"><AlertCircle size={12}/>🚨 {Math.abs(dd)} days overdue!</div>}
          </button>
        )})}
      </div>
    </div>
  )
}

// ════════════ RENTAL FORM ════════════
function RentalForm({ rentalId, preCarId, nav }) {
  const { s, d } = useStore(); const existing=rentalId?s.rentals.find(r=>r.id===rentalId):null
  const [form,setForm]=useState(existing||{id:uid(),carId:preCarId||"",customerName:"",customerPhone:"",customerIdNumber:"",startDate:today(),endDate:"",actualReturnDate:null,rateType:"daily",rateAmount:"",deposit:"",paymentReceived:"",startMileage:"",endMileage:null,fuelOut:80,fuelIn:null,conditionOut:"",conditionIn:"",status:"active",notes:"",createdAt:new Date().toISOString()})
  const set=(k,v)=>setForm(f=>({...f,[k]:v})); const dur=calcDur(form.startDate,form.endDate); const total=(+form.rateAmount||0)*dur; const paid=+form.paymentReceived||0
  const save=()=>{ if(!form.carId||!form.customerName||!form.startDate){alert("Please fill in Car, Customer Name, and Start Date");return}; const p={...form,rateAmount:+form.rateAmount||0,deposit:+form.deposit||0,paymentReceived:+form.paymentReceived||0,startMileage:+form.startMileage||0}; d({t:existing?"UPD_RENT":"ADD_RENT",p}); if(!existing&&p.carId){const car=s.cars.find(c=>c.id===p.carId);if(car)d({t:"UPD_CAR",p:{...car,status:"rented",currentMileage:p.startMileage||car.currentMileage}})}; nav("rental-detail",{id:p.id}) }
  const availCars=s.cars.filter(c=>c.status==="available"||c.id===form.carId)
  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Header title={existing?"✏️ Edit Rental":"🔑 New Rental"} onBack={()=>nav("rentals",{})}/>
      <div className="px-4 py-4 space-y-4">
        <SCard title="🚗 Car & Period"><Fld label="Select Car *"><Sel value={form.carId} onChange={e=>set("carId",e.target.value)}><option value="">— Pick a Car —</option>{(existing?s.cars:availCars).map(c=><option key={c.id} value={c.id}>{CAR_STATUS[c.status]?.emoji} {c.nickname} ({c.plateNumber})</option>)}</Sel></Fld><div className="grid grid-cols-2 gap-3"><Fld label="Start Date *"><Inp type="date" value={form.startDate} onChange={e=>set("startDate",e.target.value)}/></Fld><Fld label="End Date"><Inp type="date" value={form.endDate} onChange={e=>set("endDate",e.target.value)}/></Fld></div><Fld label="Status"><Sel value={form.status} onChange={e=>set("status",e.target.value)}>{Object.entries(RENT_STATUS).map(([v,{label}])=><option key={v} value={v}>{label}</option>)}</Sel></Fld></SCard>
        <SCard title="👤 Customer"><Fld label="Customer Name *"><Inp value={form.customerName} onChange={e=>set("customerName",e.target.value)} placeholder="Full name"/></Fld><div className="grid grid-cols-2 gap-3"><Fld label="Phone"><Inp type="tel" value={form.customerPhone} onChange={e=>set("customerPhone",e.target.value)} placeholder="+974…"/></Fld><Fld label="ID / License No."><Inp value={form.customerIdNumber} onChange={e=>set("customerIdNumber",e.target.value)}/></Fld></div></SCard>
        <SCard title="💰 Payment"><div className="grid grid-cols-2 gap-3"><Fld label="Rate Type"><Sel value={form.rateType} onChange={e=>set("rateType",e.target.value)}><option value="daily">📅 Daily</option><option value="weekly">📆 Weekly</option><option value="monthly">🗓️ Monthly</option></Sel></Fld><Fld label="Rate (QAR)"><Inp type="number" value={form.rateAmount} onChange={e=>set("rateAmount",e.target.value)}/></Fld></div><div className="grid grid-cols-2 gap-3"><Fld label="Deposit"><Inp type="number" value={form.deposit} onChange={e=>set("deposit",e.target.value)}/></Fld><Fld label="Paid (QAR)"><Inp type="number" value={form.paymentReceived} onChange={e=>set("paymentReceived",e.target.value)}/></Fld></div>
          {form.startDate&&form.endDate&&<div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-4 space-y-2 mt-1 border border-violet-100"><div className="flex justify-between text-sm"><span className="text-gray-500">Duration</span><span className="font-black text-gray-700">{dur} days</span></div><div className="flex justify-between text-sm"><span className="text-gray-500">Total</span><span className="font-black text-violet-700">{fmt(total)}</span></div><div className="flex justify-between text-sm"><span className="text-gray-500">Paid</span><span className="font-black text-emerald-600">💰 {fmt(paid)}</span></div><div className="flex justify-between text-sm border-t border-violet-100 pt-2"><span className="text-gray-500">Balance</span><span className={`font-black ${total-paid>0?"text-rose-600":"text-emerald-600"}`}>{total-paid>0?`💸 ${fmt(total-paid)}`:"✅ All paid!"}</span></div></div>}
        </SCard>
        <SCard title="🚗 Checkout Condition"><Fld label="Start Mileage (km)"><Inp type="number" value={form.startMileage} onChange={e=>set("startMileage",e.target.value)}/></Fld><Fld label={`⛽ Fuel Level: ${form.fuelOut}%`}><input type="range" min={0} max={100} step={10} value={form.fuelOut} onChange={e=>set("fuelOut",+e.target.value)} className="w-full accent-violet-500"/></Fld><Fld label="Condition Notes"><Txa value={form.conditionOut} onChange={e=>set("conditionOut",e.target.value)} placeholder="Any scratches, damage notes…"/></Fld></SCard>
        <SCard title="📝 Notes"><Txa value={form.notes} onChange={e=>set("notes",e.target.value)}/></SCard>
        <Btn onClick={save} size="lg" className="w-full">{existing?"💾 Save Changes":"🚗 Check Out Car"}</Btn>
      </div>
    </div>
  )
}

// ════════════ RENTAL DETAIL ════════════
function RentalDetail({ rentalId, nav }) {
  const { s, d } = useStore(); const [confirmDel,setConfirmDel]=useState(false); const [showCheckin,setShowCheckin]=useState(false)
  const rental=s.rentals.find(r=>r.id===rentalId); if(!rental) return null
  const car=s.cars.find(c=>c.id===rental.carId); const dur=calcDur(rental.startDate,rental.endDate); const total=rental.rateAmount*dur; const paid=rental.paymentReceived||0; const balance=total-paid; const dLeft=daysUntil(rental.endDate)
  const checkIn=data=>{ d({t:"UPD_RENT",p:{...rental,...data,status:"completed"}}); if(car)d({t:"UPD_CAR",p:{...car,status:"available",currentMileage:+data.endMileage||car.currentMileage}}); setShowCheckin(false) }
  const del=async()=>{ const rel=s.media.filter(m=>m.ownerType==="rental"&&m.ownerId===rentalId); await Promise.all(rel.map(m=>deleteMedia(m.id))); d({t:"DEL_RENT",p:rentalId}); if(car&&rental.status==="active")d({t:"UPD_CAR",p:{...car,status:"available"}}); nav("rentals",{}) }
  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Header title="🔑 Rental Details" onBack={()=>nav("rentals",{})} action={<div className="flex gap-1"><button onClick={()=>nav("rental-form",{rentalId})} className="p-2 active:bg-gray-100 rounded-2xl"><Edit size={17} className="text-gray-500"/></button><button onClick={()=>setConfirmDel(true)} className="p-2 active:bg-gray-100 rounded-2xl"><Trash2 size={17} className="text-rose-400"/></button></div>}/>
      <div className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white px-5 py-5">
        <div className="flex justify-between items-start mb-4"><div><div className="text-xl font-black">{rental.customerName}</div><div className="text-white/70 text-sm">{car?.nickname} · {car?.plateNumber}</div></div><Badge status={rental.status} map={RENT_STATUS}/></div>
        <div className="grid grid-cols-3 gap-3 text-center bg-white/10 rounded-2xl p-3"><div><div className="text-lg font-black">{fmt(total)}</div><div className="text-xs text-white/60">Total</div></div><div className="border-x border-white/20"><div className="text-lg font-black text-emerald-300">{fmt(paid)}</div><div className="text-xs text-white/60">Paid ✅</div></div><div><div className={`text-lg font-black ${balance>0?"text-rose-300":"text-emerald-300"}`}>{fmt(balance)}</div><div className="text-xs text-white/60">Balance</div></div></div>
        {rental.status==="active"&&<div className={`mt-3 text-center text-sm font-black ${dLeft<0?"text-rose-300":dLeft<=2?"text-amber-300":"text-white/70"}`}>{dLeft<0?`🚨 ${Math.abs(dLeft)} days OVERDUE!`:dLeft===0?"⚡ Returns TODAY!":dLeft<=2?`⚠️ ${dLeft} days left`:`${dLeft} days remaining 📅`}</div>}
      </div>
      <div className="px-4 py-4 space-y-3">
        <SCard title="📅 Rental Period"><InfoRow label="Start" value={fmtD(rental.startDate)}/><InfoRow label="End" value={fmtD(rental.endDate)}/><InfoRow label="Duration" value={`${dur} days`}/><InfoRow label="Rate" value={`${fmt(rental.rateAmount)} / ${rental.rateType}`}/><InfoRow label="Deposit" value={fmt(rental.deposit||0)}/>{rental.actualReturnDate&&<InfoRow label="Actual Return" value={fmtD(rental.actualReturnDate)}/>}</SCard>
        <SCard title="👤 Customer"><InfoRow label="Phone" value={rental.customerPhone}/><InfoRow label="ID / License" value={rental.customerIdNumber}/></SCard>
        <SCard title="📎 Documents & Photos"><MediaSection title="🪪 Driving License" ownerType="rental" ownerId={rentalId} category="license" single/><MediaSection title="🪪 Customer ID" ownerType="rental" ownerId={rentalId} category="id" single/><MediaSection title="📄 Signed Contract" ownerType="rental" ownerId={rentalId} category="contract" single/><MediaSection title="📷 Checkout Photos" ownerType="rental" ownerId={rentalId} category="checkout"/><MediaSection title="📷 Return Photos" ownerType="rental" ownerId={rentalId} category="checkin"/></SCard>
        <SCard title="🚗 Car Condition"><InfoRow label="Start KM" value={`${(rental.startMileage||0).toLocaleString()} km`}/>{rental.endMileage&&<><InfoRow label="Return KM" value={`${rental.endMileage.toLocaleString()} km`}/><InfoRow label="KM Used" value={`${(rental.endMileage-rental.startMileage).toLocaleString()} km`}/></>}<InfoRow label="⛽ Fuel Out" value={`${rental.fuelOut||0}%`}/>{rental.fuelIn!=null&&<InfoRow label="⛽ Fuel In" value={`${rental.fuelIn}%`}/>}{rental.conditionOut&&<InfoRow label="Condition Out" value={rental.conditionOut}/>}{rental.conditionIn&&<InfoRow label="Condition In" value={rental.conditionIn}/>}</SCard>
        {rental.notes&&<SCard title="📝 Notes"><p className="text-sm text-gray-600">{rental.notes}</p></SCard>}
        {rental.status==="active"&&<Btn onClick={()=>setShowCheckin(true)} v="success" size="lg" className="w-full flex items-center justify-center gap-2"><CheckCircle size={18}/>✅ Check In Car</Btn>}
      </div>
      {showCheckin&&<Modal title={`✅ Check In – ${car?.nickname}`} onClose={()=>setShowCheckin(false)} footer={<Btn onClick={()=>{ const data={actualReturnDate:today(),endMileage:"",fuelIn:80,conditionIn:""}; checkIn(data) }} v="success" className="w-full">✅ Quick Check In</Btn>}><p className="text-sm text-gray-500">Use the full form for detailed check-in:</p><Btn onClick={()=>{}} v="outline" className="w-full mt-2">Fill Details</Btn></Modal>}
      {confirmDel&&<Confirm msg={`Delete rental for ${rental.customerName}?`} onOk={del} onCancel={()=>setConfirmDel(false)}/>}
    </div>
  )
}

// ════════════ FINANCE ════════════
function FinanceScreen({ nav, openExpense, preCarId }) {
  const { s, d } = useStore(); const [carF,setCarF]=useState("all"); const [showForm,setShowForm]=useState(!!openExpense); const [editing,setEditing]=useState(null); const [confirmDel,setConfirmDel]=useState(null)
  const income=useMemo(()=>s.rentals.filter(r=>r.status!=="cancelled"&&(carF==="all"||r.carId===carF)).reduce((a,r)=>a+(r.paymentReceived||0),0),[s.rentals,carF])
  const expenses=useMemo(()=>s.expenses.filter(e=>carF==="all"||e.carId===carF).sort((a,b)=>new Date(b.date)-new Date(a.date)),[s.expenses,carF])
  const totalExp=expenses.reduce((a,e)=>a+(e.amount||0),0)
  const monthInc=useMemo(()=>{ const m=new Date().getMonth(),y=new Date().getFullYear(); return s.rentals.filter(r=>r.status!=="cancelled"&&(carF==="all"||r.carId===carF)&&new Date(r.startDate).getMonth()===m&&new Date(r.startDate).getFullYear()===y).reduce((a,r)=>a+(r.paymentReceived||0),0) },[s.rentals,carF])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30 pb-28">
      <Header title="💰 Finance" action={<Btn onClick={()=>{setEditing(null);setShowForm(true)}} size="sm" className="flex items-center gap-1"><Plus size={13}/>Expense</Btn>}/>
      <div className="px-4 py-3 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scroll">{[["all","All Cars 🚗"],...s.cars.map(c=>[c.id,c.nickname])].map(([v,l])=><button key={v} onClick={()=>setCarF(v)} className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap flex-shrink-0 transition-all ${carF===v?"bg-violet-600 text-white shadow-sm":"bg-white text-gray-400 border border-gray-200"}`}>{l}</button>)}</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-4 shadow-lg text-white"><div className="text-2xl mb-1">💰</div><div className="text-xl font-black">{fmt(income)}</div><div className="text-white/70 text-xs">Total Income</div></div>
          <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-3xl p-4 shadow-lg text-white"><div className="text-2xl mb-1">💸</div><div className="text-xl font-black">{fmt(totalExp)}</div><div className="text-white/70 text-xs">Total Expenses</div></div>
          <div className={`bg-gradient-to-br ${income-totalExp>=0?"from-violet-500 to-indigo-600":"from-amber-400 to-orange-500"} rounded-3xl p-4 shadow-lg text-white`}><div className="text-2xl mb-1">📈</div><div className="text-xl font-black">{fmt(income-totalExp)}</div><div className="text-white/70 text-xs">Net Profit</div></div>
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl p-4 shadow-lg text-white"><div className="text-2xl mb-1">📅</div><div className="text-xl font-black">{fmt(monthInc)}</div><div className="text-white/70 text-xs">This Month</div></div>
        </div>
        <SCard title="💸 Expense History">
          {expenses.length===0&&<div className="text-center py-8"><div className="text-3xl mb-2">🎉</div><p className="font-black text-gray-300 text-sm">No expenses yet!</p></div>}
          {expenses.map(exp=>{ const car=s.cars.find(c=>c.id===exp.carId); return <div key={exp.id} className="flex items-center py-3 border-b border-gray-50 last:border-0 gap-3"><div className="flex-1 min-w-0"><div className="text-sm font-black text-gray-800 capitalize">{exp.type}</div><div className="text-xs text-gray-400 truncate">{exp.description} · {car?.nickname} · {fmtD(exp.date)}</div></div><div className="text-sm font-black text-rose-600 flex-shrink-0">{fmt(exp.amount)}</div><div className="flex gap-1 flex-shrink-0"><button onClick={()=>{setEditing(exp);setShowForm(true)}} className="p-1.5 active:bg-gray-100 rounded-xl"><Edit size={14} className="text-gray-400"/></button><button onClick={()=>setConfirmDel(exp.id)} className="p-1.5 active:bg-gray-100 rounded-xl"><Trash2 size={14} className="text-rose-300"/></button></div></div> })}
        </SCard>
      </div>
      {showForm&&<Modal title={existing?"✏️ Edit Expense":"💸 Add Expense"} onClose={()=>{setShowForm(false);setEditing(null)}} footer={<Btn onClick={()=>{ if(!editing?.carId&&!preCarId){alert("Select a car");return} d({t:editing?"UPD_EXP":"ADD_EXP",p:{...(editing||{id:uid(),type:"maintenance",date:today(),description:"",notes:"",createdAt:new Date().toISOString()}),carId:preCarId||(carF!=="all"?carF:"")}});setShowForm(false);setEditing(null) }} className="w-full">Save Expense</Btn>}><p className="text-sm text-gray-500 text-center py-4">Use the + button on a car's Finance tab to add expenses per car.</p></Modal>}
      {showForm&&!editing&&<ExpenseFormModal cars={s.cars} initCarId={preCarId||(carF!=="all"?carF:"")} onClose={()=>setShowForm(false)} onSave={p=>{d({t:"ADD_EXP",p});setShowForm(false)}}/>}
      {showForm&&editing&&<ExpenseFormModal cars={s.cars} existing={editing} initCarId={editing.carId} onClose={()=>{setShowForm(false);setEditing(null)}} onSave={p=>{d({t:"UPD_EXP",p});setShowForm(false);setEditing(null)}}/>}
      {confirmDel&&<Confirm msg="Delete this expense?" onOk={()=>{d({t:"DEL_EXP",p:confirmDel});setConfirmDel(null)}} onCancel={()=>setConfirmDel(null)}/>}
    </div>
  )
}
function ExpenseFormModal({ cars, existing, initCarId, onClose, onSave }) {
  const [form,setForm]=useState(existing||{id:uid(),carId:initCarId||"",type:"maintenance",amount:"",date:today(),description:"",notes:"",createdAt:new Date().toISOString()}); const set=(k,v)=>setForm(f=>({...f,[k]:v}))
  return (<Modal title={existing?"✏️ Edit Expense":"💸 Add Expense"} onClose={onClose} footer={<Btn onClick={()=>{ if(!form.carId||!form.amount){alert("Select a car and enter amount");return} onSave({...form,amount:+form.amount}) }} className="w-full">{existing?"💾 Save":"➕ Add"}</Btn>}><Fld label="Car *"><Sel value={form.carId} onChange={e=>set("carId",e.target.value)}><option value="">— Select Car —</option>{cars.map(c=><option key={c.id} value={c.id}>{CAR_STATUS[c.status]?.emoji} {c.nickname}</option>)}</Sel></Fld><div className="grid grid-cols-2 gap-3"><Fld label="Type"><Sel value={form.type} onChange={e=>set("type",e.target.value)}>{EXP_TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}</Sel></Fld><Fld label="Amount (QAR)"><Inp type="number" value={form.amount} onChange={e=>set("amount",e.target.value)}/></Fld></div><Fld label="Date"><Inp type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></Fld><Fld label="Description"><Inp value={form.description} onChange={e=>set("description",e.target.value)}/></Fld></Modal>)
}

// ════════════ MORE / WEBSITE ════════════
function MoreScreen({ nav }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Header title="More"/>
      <div className="px-4 py-4 space-y-3">
        {[{em:"🌐",label:"Website & Publishing",desc:"Publish cars · Manage your public site",fn:()=>nav("website",{}),grad:"from-indigo-500 to-violet-600"},{em:"🔧",label:"Maintenance & Oil",desc:"Track oil changes per car",fn:()=>nav("maintenance",{}),grad:"from-amber-400 to-orange-500"},{em:"🔔",label:"Renewals",desc:"Insurance, registration, inspection",fn:()=>nav("renewals",{}),grad:"from-blue-500 to-cyan-400"},{em:"🚨",label:"Accident Records",desc:"Accidents and insurance claims",fn:()=>nav("accidents",{}),grad:"from-rose-400 to-pink-500"},{em:"⚙️",label:"Settings & Backup",desc:"Export, import and cloud sync",fn:()=>nav("settings",{}),grad:"from-gray-400 to-gray-500"}].map(item=>(
          <button key={item.label} onClick={item.fn} className="w-full bg-white rounded-3xl p-4 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-transform text-left">
            <div className={`w-12 h-12 bg-gradient-to-br ${item.grad} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md text-2xl`}>{item.em}</div>
            <div className="flex-1 min-w-0"><div className="font-black text-gray-800">{item.label}</div><div className="text-xs text-gray-400 mt-0.5">{item.desc}</div></div>
            <ChevronRight size={18} className="text-gray-300 flex-shrink-0"/>
          </button>
        ))}
      </div>
    </div>
  )
}

function WebsiteScreen({ nav }) {
  const { s, d } = useStore()
  const biz = s.business || {}
  const set = (k,v) => d({ t:"SET_BIZ", p:{ [k]:v } })
  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Header title="🌐 Website & Publishing" onBack={()=>nav("more",{})}/>
      <div className="px-4 py-4 space-y-4">
        <SCard title="🏢 Business Profile">
          <Fld label="Business Name"><Inp value={biz.name||""} onChange={e=>set("name",e.target.value)} placeholder="Ahmed Car Rental"/></Fld>
          <Fld label="Tagline"><Inp value={biz.tagline||""} onChange={e=>set("tagline",e.target.value)} placeholder="Your Trusted Car Rental in Doha"/></Fld>
          <div className="grid grid-cols-2 gap-3"><Fld label="WhatsApp Number"><Inp value={biz.whatsapp||""} onChange={e=>set("whatsapp",e.target.value)} placeholder="+97450000000"/></Fld><Fld label="Phone"><Inp value={biz.phone||""} onChange={e=>set("phone",e.target.value)} placeholder="+97450000000"/></Fld></div>
          <Fld label="Location"><Inp value={biz.location||""} onChange={e=>set("location",e.target.value)} placeholder="Doha, Qatar"/></Fld>
          <div className="grid grid-cols-2 gap-3"><Fld label="Instagram Handle"><Inp value={biz.instagram||""} onChange={e=>set("instagram",e.target.value)} placeholder="@yourpage"/></Fld><Fld label="Facebook"><Inp value={biz.facebook||""} onChange={e=>set("facebook",e.target.value)} placeholder="yourpage"/></Fld></div>
          <Fld label="About Us"><Txa value={biz.about||""} onChange={e=>set("about",e.target.value)} placeholder="Tell customers about your business…"/></Fld>
        </SCard>
        <SCard title="🚗 Cars on Website">
          {s.cars.map(car => (
            <div key={car.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="min-w-0 flex-1"><div className="font-bold text-gray-800 text-sm">{car.nickname}</div><div className="text-xs text-gray-400">{car.brand} · {car.dailyRate?`QAR ${car.dailyRate}/day`:"No rate set"}</div></div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${car.published?"bg-emerald-100 text-emerald-600":"bg-gray-100 text-gray-400"}`}>{car.published?"🌐 Live":"Hidden"}</span>
                <button onClick={()=>d({t:"UPD_CAR",p:{...car,published:!car.published}})} className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${car.published?"bg-emerald-500":"bg-gray-300"}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${car.published?"left-6":"left-1"}`}/></button>
              </div>
            </div>
          ))}
          {s.cars.length===0&&<p className="text-sm text-gray-400 text-center py-4">Add some cars first!</p>}
        </SCard>
        <PublishWebsite />
        <Btn onClick={()=>nav("cars",{})} v="outline" className="w-full flex items-center justify-center gap-2"><Car size={15}/>Manage Car Details & Rates</Btn>
      </div>
    </div>
  )
}

function MaintenanceScreen({ nav }) {
  const { s, d } = useStore(); const [oilForm,setOilForm]=useState(null)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50/30 pb-28">
      <Header title="🛢️ Maintenance" onBack={()=>nav("more",{})}/>
      <div className="px-4 py-4 space-y-4">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-3xl p-4 shadow-lg"><div className="text-2xl mb-1">🔧</div><div className="font-black text-lg">Oil Change Tracker</div><div className="text-white/70 text-sm">Stay on top of every car's service</div></div>
        {s.cars.filter(c=>c.status!=="sold").map(car=>{ const km=(car.nextOilChangeMileage||0)-(car.currentMileage||0); const pct=Math.min(100,Math.max(0,(1-km/5000)*100)); const over=km<=0; const soon=km>0&&km<=500; return (
          <div key={car.id} className="bg-white rounded-3xl shadow-sm p-4">
            <div className="flex justify-between items-start mb-3"><div><div className="font-black text-gray-900">{car.nickname}</div><div className="text-xs text-gray-400">{car.brand} · {car.plateNumber}</div></div><span className={`text-xs font-black px-2.5 py-1 rounded-full ${over?"bg-rose-100 text-rose-700":soon?"bg-amber-100 text-amber-700":"bg-emerald-100 text-emerald-700"}`}>{over?"🚨 Overdue":soon?"⚠️ Soon":"✅ OK"}</span></div>
            <div className="space-y-1.5 text-xs mb-3"><div className="flex justify-between text-gray-400"><span>Current KM</span><span className="font-black text-gray-700">{(car.currentMileage||0).toLocaleString()} km</span></div><div className="flex justify-between text-gray-400"><span>Next at</span><span className="font-black text-gray-700">{(car.nextOilChangeMileage||0).toLocaleString()} km</span></div><div className={`flex justify-between font-black ${over?"text-rose-600":soon?"text-amber-600":"text-emerald-600"}`}><span>Remaining</span><span>{over?`🚨 ${Math.abs(km).toLocaleString()} km OVERDUE`:`${km.toLocaleString()} km`}</span></div></div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden"><div className={`h-3 rounded-full ${over?"bg-gradient-to-r from-rose-400 to-pink-500":soon?"bg-gradient-to-r from-amber-400 to-orange-400":"bg-gradient-to-r from-emerald-400 to-teal-500"}`} style={{width:`${pct}%`}}/></div>
            <div className="flex gap-2"><Btn onClick={()=>setOilForm(car.id)} v="outline" size="sm" className="flex-1 flex items-center justify-center gap-1"><Wrench size={13}/>Log Oil Change</Btn><Btn onClick={()=>nav("car-form",{id:car.id})} v="secondary" size="sm" className="flex-1 flex items-center justify-center gap-1"><Edit size={13}/>Update KM</Btn></div>
          </div>
        )})}
      </div>
      {oilForm&&<Modal title={`🛢️ Oil Change – ${s.cars.find(c=>c.id===oilForm)?.nickname}`} onClose={()=>setOilForm(null)} footer={<Btn onClick={()=>{ const car=s.cars.find(c=>c.id===oilForm); const km=car.currentMileage||0; d({t:"UPD_CAR",p:{...car,lastOilChangeMileage:km,nextOilChangeMileage:km+5000,lastOilChangeDate:today()}}); d({t:"ADD_EXP",p:{id:uid(),carId:oilForm,type:"maintenance",amount:0,date:today(),description:"Oil change",notes:"",createdAt:new Date().toISOString()}}); setOilForm(null) }} className="w-full">💾 Log Oil Change</Btn>}><p className="text-sm text-gray-500 text-center py-2">This will set last change to today at current KM and schedule next at +5,000 km.<br/>Edit car to set custom values.</p></Modal>}
    </div>
  )
}

function RenewalsScreen({ nav }) {
  const { s } = useStore(); const items=useMemo(()=>{ const list=[]; s.cars.forEach(car=>[["registrationExpiry","Registration"],["insuranceExpiry","Insurance"],["inspectionExpiry","Inspection"],["roadPermitExpiry","Road Permit"],["warrantyExpiry","Warranty"]].forEach(([f,l])=>{ if(car[f]) list.push({car,label:l,date:car[f],days:daysUntil(car[f])}) })); return list.sort((a,b)=>a.days-b.days) },[s.cars])
  const groups=[{title:"🚨 Expired",fn:i=>i.days<0},{title:"🔴 This Week",fn:i=>i.days>=0&&i.days<=7},{title:"🟡 This Month",fn:i=>i.days>7&&i.days<=30},{title:"✅ All Good",fn:i=>i.days>30}]
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30 pb-28">
      <Header title="🔔 Renewals" onBack={()=>nav("more",{})}/>
      <div className="px-4 py-4 space-y-5">
        {groups.map(g=>{ const grp=items.filter(g.fn); if(!grp.length) return null; return <div key={g.title}><p className="text-xs font-black text-gray-600 mb-2">{g.title} ({grp.length})</p><div className="space-y-2">{grp.map((item,i)=>{ const dd=item.days; const cls=dd<0?"bg-rose-50 border-rose-100":dd<=7?"bg-orange-50 border-orange-100":dd<=30?"bg-amber-50 border-amber-100":"bg-emerald-50 border-emerald-100"; const tc=dd<0?"text-rose-700":dd<=7?"text-orange-700":dd<=30?"text-amber-700":"text-emerald-700"; return <button key={i} onClick={()=>nav("car-form",{id:item.car.id})} className={`w-full flex justify-between items-center p-3.5 rounded-2xl border text-left ${cls}`}><div><div className="text-sm font-black text-gray-800">{item.car.nickname}</div><div className="text-xs text-gray-500">{item.label}</div></div><div className="text-right"><div className={`text-sm font-black ${tc}`}>{dd<0?`${Math.abs(dd)}d ago`:dd===0?"Today!":dd<=30?`${dd}d`:"✅"}</div><div className="text-xs text-gray-400">{fmtD(item.date)}</div></div></button> })}</div></div> })}
        {items.length===0&&<div className="text-center py-16"><div className="text-5xl mb-3">🛡️</div><p className="font-black text-gray-300">No renewal dates set</p></div>}
      </div>
    </div>
  )
}

function AccidentsScreen({ nav, openForCar }) {
  const { s, d } = useStore(); const [showForm,setShowForm]=useState(!!openForCar); const [editing,setEditing]=useState(null); const [confirmDel,setConfirmDel]=useState(null)
  const delAcc=async id=>{ const rel=s.media.filter(m=>m.ownerType==="accident"&&m.ownerId===id); await Promise.all(rel.map(m=>deleteMedia(m.id))); d({t:"DEL_ACC",p:id}) }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-rose-50/30 pb-28">
      <Header title="🚨 Accidents" onBack={()=>nav("more",{})} action={<Btn onClick={()=>{setEditing(null);setShowForm(true)}} size="sm" className="flex items-center gap-1"><Plus size={13}/>New</Btn>}/>
      <div className="px-4 py-4 space-y-3">
        {s.accidents.length===0&&<div className="text-center py-16"><div className="text-5xl mb-3">🙏</div><p className="font-black text-gray-400">No accidents!</p></div>}
        {s.accidents.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(acc=>{ const car=s.cars.find(c=>c.id===acc.carId); return <div key={acc.id} className="bg-white rounded-3xl shadow-sm p-4"><div className="flex justify-between items-start mb-2"><div><div className="font-bold text-gray-900">{car?.nickname||"Unknown Car"}</div><div className="text-xs text-gray-400">{fmtD(acc.date)}</div></div><Badge status={acc.status} map={ACC_STATUS}/></div><p className="text-sm text-gray-600 mb-2">{acc.description}</p><div className="text-xs text-gray-400 mb-3 bg-gray-50 rounded-xl p-2">💰 Est: {fmt(acc.estimatedCost||0)} · Actual: {fmt(acc.actualCost||0)}</div><div className="flex gap-3"><button onClick={()=>{setEditing(acc);setShowForm(true)}} className="text-xs text-violet-600 font-black flex items-center gap-1"><Edit size={12}/>Edit</button><button onClick={()=>setConfirmDel(acc.id)} className="text-xs text-rose-400 font-black flex items-center gap-1 ml-2"><Trash2 size={12}/>Delete</button></div></div> })}
      </div>
      {showForm&&<Modal title={editing?"✏️ Edit Accident":"🚨 New Accident"} onClose={()=>{setShowForm(false);setEditing(null)}} footer={<Btn onClick={()=>{ const form={id:editing?.id||uid(),carId:openForCar||"",date:today(),description:"",status:"open",estimatedCost:0,actualCost:0,createdAt:new Date().toISOString(),...editing}; d({t:editing?"UPD_ACC":"ADD_ACC",p:form}); setShowForm(false);setEditing(null) }} className="w-full">💾 Save</Btn>}><p className="text-sm text-gray-500 text-center py-4">Use car detail page → Accidents tab for full accident recording with photos.</p></Modal>}
      {confirmDel&&<Confirm msg="Delete this accident record?" onOk={async()=>{ await delAcc(confirmDel);setConfirmDel(null) }} onCancel={()=>setConfirmDel(null)}/>}
    </div>
  )
}

function SettingsScreen({ nav, onExit }) {
  const { s, d } = useStore(); const [confirmReset,setConfirmReset]=useState(false); const [busy,setBusy]=useState(false)
  const exportJSON=async()=>{ setBusy(true); try { const mediaData={}; for(const m of s.media){ const v=mediaCache.get(m.id)||localStorage.getItem(MEDIA_PFX+m.id); if(v) mediaData[m.id]=v }; const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([JSON.stringify({...s,mediaData})],{type:"application/json"})); a.download=`fleet-backup-${today()}.json`; a.click(); URL.revokeObjectURL(a.href) }catch(e){alert("Export failed")}; setBusy(false) }
  const exportCSV=()=>{ const rows=[["Customer","Car","Plate","Start","End","Days","Rate","Total","Paid","Balance","Status"],...s.rentals.map(r=>{ const car=s.cars.find(c=>c.id===r.carId); const dur=calcDur(r.startDate,r.endDate); const total=r.rateAmount*dur; return[r.customerName,car?.nickname||"",car?.plateNumber||"",r.startDate,r.endDate,dur,r.rateAmount,total,r.paymentReceived||0,total-(r.paymentReceived||0),r.status] })]; const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([rows.map(r=>r.join(",")).join("\n")],{type:"text/csv"})); a.download=`rentals-${today()}.csv`; a.click(); URL.revokeObjectURL(a.href) }
  const importJSON=e=>{ const file=e.target.files?.[0]; if(!file) return; setBusy(true); const reader=new FileReader(); reader.onload=ev=>{ try{ const{mediaData,...rest}=JSON.parse(ev.target.result); if(mediaData){ Object.entries(mediaData).forEach(([id,val])=>{ if(val){ mediaCache.set(id,val); try{localStorage.setItem(MEDIA_PFX+id,val)}catch(e){} } }) }; d({t:"LOAD",p:rest}); alert("Imported! ✅") }catch{alert("Invalid file")}; setBusy(false) }; reader.readAsText(file); e.target.value="" }
  const handleReset=()=>{ const keys=[]; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith(MEDIA_PFX))keys.push(k)}; keys.forEach(k=>localStorage.removeItem(k)); mediaCache.clear(); d({t:"RESET"}); setConfirmReset(false) }
  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Header title="⚙️ Settings" onBack={()=>nav("more",{})}/>
      <div className="px-4 py-4 space-y-4">
        <SCard title="👤 Profile"><Fld label="Your Name"><Inp value={s.ownerName} onChange={e=>d({t:"SET_NAME",p:e.target.value})} placeholder="Your name"/></Fld></SCard>
        <SCard title="📊 Data Summary"><div className="grid grid-cols-2 gap-3">{[["🚗","Cars",s.cars.length],["🔑","Rentals",s.rentals.length],["🚨","Accidents",s.accidents.length],["📷","Photos",s.media.length]].map(([em,l,v])=><div key={l} className="bg-gray-50 rounded-2xl p-3 text-center"><div className="text-xl mb-1">{em}</div><div className="text-2xl font-black text-gray-800">{v}</div><div className="text-xs text-gray-400 mt-0.5">{l}</div></div>)}</div></SCard>
        <CloudSync />
        <SCard title="💾 Export"><div className="space-y-2.5"><Btn onClick={exportJSON} v="outline" disabled={busy} className="w-full flex items-center justify-center gap-2"><Download size={16}/>{busy?"Packing…":"Export Full Backup (JSON)"}</Btn><Btn onClick={exportCSV} v="outline" className="w-full flex items-center justify-center gap-2"><FileText size={16}/>Export Rentals (CSV)</Btn></div></SCard>
        <SCard title="📂 Import"><label className="block"><div className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-black border-2 border-dashed border-gray-200 bg-white text-gray-500 rounded-2xl cursor-pointer"><Upload size={16}/>{busy?"Importing…":"Import Backup (JSON)"}</div><input type="file" accept=".json" className="hidden" onChange={importJSON} disabled={busy}/></label></SCard>
        <SCard title="🔥 Danger Zone">
          <Btn onClick={()=>setConfirmReset(true)} v="danger" className="w-full flex items-center justify-center gap-2 mb-2"><RefreshCw size={16}/>Reset to Demo Data</Btn>
          <Btn onClick={onExit} v="secondary" className="w-full flex items-center justify-center gap-2"><LogOut size={16}/>Exit Admin — Go to Public Site</Btn>
        </SCard>
        <p className="text-center text-xs text-gray-300 py-2">🚗 Fleet Manager Platform v3.0</p>
      </div>
      {confirmReset&&<Confirm msg="Reset ALL data to demo data?" onOk={handleReset} onCancel={()=>setConfirmReset(false)}/>}
    </div>
  )
}

// ════════════ ADMIN APP ROOT ════════════
export default function AdminApp({ onExit }) {
  const [screen, setScreen] = useState("home")
  const [params, setParams] = useState({})
  const [tab, setTab] = useState("home")

  const nav = useCallback((scr, p={}) => {
    setScreen(scr); setParams(p)
    if (["home","cars","rentals","finance","more"].includes(scr)) setTab(scr)
    window.scrollTo(0, 0)
  }, [])

  const switchTab = useCallback(t => { setTab(t); setScreen(t); setParams({}); window.scrollTo(0,0) }, [])

  const render = () => {
    switch(screen) {
      case "home":          return <Dashboard nav={nav}/>
      case "cars":          return <CarsScreen nav={nav}/>
      case "car-detail":    return <CarDetail carId={params.id} nav={nav}/>
      case "car-form":      return <CarForm carId={params.id} initialTab={params.tab} nav={nav}/>
      case "rentals":       return <RentalsScreen nav={nav}/>
      case "rental-form":   return <RentalForm rentalId={params.rentalId} preCarId={params.carId} nav={nav}/>
      case "rental-detail": return <RentalDetail rentalId={params.id} nav={nav}/>
      case "finance":       return <FinanceScreen nav={nav}/>
      case "expense-form":  return <FinanceScreen nav={nav} openExpense preCarId={params.carId}/>
      case "maintenance":   return <MaintenanceScreen nav={nav}/>
      case "renewals":      return <RenewalsScreen nav={nav}/>
      case "accidents":     return <AccidentsScreen nav={nav} openForCar={params.openForCar}/>
      case "more":          return <MoreScreen nav={nav}/>
      case "website":       return <WebsiteScreen nav={nav}/>
      case "settings":      return <SettingsScreen nav={nav} onExit={onExit}/>
      default:              return <Dashboard nav={nav}/>
    }
  }

  return (
    <Store>
      <div className="max-w-md mx-auto relative min-h-screen">
        <div className="bg-indigo-900 text-white text-[10px] font-black text-center py-1.5 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/>
          ADMIN MODE — <button onClick={onExit} className="underline ml-1">Exit to Public Site →</button>
        </div>
        {render()}
        <BottomNav tab={tab} setTab={switchTab}/>
      </div>
    </Store>
  )
}

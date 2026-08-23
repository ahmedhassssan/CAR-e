import { useState, useEffect } from "react"
import { Phone, MessageCircle, MapPin, X, Check, Star, Shield, Clock, Award, ChevronRight, Menu, Instagram, Facebook, Zap } from "lucide-react"

const DEMO_BUSINESS = {
  name: "Car'e Car Rental",
  tagline: "Easiest Way to Rent a Car in Doha",
  whatsapp: "+97470469346",
  phone: "+97470469346",
  location: "Doha, Qatar",
  instagram: "carsychatrist",
  facebook: "",
  about: "Car'e Car Rental makes renting a car in Doha simple, fast and affordable. Modern fleet, transparent pricing, and friendly service — we get you on the road in no time!",
}

const DEMO_CARS = [
  { id:"d1", nickname:"Farida", brand:"FORD", model:"Focus Sedan", year:2018, color:"White", dailyRate:150, weeklyRate:900, monthlyRate:3000, status:"available", features:["AC","Bluetooth","GPS","USB"], publicDescription:"Comfortable family sedan in excellent condition. Perfect for daily commute or weekend trips.", published:true, publicPhotoUrl:"" },
  { id:"d2", nickname:"MG Silver", brand:"MG", model:"ZS SUV", year:2023, color:"Silver", dailyRate:220, weeklyRate:1300, monthlyRate:4800, status:"available", features:["AC","GPS","Leather Seats","Backup Camera","Bluetooth"], publicDescription:"Modern SUV with premium features. Spacious interior perfect for families and long trips.", published:true, publicPhotoUrl:"" },
  { id:"d3", nickname:"Chery Black", brand:"CHERY", model:"Tiggo Sedan", year:2026, color:"Black", dailyRate:190, weeklyRate:1100, monthlyRate:4000, status:"available", features:["AC","Bluetooth","USB","Backup Camera"], publicDescription:"Brand new 2026 model with zero km. Enjoy the latest technology and sleek black design.", published:true, publicPhotoUrl:"" },
]

const CAR_COLORS = {
  White:"bg-gray-100 text-gray-700", Silver:"bg-slate-200 text-slate-700", Black:"bg-gray-800 text-white",
  Red:"bg-red-100 text-red-700", Blue:"bg-blue-100 text-blue-700", Grey:"bg-gray-200 text-gray-600",
}

function CarPlaceholder({ car }) {
  const gradients = [
    "from-violet-600 to-indigo-700","from-blue-600 to-cyan-600","from-emerald-600 to-teal-600",
    "from-amber-500 to-orange-600","from-rose-600 to-pink-600","from-slate-600 to-gray-700",
  ]
  const g = gradients[car.id?.charCodeAt(0) % gradients.length] || gradients[0]
  return (
    <div className={`w-full h-full bg-gradient-to-br ${g} flex flex-col items-center justify-center`}>
      <span className="text-6xl mb-2">🚗</span>
      <span className="text-white/80 text-sm font-bold">{car.brand}</span>
      <span className="text-white/60 text-xs">{car.year}</span>
    </div>
  )
}

function CarCard({ car, onBook, onView }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Photo */}
      <div className="h-48 relative overflow-hidden cursor-pointer" onClick={() => onView(car)}>
        {car.publicPhotoUrl
          ? <img src={car.publicPhotoUrl} alt={car.nickname} className="w-full h-full object-cover" />
          : <CarPlaceholder car={car} />}
        <div className="absolute top-3 right-3">
          <span className="bg-emerald-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm">✅ Available</span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-black/40 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">{car.year}</span>
        </div>
      </div>
      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-black text-gray-900 text-base">{car.nickname}</h3>
            <p className="text-gray-400 text-xs">{car.brand} {car.model}</p>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${CAR_COLORS[car.color] || 'bg-gray-100 text-gray-600'}`}>{car.color}</span>
        </div>
        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-3">
          {(car.features || []).slice(0,3).map(f => <span key={f} className="text-[10px] bg-violet-50 text-violet-600 font-semibold px-2 py-0.5 rounded-full">{f}</span>)}
          {(car.features || []).length > 3 && <span className="text-[10px] bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">+{car.features.length - 3}</span>}
        </div>
        {/* Pricing */}
        <div className="grid grid-cols-3 gap-1 mb-4 bg-gray-50 rounded-2xl p-2.5">
          {[["Daily","day",car.dailyRate],["Weekly","week",car.weeklyRate],["Monthly","mo",car.monthlyRate]].map(([l,s,v]) => v ? (
            <div key={l} className="text-center">
              <div className="text-xs font-black text-gray-800">QAR {v}</div>
              <div className="text-[10px] text-gray-400">/{s}</div>
            </div>
          ) : null)}
        </div>
        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button onClick={() => onView(car)} className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-black text-xs rounded-2xl hover:border-violet-300 hover:text-violet-600 transition-colors">View Details</button>
          <button onClick={() => onBook(car)} className="flex-1 py-2.5 bg-[#25D366] text-white font-black text-xs rounded-2xl flex items-center justify-center gap-1 hover:bg-[#20b558] transition-colors shadow-sm">
            <MessageCircle size={13} />Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

function CarModal({ car, business, onClose, onBook }) {
  const [tab, setTab] = useState("overview")
  if (!car) return null
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Photo header */}
        <div className="h-56 relative overflow-hidden rounded-t-3xl md:rounded-t-3xl flex-shrink-0">
          {car.publicPhotoUrl
            ? <img src={car.publicPhotoUrl} alt={car.nickname} className="w-full h-full object-cover" />
            : <CarPlaceholder car={car} />}
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full"><X size={18} className="text-white"/></button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-2 flex justify-between items-center">
              <div><h2 className="text-white font-black text-lg">{car.nickname}</h2><p className="text-white/70 text-xs">{car.brand} {car.model} · {car.year}</p></div>
              <span className="bg-emerald-500 text-white text-xs font-black px-2.5 py-1 rounded-full">Available</span>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-4">
          {[["overview","Overview"],["pricing","Pricing"],["features","Features"]].map(([v,l]) => (
            <button key={v} onClick={()=>setTab(v)} className={`px-4 py-3 text-sm font-black border-b-2 transition-colors ${tab===v?"border-violet-500 text-violet-600":"border-transparent text-gray-400"}`}>{l}</button>
          ))}
        </div>
        <div className="p-5">
          {tab==="overview" && (
            <div>
              {car.publicDescription && <p className="text-gray-600 text-sm leading-relaxed mb-4">{car.publicDescription}</p>}
              <div className="grid grid-cols-2 gap-3">
                {[["🎨 Color",car.color],["📅 Year",car.year],["🏎️ Brand",car.brand],["🚘 Model",car.model]].map(([l,v]) => (
                  <div key={l} className="bg-gray-50 rounded-2xl p-3"><div className="text-xs text-gray-400">{l}</div><div className="font-black text-gray-800 mt-0.5">{v}</div></div>
                ))}
              </div>
            </div>
          )}
          {tab==="pricing" && (
            <div className="space-y-3">
              {[[`📅 Daily Rate`,`QAR ${car.dailyRate || "—"}`,"/day","violet"],[`📆 Weekly Rate`,`QAR ${car.weeklyRate || "—"}`,"/week","blue"],[`🗓️ Monthly Rate`,`QAR ${car.monthlyRate || "—"}`,"/month","emerald"]].map(([l,v,s,c]) => (
                <div key={l} className={`flex justify-between items-center p-4 bg-${c}-50 rounded-2xl`}>
                  <span className={`text-sm font-bold text-${c}-700`}>{l}</span>
                  <div className="text-right"><span className={`text-xl font-black text-${c}-700`}>{v}</span><span className={`text-xs text-${c}-400 ml-1`}>{s}</span></div>
                </div>
              ))}
              <p className="text-xs text-gray-400 text-center pt-1">💬 Contact us for custom long-term rates</p>
            </div>
          )}
          {tab==="features" && (
            <div>
              {(car.features||[]).length > 0
                ? <div className="grid grid-cols-2 gap-2">{(car.features||[]).map(f => <div key={f} className="flex items-center gap-2 bg-emerald-50 rounded-xl p-2.5"><Check size={14} className="text-emerald-500 flex-shrink-0"/><span className="text-sm font-semibold text-gray-700">{f}</span></div>)}</div>
                : <p className="text-gray-400 text-sm text-center py-4">No features listed</p>}
            </div>
          )}
        </div>
        {/* Book CTA */}
        <div className="px-5 pb-6 pt-2 space-y-2">
          <button onClick={() => onBook(car)} className="w-full py-4 bg-[#25D366] text-white font-black text-base rounded-2xl flex items-center justify-center gap-2 hover:bg-[#20b558] transition-colors shadow-lg shadow-green-200">
            <MessageCircle size={20} />Book via WhatsApp
          </button>
          <button onClick={() => { window.location.href = `tel:${business.phone}` }} className="w-full py-3 border-2 border-gray-200 text-gray-600 font-black text-sm rounded-2xl flex items-center justify-center gap-2 hover:border-violet-300 hover:text-violet-600 transition-colors">
            <Phone size={16} />Call Us
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PublicSite({ onAdminLogin, sharedData }) {
  const [cars, setCars] = useState([])
  const [business, setBusiness] = useState(DEMO_BUSINESS)
  const [selectedCar, setSelectedCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState("all")
  const [adminClicks, setAdminClicks] = useState(0)

  useEffect(() => {
    const load = async () => {
      // If admin shared data directly, use it
      if (sharedData) {
        setCars((sharedData.cars || []).filter(c => c.published))
        setBusiness({ ...DEMO_BUSINESS, ...sharedData.business })
        setLoading(false)
        return
      }
      // Try URL param for public Gist ID
      const params = new URLSearchParams(window.location.search)
      const gistId = params.get("g") || localStorage.getItem("fleet-public-gist-id")
      if (gistId) {
        try {
          const res = await fetch(`https://api.github.com/gists/${gistId}`)
          if (res.ok) {
            const gist = await res.json()
            const content = gist.files?.["fleet-website.json"]?.content
            if (content) {
              const data = JSON.parse(content)
              setCars((data.cars || []).filter(c => c.published && c.status === "available"))
              setBusiness({ ...DEMO_BUSINESS, ...data.business })
              setLoading(false)
              return
            }
          }
        } catch(e) {}
      }
      // Fall back to demo
      setCars(DEMO_CARS)
      setBusiness(DEMO_BUSINESS)
      setLoading(false)
    }
    load()
  }, [sharedData])

  const handleBook = (car) => {
    const msg = `Hello! 👋 I'm interested in renting:\n\n🚗 *${car.brand} ${car.model} ${car.year}* (${car.color})\n💰 Daily: QAR ${car.dailyRate || "—"}\n\nPlease let me know the availability. Thank you!`
    const phone = (business.whatsapp || "").replace(/[^0-9]/g, "")
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank")
  }

  const handleSecretAdmin = () => {
    setAdminClicks(n => {
      if (n + 1 >= 5) { onAdminLogin(); return 0 }
      return n + 1
    })
  }

  const filteredCars = filter === "all" ? cars : cars.filter(c => c.brand?.toLowerCase() === filter)
  const brands = [...new Set(cars.map(c => c.brand).filter(Boolean))]
  const availableCount = cars.filter(c => c.status === "available").length

  if (loading) return (
    <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center">
      <div className="text-6xl animate-bounce mb-4">🚗</div>
      <p className="text-white/60 text-sm">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚗</span>
            <div>
              <div className="font-black text-gray-900 text-base leading-tight">{business.name}</div>
              <div className="text-[10px] text-gray-400 font-semibold">Doha, Qatar</div>
            </div>
          </div>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-500">
            <a href="#cars" className="hover:text-violet-600 transition-colors">Our Fleet</a>
            <a href="#why" className="hover:text-violet-600 transition-colors">Why Us</a>
            <a href="#contact" className="hover:text-violet-600 transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href={`https://wa.me/${(business.whatsapp||"").replace(/[^0-9]/g,"")}`} target="_blank" rel="noopener noreferrer"
              className="bg-[#25D366] text-white text-xs font-black px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#20b558] transition-colors shadow-sm">
              <MessageCircle size={13}/>WhatsApp
            </a>
            <button className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-50" onClick={() => setMenuOpen(v => !v)}>
              <Menu size={20}/>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
            {["#cars","#why","#contact"].map((href, i) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="font-bold text-gray-600 py-2 border-b border-gray-50 last:border-0">
                {["🚗 Our Fleet","⭐ Why Us","📞 Contact"][i]}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="pt-16 bg-gradient-to-br from-indigo-950 via-violet-900 to-blue-900 text-white min-h-[90vh] flex items-center relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"/>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"/>
        </div>
        <div className="max-w-6xl mx-auto px-5 py-20 w-full relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 text-xs font-bold mb-6 text-white/80">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/>
              {availableCount} Cars Available Now
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
              Rent the Perfect Car<br/>
              <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">in Doha, Qatar</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-lg leading-relaxed">{business.tagline}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#cars" className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-black px-6 py-3.5 rounded-2xl text-sm hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/30 flex items-center gap-2">
                Browse Our Fleet <ChevronRight size={16}/>
              </a>
              <a href={`https://wa.me/${(business.whatsapp||"").replace(/[^0-9]/g,"")}`} target="_blank" rel="noopener noreferrer"
                className="bg-[#25D366] text-white font-black px-6 py-3.5 rounded-2xl text-sm hover:opacity-90 transition-opacity shadow-lg shadow-green-500/30 flex items-center gap-2">
                <MessageCircle size={16}/>WhatsApp Us
              </a>
            </div>
            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[[availableCount+"+"," Cars Available"],["100%"," Insured"],["24/7"," Support"]].map(([n,l]) => (
                <div key={l}><div className="text-2xl font-black text-white">{n}</div><div className="text-xs text-white/50 font-semibold">{l}</div></div>
              ))}
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
          <span className="text-xs font-semibold">Scroll</span>
          <div className="w-0.5 h-8 bg-white/20 rounded-full"/>
        </div>
      </section>

      {/* ── CARS ── */}
      <section id="cars" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">🚗 Available Cars</h2>
            <p className="text-gray-500 text-sm">{availableCount} cars ready for rental</p>
          </div>
          {/* Filter by brand */}
          {brands.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scroll pb-3 mb-6 justify-center">
              {[["all","All Cars"], ...brands.map(b => [b.toLowerCase(), b])].map(([v,l]) => (
                <button key={v} onClick={() => setFilter(v)} className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap flex-shrink-0 transition-all ${filter===v?"bg-violet-600 text-white shadow-md shadow-violet-200":"bg-white text-gray-500 border border-gray-200 hover:border-violet-300"}`}>{l}</button>
              ))}
            </div>
          )}
          {filteredCars.length === 0
            ? <div className="text-center py-16"><div className="text-5xl mb-3">😔</div><p className="font-black text-gray-400">No cars available right now</p><p className="text-sm text-gray-300 mt-1">Contact us for upcoming availability</p></div>
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{filteredCars.map(car => <CarCard key={car.id} car={car} onBook={handleBook} onView={setSelectedCar}/>)}</div>}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section id="why" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">⭐ Why Choose Us?</h2>
            <p className="text-gray-400 text-sm">We make car rental simple and hassle-free</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { em:"💰", title:"Best Prices", desc:"Competitive daily, weekly and monthly rates" },
              { em:"🚗", title:"Clean Fleet", desc:"All cars are clean, serviced and ready to go" },
              { em:"⚡", title:"Fast Booking", desc:"Book in minutes via WhatsApp, no paperwork" },
              { em:"🛡️", title:"Fully Insured", desc:"All vehicles covered with valid insurance" },
              { em:"📞", title:"24/7 Support", desc:"We're always available when you need help" },
              { em:"📋", title:"Easy Process", desc:"Simple documents — just ID and license" },
              { em:"🎯", title:"Flexible Terms", desc:"Daily, weekly or monthly — you choose" },
              { em:"⭐", title:"Trusted", desc:"Serving Doha customers with quality service" },
            ].map(item => (
              <div key={item.title} className="bg-gray-50 rounded-3xl p-4 text-center hover:bg-violet-50 hover:shadow-md transition-all duration-300">
                <div className="text-3xl mb-2">{item.em}</div>
                <div className="font-black text-gray-800 text-sm mb-1">{item.title}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-950 to-violet-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-2">How It Works</h2>
          <p className="text-white/60 text-sm mb-10">3 simple steps to get your car</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n:"01", em:"💬", title:"Contact Us", desc:"Message us on WhatsApp with your preferred car and dates" },
              { n:"02", em:"📋", title:"Quick Docs", desc:"Just your Qatar ID and driving license — that's it" },
              { n:"03", em:"🚗", title:"Drive Away", desc:"Pick up your car and enjoy the ride!" },
            ].map(s => (
              <div key={s.n} className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/10">
                <div className="text-4xl mb-3">{s.em}</div>
                <div className="text-white/40 text-xs font-black mb-1">STEP {s.n}</div>
                <div className="font-black text-white text-base mb-2">{s.title}</div>
                <div className="text-white/60 text-xs leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">📞 Contact Us</h2>
            <p className="text-gray-400 text-sm">We're here to help — reach us anytime</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <a href={`https://wa.me/${(business.whatsapp||"").replace(/[^0-9]/g,"")}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border-2 border-[#25D366]/30 rounded-2xl p-4 transition-colors group">
              <div className="w-12 h-12 bg-[#25D366] rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                <MessageCircle size={22} className="text-white"/>
              </div>
              <div>
                <div className="font-black text-gray-800 group-hover:text-green-700">WhatsApp</div>
                <div className="text-sm text-gray-500">{business.whatsapp || "—"}</div>
              </div>
            </a>
            <a href={`tel:${business.phone}`}
              className="flex items-center gap-4 bg-violet-50 hover:bg-violet-100 border-2 border-violet-200 rounded-2xl p-4 transition-colors group">
              <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                <Phone size={22} className="text-white"/>
              </div>
              <div>
                <div className="font-black text-gray-800 group-hover:text-violet-700">Phone</div>
                <div className="text-sm text-gray-500">{business.phone || "—"}</div>
              </div>
            </a>
          </div>
          {business.location && (
            <div className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin size={22} className="text-white"/>
              </div>
              <div><div className="font-black text-gray-800">Location</div><div className="text-sm text-gray-500">{business.location}</div></div>
            </div>
          )}
          {/* Big WhatsApp CTA */}
          <a href={`https://wa.me/${(business.whatsapp||"").replace(/[^0-9]/g,"")}`} target="_blank" rel="noopener noreferrer"
            className="block w-full py-4 bg-[#25D366] text-white font-black text-base rounded-2xl text-center hover:bg-[#20b558] transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2">
            <MessageCircle size={20}/>Chat with us on WhatsApp
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl mb-2">🚗</div>
          <div className="font-black text-white text-base mb-1">{business.name}</div>
          <div className="text-gray-400 text-xs mb-4">{business.location}</div>
          {(business.instagram || business.facebook) && (
            <div className="flex justify-center gap-3 mb-4">
              {business.instagram && <a href={`https://instagram.com/${business.instagram}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"><Instagram size={16}/></a>}
              {business.facebook && <a href={`https://facebook.com/${business.facebook}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"><Facebook size={16}/></a>}
            </div>
          )}
          <div className="border-t border-white/10 pt-4">
            <p className="text-gray-500 text-xs">© 2026 {business.name} · All rights reserved</p>
            <button onClick={handleSecretAdmin} className="text-gray-800 text-[10px] mt-2 hover:text-gray-600 transition-colors">·</button>
          </div>
        </div>
      </footer>

      {/* Car Detail Modal */}
      {selectedCar && <CarModal car={selectedCar} business={business} onClose={() => setSelectedCar(null)} onBook={handleBook} />}
    </div>
  )
}

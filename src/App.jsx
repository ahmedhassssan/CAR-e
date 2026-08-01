import { useState, useEffect } from "react"
import PublicSite from "./PublicSite.jsx"
import AdminApp from "./AdminApp.jsx"

const ADMIN_PASSWORD_KEY = "fleet-admin-pw"
const ADMIN_SESSION_KEY  = "fleet-admin-session"
const DEFAULT_PASSWORD   = "fleet2024"

function AdminLogin({ onSuccess, onCancel }) {
  const [pw, setPw] = useState("")
  const [error, setError] = useState("")

  const attempt = () => {
    const stored = localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD
    if (pw === stored) { onSuccess() }
    else { setError("Wrong password. Try again."); setPw("") }
  }

  return (
    <div className="fixed inset-0 bg-indigo-950/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h2 className="text-xl font-black text-gray-900">Admin Login</h2>
          <p className="text-gray-400 text-xs mt-1">Enter your admin password</p>
        </div>
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setError("") }}
          onKeyDown={e => e.key === "Enter" && attempt()}
          placeholder="Password"
          autoFocus
          className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-violet-300 mb-3 text-center tracking-widest"
        />
        {error && <p className="text-rose-500 text-xs text-center mb-3 font-semibold">{error}</p>}
        <button
          onClick={attempt}
          className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-black rounded-2xl text-sm shadow-md mb-2 active:opacity-80"
        >
          Enter Admin Panel
        </button>
        <button
          onClick={onCancel}
          className="w-full py-2.5 text-gray-400 text-sm font-semibold"
        >
          ← Back to Public Site
        </button>
        <p className="text-center text-[10px] text-gray-300 mt-3">
          Default password: <span className="font-black text-gray-400">fleet2024</span>
        </p>
      </div>
    </div>
  )
}

export default function App() {
  // Check URL for admin flag or active session
  const [mode, setMode] = useState(() => {
    const hash   = window.location.hash
    const session = localStorage.getItem(ADMIN_SESSION_KEY)
    if (hash === "#admin" || session === "true") return "admin"
    return "public"
  })
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    if (mode === "admin") {
      window.location.hash = "#admin"
      localStorage.setItem(ADMIN_SESSION_KEY, "true")
    } else {
      if (window.location.hash === "#admin") window.location.hash = ""
      localStorage.removeItem(ADMIN_SESSION_KEY)
    }
  }, [mode])

  const enterAdmin = () => setShowLogin(true)
  const exitAdmin  = () => { setMode("public"); setShowLogin(false) }

  const handleLoginSuccess = () => {
    setShowLogin(false)
    setMode("admin")
  }

  if (mode === "admin") {
    return (
      <>
        <AdminApp onExit={exitAdmin} />
        {showLogin && (
          <AdminLogin onSuccess={handleLoginSuccess} onCancel={() => setShowLogin(false)} />
        )}
      </>
    )
  }

  return (
    <>
      <PublicSite onAdminLogin={enterAdmin} />
      {showLogin && (
        <AdminLogin onSuccess={handleLoginSuccess} onCancel={() => setShowLogin(false)} />
      )}
    </>
  )
}

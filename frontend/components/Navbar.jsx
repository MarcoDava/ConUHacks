import Link from "next/link"
import { Kanban, Home, Users, LogOut } from "lucide-react"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Kanban, label: "Kanban Board", href: "/kanban" },
  { icon: Users, label: "Team", href: "/team" },
]

export default function Navbar() {
  return (
    <nav className="w-60 h-screen bg-gray-800 text-white p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <img src="/GitTissueLogo.png" alt="GitTissue Logo" className="w-8 h-8 mr-2" />
        <h2 className="text-xl font-bold">Git Tissues</h2>
      </div>
      <ul className="flex-grow">
        {navItems.map((item) => (
          <li key={item.href} className="mb-4">
            <Link href={item.href} className="flex items-center hover:text-gray-400 transition duration-300">
              <item.icon className="mr-2" size={20} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <button className="flex items-center hover:text-gray-300">
        <LogOut className="mr-2" size={20} />
        <span>Logout</span>
      </button>
    </nav>
  )
}

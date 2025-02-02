import Link from "next/link"
import { Kanban, Home, Calendar, Users, Settings, LogOut } from "lucide-react"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Kanban, label: "Kanban Board", href: "/kanban" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export default function Navbar() {
  return (
    <nav className="w-72 h-screen bg-gray-800 text-white p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-8">PM Dashboard</h2>
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

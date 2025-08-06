import { NavLink } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', href: '/', icon: '🏠' },
  { name: 'Expenses', href: '/expenses', icon: '💳' },
  { name: 'Categories', href: '/categories', icon: '🏷️' },
  { name: 'Reports', href: '/reports', icon: '📊' },
]

function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-sm border-r border-gray-200 pt-16">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                end={item.href === '/'}
              >
                <span
                  className="mr-3 text-lg flex-shrink-0"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
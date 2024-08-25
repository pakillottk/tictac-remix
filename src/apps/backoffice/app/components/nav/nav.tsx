import { User, Calendar } from 'lucide-react';

import { NavLink } from '@remix-run/react';

const routes = [
  // {
  //   path: '/users',
  //   label: 'Usuarios',
  //   className: 'text-cyan',
  //   Icon: User,
  // },
  {
    path: '/events',
    label: 'Eventos',
    className: 'text-yellow',
    Icon: Calendar,
  },
];
export function Nav() {
  return (
    <nav className="flex h-16 w-full items-center justify-between bg-background px-4 sm:px-6 border-b-2">
      <NavLink to="/" className="flex items-center gap-2">
        {/* <MountainIcon className="h-6 w-6" /> */}
        <span className="text-lg font-bold">TIC/TAC</span>
      </NavLink>
      <ul className="flex items-center gap-4">
        {routes.map((route) => (
          <li key={route.path}>
            <NavLink
              to={route.path}
              className={({ isActive }) =>
                `flex text-blue-500 transition-colors hover:text-blue-600 data-[active=true]:font-bold ${route.className} ${isActive ? 'underline' : ''}`
              }
            >
              <route.Icon className="h-6 w-6" />
              {route.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

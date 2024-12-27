import { User, Calendar, LogOut, X, Menu } from 'lucide-react';

import { Link, NavLink } from '@remix-run/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// const routes = [
//   // {
//   //   path: '/users',
//   //   label: 'Usuarios',
//   //   className: 'text-cyan',
//   //   Icon: User,
//   // },
//   // {
//   //   path: '/events',
//   //   label: 'Eventos',
//   //   className: 'text-yellow',
//   //   Icon: Calendar,
//   // },
// ];

export interface NavProps {
  user?: {
    name: string;
    email: string;
  };
}

export function Nav({ user }: NavProps) {
  return (
    <nav className="flex h-16 w-full items-center justify-between bg-background px-4 sm:px-6 border-b-2">
      <NavLink to="/" className="flex items-center gap-2">
        {/* <MountainIcon className="h-6 w-6" /> */}
        <span className="text-lg font-bold text-blue-500">TIC/TAC</span>
      </NavLink>
      {/* <ul className="flex items-center gap-4">
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
      </ul> */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <img
              className="w-10 h-10 rounded-full"
              src={'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' + user?.name}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
          <DropdownMenuLabel>
            <span className="text-xs text-slate-300">{user?.email}</span>
          </DropdownMenuLabel>
          {/* <DropdownMenuItem>
            <Link to="/profile" className="flex gap-2 items-center">
              <User />
              Perfil
            </Link>
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to="/auth/logout" className="flex gap-2 items-center">
              <LogOut color="red" />
              Cerrar sesión
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

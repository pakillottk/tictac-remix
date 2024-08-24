import { MetaFunction, Outlet } from '@remix-run/react';
import { Nav } from '~/components/nav/nav';

export const meta: MetaFunction = () => {
  return [{ title: 'TIC/TAC Remix' }, { name: 'description', content: 'Sistema de control de accesos' }];
};

export default function Layout() {
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10">
        <Nav />
      </header>
      <main className="container mx-auto py-2">
        <Outlet />
      </main>
    </div>
  );
}

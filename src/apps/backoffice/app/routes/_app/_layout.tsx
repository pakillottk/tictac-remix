import { json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { MetaFunction, Outlet, useLoaderData } from '@remix-run/react';
import { Nav } from '~/components/nav/nav';
import { destroySession, getSession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (request.url.includes('/auth')) {
    return {};
  }

  const session = await getSession(request.headers.get('Cookie'));
  const userInfo = session.get('user') as {
    name: string;
    email: string;
  };
  if (!session.get('tokens') || !userInfo) {
    return redirect('/auth/login', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  }

  return json({ userInfo });
}

export const meta: MetaFunction = () => {
  return [{ title: 'TIC/TAC Remix' }, { name: 'description', content: 'Sistema de control de accesos' }];
};

export default function Layout() {
  const { userInfo } = useLoaderData<{
    userInfo: {
      name: string;
      email: string;
    };
  }>();

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10">
        <Nav user={userInfo} />
      </header>
      <main className="container mx-auto py-2">
        <Outlet />
      </main>
    </div>
  );
}

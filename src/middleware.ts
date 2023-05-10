import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session/edge';
import { ironOptions } from './lib/AuthSession/Config';
import { API_URL } from "./lib/api";

export const middleware = async (req: NextRequest, res: NextResponse) => {
  const session = await getIronSession(req, res, ironOptions) as any;
  const response = NextResponse.next()

  if (!session){
    return NextResponse.redirect(new URL('/auth-portal', req.url));
  }

  if (session.user === undefined || session.user === null){
    return NextResponse.redirect(new URL('/auth-portal', req.url));
  }

  if (session.user.jwt === undefined || session.user.jwt === null){
    return NextResponse.redirect(new URL('/auth-portal', req.url));
  }

  //checkear jwt, si es valido next y si no borrar sesión y redirect
  const isValid = await fetch(`${API_URL}/user/checkToken`,{
    method: 'POST',
    body: JSON.stringify({
      token: session.user.jwt
    })
  })

  if (!isValid.ok){
    session?.destroy()
    return NextResponse.redirect(new URL('/auth-portal', req.url));
  }
  return response;
}

export const config = {
  matcher: ['/protected/:path*'],
}

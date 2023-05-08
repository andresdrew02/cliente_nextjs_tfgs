import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    let cookie = req.cookies.get('jwt')?.value
    console.log(cookie)
    if (cookie === undefined || cookie === null){
      const errorUrl = new URL('/error/errorPage?msg=No esta autorizado a realizar esta accion&code=401', req.url)
      return NextResponse.redirect(errorUrl)
    }

    return NextResponse.next()
  }
  
  // Here you can specify all the paths for which this middleware function should run
  // Supports both a single string value or an array of matchers
  export const config = {
    matcher: ['/protected/:path*'],
  }
  
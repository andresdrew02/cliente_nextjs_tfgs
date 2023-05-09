import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, res: NextResponse) {
    return NextResponse.next()
  }
  
  // Here you can specify all the paths for which this middleware function should run
  // Supports both a single string value or an array of matchers
  export const config = {
    matcher: ['/protected/:path*'],
  }
  
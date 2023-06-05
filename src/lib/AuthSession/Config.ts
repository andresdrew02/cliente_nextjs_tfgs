//Config.ts
export const ironOptions = {
    cookieName: 'crearte_cookie',
    password: process.env.COOKIE_PASSWORD as string,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production" ? true: false,
        maxAge: 1209600000 - 60
    }
}
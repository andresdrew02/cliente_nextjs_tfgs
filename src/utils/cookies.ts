import { setCookie, destroyCookie, parseCookies} from 'nookies'

export function setLocalCookie(jwt : string){
    setCookie(null, 'jwt', jwt, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/'
    })
}

export function getLocalCookie(){
    const cookies = parseCookies()
    return cookies.jwt
}

export function removeLocalCookie(){
    destroyCookie(null,"jwt",{
        path:'/'
    })
}

export function logout(){
    if (window.confirm('¿Está seguro de que desea de cerrar sesión?')){
        removeLocalCookie()
    }else{
        return false
    }
    return true
}
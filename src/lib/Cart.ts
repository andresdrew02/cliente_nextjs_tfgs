import { uuid } from 'uuidv4';

export type CartItems = {
    items: CartItem[]
}

export type CartItem = {
    id: number
    cantidad: number
    uid: string
}

export function addToCart(id: number, cantidad: number = 1){
    addToLocalCart(id,cantidad)
    const badgeDom = document.getElementById("badge-carrito")
    if (badgeDom !== null){
        const cart = getLocalCart()
        badgeDom.textContent = !cart ? "0" : cart.items.length.toString()
    }
}

export function deleteFromLocalCart(id: string){
    if (typeof window !== "undefined"){
        const cartItems = getLocalCart()
        if (cartItems === undefined || cartItems === null) return
        const newItems = cartItems.items.filter(e => e.uid !== id)
        localStorage.setItem('cart',JSON.stringify({
            items: newItems
        }))
    }
}

export function deleteLocalCart(){
    if (typeof window !== "undefined"){
        localStorage.removeItem('cart')
    }
}

export function getLocalCart(){
    if (typeof window !== "undefined"){
        const stringItems = localStorage.getItem('cart')
        const cartItems: CartItems | null = stringItems === null ? null : JSON.parse(stringItems)
        return cartItems
    }
}

function addToLocalCart(id:number, cantidad: number){
    if (typeof window !== "undefined"){
        const cartItem: CartItem = {
            id: id,
            cantidad: cantidad,
            uid: uuid()
        }
        const cartItems = getLocalCart()
        if (cartItems === undefined || cartItems === null){
            localStorage.setItem('cart',JSON.stringify({
                items: [cartItem]
            }))
        }else{
            cartItems.items.push(cartItem)
            localStorage.setItem('cart',JSON.stringify(cartItems))
        }
    }
}
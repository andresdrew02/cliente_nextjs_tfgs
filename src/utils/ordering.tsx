export function orderByNameAsc(ofertas : Oferta[]){
    ofertas.sort((a, b) => a.attributes.nombre.toUpperCase().localeCompare(b.attributes.nombre.toUpperCase()))
    return ofertas
}

export function orderByNameDesc(ofertas: Oferta[]){
    ofertas.sort((a, b) => b.attributes.nombre.toUpperCase().localeCompare(a.attributes.nombre.toUpperCase()))
    return ofertas
}

export function orderByPriceDesc(ofertas: Oferta[]){
    ofertas.sort((a,b) => b.attributes.precio_oferta - a.attributes.precio_oferta)
    return ofertas
}

export function orderByPriceAsc(ofertas: Oferta[]){
    ofertas.sort((a,b) => a.attributes.precio_oferta - b.attributes.precio_oferta)
    return ofertas
}

export function evaluateOrder(order: string | null | undefined, ofertas: Oferta[]){
    if (order === undefined || order === null) return ofertas
    if (ofertas === undefined) return ofertas
    switch(order){
        case 'ofasc':
            return orderByNameAsc(ofertas)
        case 'ofdesc':
            return orderByNameDesc(ofertas)
        case 'caras':
            return orderByPriceDesc(ofertas)
        case 'baratas':
            return orderByPriceAsc(ofertas)
    }
    return ofertas
}
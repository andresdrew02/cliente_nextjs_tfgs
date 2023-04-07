interface Oferta{
    id: number,
    attributes:{
        stock: number,
        descripcion:string,
        nombre:string,
        precio_oferta:number,
        producto: Producto | any,
        tienda: Tienda
    },
    fotos:any
}

interface OfertaItems extends Array<Oferta>{}
interface Oferta{
    id: number,
    attributes:{
        stock: number,
        descripcion:string,
        nombre:string,
        precio_oferta:number,
        productos: {
            data: Producto[]
        },
        tienda: Tienda
    },
    fotos:any
}

interface OfertaItems extends Array<Oferta>{}
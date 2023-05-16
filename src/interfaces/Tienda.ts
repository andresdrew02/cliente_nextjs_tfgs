interface Tienda{
    id: number,
    data:{
        attributes: {
            nombre: string,
            descripcion:string
            slug: string
            admin_tienda:{
                data:{
                    id: number
                    attributes: {
                        username: string
                    }
                }
            }
        }
    }
}
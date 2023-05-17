interface Tienda{
    id: number,
    data:{
        attributes: {
            nombre: string,
            descripcion:string
            slug: string
            telefono: string | null
            email: string | null
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
interface Tienda{
    data:{
    id: number
        attributes: {
            nombre: string,
            descripcion:string
            slug: string
            telefono: string | null
            email: string | null
            valoraciones: {
                data: any[]
            }
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
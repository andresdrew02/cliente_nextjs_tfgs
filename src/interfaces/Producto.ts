interface Producto {
    id: number,
    attributes:{
        categoria: {
            data:{
                attributes:{
                    createdAt: string,
                    description: string,
                    titulo: string,
                    updatedAt: string
                }
            }
        }
        descripcion: string
        nombre: string
        precio_unidad: number
        updatedAt: string
        createdAt: string
    }
}
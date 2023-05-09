type UserProps = {
    id: number
    username: string
    email: string
    nombre_completo: string
    fecha_nacimiento: string
    avatar: string | null
    recien_creada: string | null
    direccion: DirectionProps | null
}

type DirectionProps = {
    calle:string,
    tipo_via:string,
    numero:number,
    cp:number,
    ciudad:string,
    poblacion:string,
    pais:string,
    portal:string | null
}

export default interface Usuario{
    data: UserProps | null
}
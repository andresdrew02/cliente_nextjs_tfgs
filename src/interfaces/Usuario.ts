type UserProps = {
    id: number
    username: string
    email: string
    nombre_completo: string
    fecha_nacimiento: string
    avatar: string | null
    recien_creada: string | null
}

export default interface Usuario{
    data: UserProps | null
}
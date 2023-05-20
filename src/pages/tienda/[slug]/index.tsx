import { useRouter } from "next/router";
import { getServerSideProps } from "../../market";
import Usuario from "@/interfaces/Usuario";
import PlantillaNavFooter from "@/components/plantillas/PlantillaNavFooter";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { Center, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import DetalleTienda from "@/components/DetalleTienda";

export default function Tienda({ user }: { user: Usuario | null }) {
    const router = useRouter()
    const [tienda, setTienda] = useState<Tienda>()
    const [ofertas, setOfertas] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [editable, setEditable] = useState<boolean>(false)
    const { slug } = router.query

    if (!slug) {
        router.push('/error/errorPage?msg=Para%20buscar%20una%20tienda,%20necesita%20poner%20el%20código%20del%20la%20tienda')
    }
    const getTienda = async () => {
        setLoading(true)
        const tienda = await (await fetch(`${API_URL}/tiendas/${slug}`)).json()
        if (tienda.data === null) {
            router.push('/error/errorPage?code=404&msg=No%20se%20ha%20encontrado%20la%20tienda')
            return
        }
        setTienda(tienda)
        setOfertas(tienda.meta)
        if (tienda?.data.attributes.admin_tienda.data.id === user?.data?.id) {
            setEditable(true)
        }
        setLoading(false)
    }

    useEffect(() => {
        getTienda()
    }, [])

    return (
        <PlantillaNavFooter user={user}>
            {loading &&
                <Center p={10}>
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                </Center>}
            {!loading &&
                <DetalleTienda tienda={tienda} ofertas={ofertas} isEditable={editable} />
            }
        </PlantillaNavFooter>
    )
}

export { getServerSideProps }
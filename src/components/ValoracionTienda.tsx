
import { useState } from "react";
import { Box, Textarea, Flex, Button, useToast } from "@chakra-ui/react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/router";

function ValoracionTienda({tienda}:{tienda: Tienda | undefined}) {
    const [valoracion, setValoracion] = useState<number>(0);
    const [comentario, setComentario] = useState<string>("");
    const toast = useToast()
    const router = useRouter()

    const handleClick = (rating: any) => {
        setValoracion(rating);
    };

    const handleSubmit = async () => {
        if (!valoracion){
            toast({
                title: 'El número de estrellas es obligatorio',
                duration: 1500,
                isClosable: false,
                status: 'error'
            })
            return
        }
        if (!comentario || comentario.length <= 0 || comentario.trim() === ''){
            toast({
                title: 'El comentario no puede estar vacío',
                duration: 1500,
                isClosable: false,
                status: 'error'
            })
            return
        }
        //enviar
        const res = await fetch(`/api/crearValoracion`,{
            method: 'POST',
            body: JSON.stringify({
                valoracion: valoracion,
                comentario: comentario,
                slug: tienda?.data.attributes.slug
            })
        })
        if (res.status === 200){
            toast({
                title: 'Se ha registrado su valoración',
                duration: 1500,
                isClosable: false,
                status: 'success'
            })
            //recargar página
            router.reload()
        }
        if (res.status === 403){
            toast({
                title: 'Debes iniciar sesión para poder valorar una tienda',
                duration: 1500,
                isClosable: false,
                status: 'error'
            })
        }
        if (res.status === 400){
            toast({
                title: 'Ha ocurrido un error al registrar la valoración',
                duration: 1500,
                isClosable: false,
                status: 'error'
            })
        }
    };

    return (
        <Box>
            <Box display={'flex'}>
                {[...Array(5)].map((star, i) => {
                    const ratingValue = i + 1;
                    return (
                        <label key={i}>
                            <input
                                type="radio"
                                name="rating"
                                value={ratingValue}
                                onClick={() => handleClick(ratingValue)}
                            />
                            {valoracion >= ratingValue ? (
                                <FaStar color="yellow" />
                            ) : (
                                <FaRegStar color="gray" />
                            )}
                        </label>
                    );
                })}
            </Box>
            <Box mt="2">
                <Textarea
                    placeholder="Escribe tu comentario aquí"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                />
            </Box>
            <Flex mt="2" justifyContent="flex-end">
                <Button colorScheme="blue" onClick={handleSubmit}>
                    Enviar
                </Button>
            </Flex>
        </Box>
    );
}
export default ValoracionTienda;

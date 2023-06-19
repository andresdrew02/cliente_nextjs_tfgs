import { Box, Flex, Image, Text } from "@chakra-ui/react";
import {
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    HStack,
    Avatar,
    AvatarBadge,
    IconButton,
    Center,
} from '@chakra-ui/react';
import { FormEvent, useState } from "react";
import Usuario from "@/interfaces/Usuario";
import {
    updateProfilePicture,
} from "@/lib/api";
import Error from "@/components/Error";
import Success from "@/components/Success";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CountrySelector } from "./CountrySelector";

export default function ProfileForm({ user, jwt }: { user: Usuario, jwt: string }) {
    const [okay, setOkay] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [formError,setFormError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [files, setFiles] = useState<any>();
    const router = useRouter()

    const {
        register,
        handleSubmit: onSubmitHandler,
        formState: { errors },
    } = useForm();

    const handleSubmit = async (event: FormEvent) => {
        setOkay(false);
        setError(false);
        setLoading(true);
        event.preventDefault();
        const ok = await updateProfilePicture(files, jwt, user);
        if (ok) {
            setOkay(true);
            router.push('/api/update?redirect=/protected/profile')
        } else {
            setError(true);
        }
        setLoading(false);
    };

    const updateHandler = async (data: Object) => {
        let errorStatus = false
        for (const [key, value] of Object.entries(data)) {
            if (value === '') {
                errorStatus = true
                if (key === 'portal') {
                    errorStatus = false
                }
            }
        }
        if (errorStatus){
            return
        }
        
        const res = await fetch('/api/edit-profile',{
            method: 'POST',
            body: JSON.stringify(data)
        })

        if (res.ok){
            router.push('/api/update?redirect=/protected/profile')
        }else{
            router.push('/error/errorPage?msg=Ha%20ocurrido%20un%20error%20inesperado')
        }

    }

    return (
        <Flex justifyContent='center' gap='5rem' p={10} flexDirection={['column', 'column', 'row']} boxShadow='md'>
            {error && (
                <Error msg="La subida del archivo no se ha podido realizar, inténtelo de nuevo mas tarde." />
            )}
            {formError && (
                <Error msg="Ha ocurrido un error al editar el perfil" />
            )}
            {okay && <Success msg="Foto de perfil cambiada correctamente" />}
            <Box p={10} display='flex' flexDirection='column' gap='1rem'>
                <Box w='full' display='flex' justifyContent='center' alignItems='center'>
                    <Image
                        borderRadius='full'
                        boxSize='150px'
                        fit='cover'
                        src={
                            user.data?.avatar === null
                                ? "http://127.0.0.1:1337/uploads/default_avatar_94abc249c2.jpg"
                                : `http://127.0.0.1:1337${user.data?.avatar}`
                        }
                        alt={`Foto de perfil de ${user.data?.username}`}
                    />
                </Box>
                <form
                    onSubmit={(e) => handleSubmit(e)}
                    className="flex flex-col gap-4"
                >
                    <input
                        id="foto"
                        type="file"
                        className="file-input file-input-bordered w-full max-w-xs"
                        onChange={(e) => setFiles(e.target.files)}
                    />
                    <input
                        type="submit"
                        className="btn"
                        value={loading ? "Cargando..." : "Establecer foto de perfil"}
                        disabled={loading}
                    />
                </form>
            </Box>
            <form onSubmit={onSubmitHandler(updateHandler)}>
                <Flex
                    justify={'center'}
                    w={['sm', 'md', 'xl']}>
                    <Stack
                        spacing={4}
                        w={'full'}
                        rounded={'xl'}>
                        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                            Editar perfil
                        </Heading>
                        <FormControl id="userName" isRequired>
                            <FormLabel>Usuario</FormLabel>
                            <Input
                                placeholder="Usuario"
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                                defaultValue={user.data?.username}
                                disabled
                            />
                        </FormControl>
                        <FormControl id="nombre" isRequired>
                            <FormLabel>Nombre</FormLabel>
                            <Input
                                placeholder="Nombre"
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                                defaultValue={user.data?.nombre_completo}
                                {...register("nombre_completo", {
                                    required: "Debe de introducir su nombre completo",
                                })}
                            />
                            {!errors?.nombre_completo ? (
                                ""
                            ) : (
                                <h1 className="text-red-600 text-sm">{errors?.nombre_completo.message?.toString()}</h1>
                            )}
                        </FormControl>
                        <Stack>
                            <FormLabel>
                                Pais <span className="text-red-600">*</span>
                            </FormLabel>
                            <select
                                className="select select-bordered w-full max-w-s"
                                {...register("pais")}
                            >
                                <CountrySelector />
                            </select>
                            <p className="mt-2 mb-2 text-gray-500 font-bold">Dirección</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <FormLabel>
                                        Ciudad <span className="text-red-600">*</span>
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        borderColor="blue.200"
                                        {...register("ciudad", {
                                            required: "Debe de introducir su ciudad",
                                        })}
                                        defaultValue={user.data?.direccion?.ciudad}
                                    />
                                    {!errors?.ciudad ? (
                                        ""
                                    ) : (
                                        <h1 className="text-red-600 text-sm">{errors?.ciudad.message?.toString()}</h1>
                                    )}
                                </div>
                                <div>
                                    <FormLabel>Población <span className="text-red-600">*</span></FormLabel>
                                    <Input
                                        type="text"
                                        borderColor="blue.200"
                                        {...register("poblacion", {
                                            required: "Debe de introducir su población"
                                        })}
                                        onClick={(e) => console.log(e)}
                                        defaultValue={user.data?.direccion?.poblacion}
                                    />
                                    {!errors?.poblacion ? (
                                        ""
                                    ) : (
                                        <h1 className="text-red-600 text-sm">
                                            {errors?.poblacion.message?.toString()}
                                        </h1>
                                    )}
                                </div>
                                <div>
                                    <FormLabel>
                                        Tipo de via <span className="text-red-600">*</span>
                                    </FormLabel>
                                    <select
                                        className="select select-bordered w-full max-w-s"
                                        {...register("via")}
                                        defaultValue={user.data?.direccion?.tipo_via}
                                    >
                                        <option value="calle">Calle</option>
                                        <option value="plaza">Plaza</option>
                                        <option value="callejon">Callejón</option>
                                        <option value="urbanizacion">Urbanización</option>
                                    </select>
                                    {!errors?.via ? (
                                        ""
                                    ) : (
                                        <h1 className="text-red-600 text-sm">{errors?.via.message?.toString()}</h1>
                                    )}
                                </div>
                                <div>
                                    <FormLabel>
                                        Nombre de via <span className="text-red-600">*</span>
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        borderColor="blue.200"
                                        {...register("calle", {
                                            required: "Debe de introducir que nombre via",
                                        })}
                                        defaultValue={user.data?.direccion?.calle}
                                    />
                                    {!errors?.calle ? (
                                        ""
                                    ) : (
                                        <h1 className="text-red-600 text-sm">{errors?.calle.message?.toString()}</h1>
                                    )}
                                </div>
                                <div>
                                    <FormLabel>
                                        Número <span className="text-red-600">*</span>
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        borderColor="blue.200"
                                        {...register("num", {
                                            required: "Debe de introducir su número de dirección",
                                        })}
                                        defaultValue={user.data?.direccion?.numero}
                                    />
                                    {!errors?.num ? (
                                        ""
                                    ) : (
                                        <h1 className="text-red-600 text-sm">{errors?.num.message?.toString()}</h1>
                                    )}
                                </div>
                                <div>
                                    <FormLabel>
                                        Código postal <span className="text-red-600">*</span>
                                    </FormLabel>
                                    <Input
                                        type="number"
                                        borderColor="blue.200"
                                        {...register("cp", {
                                            required: "Debe de introducir su código postal",
                                        })}
                                        defaultValue={user.data?.direccion?.cp}
                                    />
                                    {!errors?.cp ? (
                                        ""
                                    ) : (
                                        <h1 className="text-red-600 text-sm">{errors?.cp.message?.toString()}</h1>
                                    )}
                                </div>
                                <div>
                                    <FormLabel optionalIndicator>Portal</FormLabel>
                                    <Input type="text" borderColor="blue.200" {...register("portal")} defaultValue={user.data?.direccion?.portal || ''} />
                                    {!errors?.portal ? (
                                        ""
                                    ) : (
                                        <h1 className="text-red-600 text-sm">{errors?.portal.message?.toString()}</h1>
                                    )}
                                </div>
                            </div>
                        </Stack>
                        <Stack spacing={6} direction={['column', 'row']}>
                            <Button
                                type="submit"
                                bg={'blue.400'}
                                color={'white'}
                                w="full"
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Modificar datos
                            </Button>
                        </Stack>
                    </Stack>
                </Flex>
            </form>
        </Flex>
    )
}
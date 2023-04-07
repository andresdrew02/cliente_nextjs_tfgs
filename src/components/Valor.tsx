import Image from 'next/image'

export default function Valor({img, titulo,valor}: {img: any,titulo:string, valor: string}) {
  return (
    <div className="flex-col w-full">
        <div className="grid p-10 flex-grow card bg-base-300 rounded-box place-items-center h-[550px]">
            <Image src={img} alt='Icono' className='w-4/5'/>
            <div className='mt-4'>
                <h1 className='text-3xl font-bold text-center'> {titulo}</h1>
                <p className='mt-2'>{valor}</p>
            </div>
        </div>
    </div>
  )
}

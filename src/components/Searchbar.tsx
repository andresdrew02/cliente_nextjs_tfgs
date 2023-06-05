import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
import { AiFillFilter } from "react-icons/ai";

export default function Searchbar({
  cb,
  maxPrecio,
  order,
  categorias
}: {
  cb: Function;
  order: Function
  maxPrecio: number;
  categorias: string[]
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedRange, setSelectedRange] = useState<number[]>([0, maxPrecio]);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
  const orderRef = useRef<HTMLSelectElement>(null)

  const searchHandler = (event: FormEvent | null) => {
    if (event !== null) event.preventDefault()
    if (inputRef.current === null) {
      return;
    }
    cb(inputRef.current.value, selectedRange,selectedCategoria, orderRef.current === undefined || orderRef.current === null ? null : orderRef.current.value);
  }

  return (
    <form onSubmit={searchHandler}>
      <Accordion className="max-w-xl border-none" allowToggle>
        <AccordionItem className="border-none">
          <h2>
            <AccordionButton>
              <div className="flex items-center gap-5 text-md">
                <AiFillFilter />
                <p>Filtros de búsqueda</p>
              </div>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} className="bg-base-300 rounded-xl">
            <div className="flex w-full gap-4 p-4 md:flex-row flex-col">
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                Filtrar por
                <RangeSlider
                  aria-label={["min", "max"]}
                  defaultValue={[0, maxPrecio]}
                  min={0}
                  max={maxPrecio}
                  onChange={(e) => setSelectedRange(e)}
                >
                  <RangeSliderTrack bg="red.100">
                    <RangeSliderFilledTrack bg="tomato" />
                  </RangeSliderTrack>
                  <RangeSliderThumb boxSize={6} index={0}>
                    <Box color="tomato" />
                  </RangeSliderThumb>
                  <RangeSliderThumb boxSize={6} index={1}>
                    <Box color="tomato" />
                  </RangeSliderThumb>
                </RangeSlider>
                <div className="flex w-full justify-between">
                  <p>0€</p>
                  <p>
                    {selectedRange[0]}€ - {selectedRange[1]}€
                  </p>
                  <p>{maxPrecio}€</p>
                </div>
                <select className="select select-ghost w-full max-w-xs" onChange={e => setSelectedCategoria(e.target.value)}>
                  <option disabled selected>
                    Busqueda por categoría...
                  </option>
                  {categorias.map(e => <option value={e} key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <select className="select select-ghost w-full max-w-xs" onChange={e => order(e.target.value)} ref={orderRef}>
                  <option disabled selected>
                    Ordenar busqueda por...
                  </option>
                  <option value='ofasc'>Nombres de ofertas ascendentes</option>
                  <option value='ofdesc'>Nombres de ofertas descendentes</option>
                  <option value='caras'>Mas caras</option>
                  <option value='baratas'>Mas baratas</option>
                </select>
              </div>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <InputGroup className="mt-5">
        <InputLeftElement
          pointerEvents="none"
          children={
            <HiMagnifyingGlassCircle className="text-slate-400 text-4xl" />
          }
        />
        <Input
          type="text"
          placeholder="Busqueda por nombre de la oferta o por nombre de la tienda, pulse Enter para buscar..."
          rounded="lg"
          ref={inputRef}
        />
      </InputGroup>
    </form>
  );
}

import { MapPin, Calendar, Settings2, ArrowRight, X } from "lucide-react"
import { Button } from "../../../components/button"
import { useEffect, useRef, useState } from "react"
import { DateRange, DayPicker } from "react-day-picker"
import 'react-day-picker/dist/style.css'
import { format } from "date-fns"
import { cities } from "../../../lib/cities"

interface DestinationAndDateStepProps {
  isGuestsInputOpen: boolean
  eventStartAndEndDates: DateRange | undefined
  closeGuestsInput: () => void
  openGuestsInput: () => void
  setDestination: (destination: string) => void
  setEventStartAndEndDates: (dates: DateRange | undefined) => void
}

export function DestinationAndDateStep({
  closeGuestsInput,
  isGuestsInputOpen,
  openGuestsInput,
  setDestination,
  setEventStartAndEndDates,
  eventStartAndEndDates
}: DestinationAndDateStepProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [destination, setDestinationState] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const datepickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datepickerRef.current && !datepickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [datepickerRef])

  function togleDatePicker() {
    setIsDatePickerOpen(!isDatePickerOpen)
  }

  const displayedDate = eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to
    ? format(eventStartAndEndDates.from, "d' de 'LLL").concat(' até ').concat(format(eventStartAndEndDates.to, "d' de 'LLL"))
    : null

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setDestinationState(value)
    setDestination(value)
    setSuggestions(cities.filter(city => city.toLowerCase().includes(value.toLowerCase())).slice(0, 5))
  }

  const handleSuggestionClick = (suggestion: string) => {
    setDestinationState(suggestion)
    setDestination(suggestion)
    setSuggestions([])
  }

  return (
    <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
      <div className="flex items-center gap-2 flex-1 relative">
        <MapPin className="size-5 text-zinc-400" />
        <input
          disabled={isGuestsInputOpen}
          type="text"
          placeholder="Para onde você vai?"
          className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
          value={destination}
          onChange={handleInputChange}
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 bg-zinc-900 border border-zinc-700 mt-5 rounded-md shadow-shape z-10">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-lime-400 hover:text-zinc-800 "
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button disabled={isGuestsInputOpen} onClick={togleDatePicker} className="flex items-center gap-2 text-left w-[240px]">
        <Calendar className="size-5 text-zinc-400" />
        <span
          className="text-lg text-zinc-400 w-40 flex-1"
        >
          {displayedDate || 'Quando'}
        </span>
      </button>

      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div ref={datepickerRef} className="rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-lg font-semibold">Selecione a data</h2>
                <button>
                  <X className="size-5 text-zinc-400" onClick={togleDatePicker} />
                </button>
              </div>
            </div>
            <DayPicker 
              classNames={{ day_selected:"bg-lime-300 text-lime-950 hover:bg-lime-400" }} 
              mode="range" 
              selected={eventStartAndEndDates} 
              onSelect={setEventStartAndEndDates}
            />
          </div>
        </div>
      )}

      <div className="w-px h-6 bg-zinc-800" />

      {isGuestsInputOpen ? (
        <Button onClick={closeGuestsInput} variant="secondary">
          Alterar local/data
          <Settings2 className="size-5" />
        </Button>
      ) : (
        <div className="group">
          <Button onClick={openGuestsInput}>
            Continuar
            <ArrowRight className="size-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-x-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

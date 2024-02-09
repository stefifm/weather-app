'use client'
import { MdMyLocation, MdOutlineLocationOn, MdWbSunny } from 'react-icons/md'
import Searchbox from './Searchbox'
import { useState } from 'react'
import axios from 'axios'
import { loadingCityAtom, placeAtom } from '@/app/atom'
import { useAtom } from 'jotai'

interface Props {
  location?: string
}

export default function Navbar ({ location }: Props): JSX.Element {
  const [city, setCity] = useState('')
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [place, setPlace] = useAtom(placeAtom)
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom)

  async function handleInputChange (value: string): Promise<void> {
    setCity(value)
    if (value.length >= 3) {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
        )
        const sugges = res.data.list.map((item: any) => item.name as string)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setSuggestions(sugges)
        setError('')
        setShowSuggestions(true)
      } catch (error) {
        setSuggestions([])
        setError('No se encontraron resultados')
        setShowSuggestions(false)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  function handleSuggestionClick (value: string): void {
    setCity(value)
    setShowSuggestions(false)
  }

  function handleSearch (e: React.FormEvent<HTMLFormElement>): void {
    setLoadingCity(true)
    e.preventDefault()
    if (suggestions.length === 0) {
      setError('No se encontraron resultados')
      setLoadingCity(false)
    } else {
      setError('')
      setTimeout(() => {
        setLoadingCity(false)
        setPlace(city)
        setShowSuggestions(false)
      }, 500)
    }
  }

  function handleCurrentLocation (): void {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords
      try {
        setLoadingCity(true)
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
        )
        setTimeout(() => {
          setLoadingCity(false)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          setPlace(res.data.name)
        }, 500)
      } catch (error) {
        setLoadingCity(false)
      }
    })
  }

  return (
    <>
      <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white'>
        <div className='h-[80px] w-full flex justify-between items-center px-3 max-w-7xl mx-auto'>
          <div className='flex items-center justify-center gap-2'>
            <h2 className='text-gray-500 text-3xl'>Clima</h2>
            <MdWbSunny className='text-3xl mt-1 text-yellow-300' />
          </div>
          <section className='flex gap-2 items-center'>
            <MdMyLocation
              title='Ubicación actual'
              onClick={handleCurrentLocation}
              className='text-2xl text-gray-400 hover:opacity-80 cursor-pointer'
            />
            <MdOutlineLocationOn className='text-3xl cursor-pointer' />
            <p className='text-slate-900/80 text-sm'>{location}</p>
            <div className='relative hidden md:flex'>
              {/* Search Box */}
              <Searchbox
                value={city}
                onSubmit={handleSearch}
                onChange={(e) => {
                  handleInputChange(e.target.value).catch(console.error)
                }}
              />
              <SuggestionBox
                {...{
                  suggestions,
                  showSuggestions,
                  handleSuggestionClick,
                  error
                }}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className='flex max-w-7xl px-3 md:hidden'>
        <div className='relative'>
          {/* Search Box */}
          <Searchbox
            value={city}
            onSubmit={handleSearch}
            onChange={(e) => {
              handleInputChange(e.target.value).catch(console.error)
            }}
          />
          <SuggestionBox
            {...{
              suggestions,
              showSuggestions,
              handleSuggestionClick,
              error
            }}
          />
        </div>
      </section>
    </>
  )
}

function SuggestionBox ({
  suggestions,
  showSuggestions,
  handleSuggestionClick,
  error
}: {
  showSuggestions: boolean
  suggestions: string[]
  handleSuggestionClick: (suggestion: string) => void
  error: string
}): JSX.Element {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul
          className='mb-4 bg-white absolute border top-[44px] left-0
          border-gray-300 rounded-md min-w-[200px] flex
          flex-col gap-1 py-2 px-2'>
          {error && suggestions.length < 1 && <li className='text-red-500'>{error}</li>}
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => {
                handleSuggestionClick(suggestion)
              }}
              className='cursor-pointer p-1 rounded hover:bg-gray-200'>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

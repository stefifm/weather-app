'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { type WeatherData } from '../../type'
import { format, fromUnixTime, parseISO } from 'date-fns'
import Container from '@/components/Container'
import { convertKelvinToCelsius } from '@/utils/convertKelvinToCelsius'
import WeatherIcon from '@/components/WeatherIcon'
import { getDayOrNightIcon } from '@/utils/getDayOrNightIcon'
import WeatherDetails from '@/components/WeatherDetails'
import { metersToKm } from '@/utils/metersToKm'
import { convertWindSpeed } from '@/utils/convertWindSpeed'
import ForecastWeatherDetails from '@/components/ForecastWeatherDetails'
import { useAtom } from 'jotai'
import { loadingCityAtom, placeAtom } from './atom'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import WeatherSkeleton from '@/components/WeatherSkeleton'

export default function Home (): JSX.Element {
  const [place, setPlace] = useAtom(placeAtom)
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom)

  const { isPending, error, data, refetch } = useQuery<WeatherData>({
    queryKey: ['weatherData'],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      )
      return res.data
    }
  })

  useEffect(() => {
    refetch().catch((error) => {
      console.error('Error refetching', error)
    })
  }, [place, refetch])

  if (isPending) {
    return (
      <div className='flex items-center min-h-screen justify-center'>
        <p className='animate-bounce'>Cargando...</p>
      </div>
    )
  }

  if (error != null) {
    return (
      <div className='flex items-center min-h-screen justify-center'>
        <p>Error: {error.message}</p>
      </div>
    )
  }

  const firstData = data?.list[0]

  const uniqueDates = [
    ...new Set(data?.list.map((entry) => new Date(entry.dt * 1000).toISOString().split('T')[0]))
  ]

  const firstDateForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split('T')[0]
      const entryTime = new Date(entry.dt * 1000).getHours()
      return entryDate === date && entryTime >= 6
    })
  })

  return (
    <>
      <Navbar location={data?.city.name} />
      <main className='px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4'>
        {loadingCity ? (
          <WeatherSkeleton />
        ) : (
          <>
            {/* today data */}
            <section className='space-y-4'>
              <div className='space-y-2'>
                <h2 className='flex gap-1 text-2xl items-end'>
                  <span>{format(parseISO(firstData?.dt_txt ?? ''), 'EEEE')}</span>
                  <span className='text-lg'>
                    {format(parseISO(firstData?.dt_txt ?? ''), 'dd.MM.yyyy')}
                  </span>
                </h2>
                <Container className='gap-10 px-6 items-center'>
                  {/* temperatura */}
                  <div className='flex flex-col px-4'>
                    <span className='text-5xl'>
                      {convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}º
                    </span>
                    <p className='text-xs space-x-1 whitespace-nowrap'>
                      <span>Feels Like</span>
                      <span>{convertKelvinToCelsius(firstData?.main.feels_like ?? 296.37)}º</span>
                    </p>
                    <p className='text-xs space-x-2'>
                      <span>{convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}º⬇️</span>
                      <span>{convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}º⬆️</span>
                    </p>
                  </div>
                  {/* time and weather icon */}
                  <div className='flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3'>
                    {data?.list.map((d, index) => (
                      <div
                        key={index}
                        className='flex flex-col justify-between items-center gap-2 text-xs font-semibold'>
                        <p className='whitespace-nowrap'>{format(parseISO(d.dt_txt), 'h:mm a')}</p>
                        <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)} />
                        <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}º</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className='flex gap-4'>
                {/* left */}
                <Container className='w-fit justify-center flex-col px-4 items-center'>
                  <p className='capitalize text-center'>{firstData?.weather[0].description}</p>
                  <WeatherIcon
                    iconName={getDayOrNightIcon(
                      firstData?.weather[0].icon ?? '',
                      firstData?.dt_txt ?? ''
                    )}
                  />
                </Container>
                {/* right */}
                <Container className='bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto'>
                  <WeatherDetails
                    visibility={metersToKm(firstData?.visibility ?? 10000)}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    humidity={`${firstData?.main.humidity}%`}
                    windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
                    sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702949452), 'H:mm')}
                    sunset={format(fromUnixTime(data?.city.sunset ?? 1702949452), 'H:mm')}
                  />
                </Container>
              </div>
            </section>
            {/* 7 day forecast */}
            <section className='flex w-full flex-col gap-4'>
              <p className='text-2xl'>Forecast (7 days)</p>
              {firstDateForEachDate.map((d, index) => (
                <ForecastWeatherDetails
                  key={index}
                  weatherIcon={d?.weather[0].icon ?? '02d'}
                  date={format(parseISO(d?.dt_txt ?? ''), 'dd.MM')}
                  day={format(parseISO(d?.dt_txt ?? ''), 'EEEE')}
                  temp={d?.main.temp ?? 296.37}
                  feels_like={d?.main.feels_like ?? 296.37}
                  temp_min={d?.main.temp_min ?? 296.37}
                  temp_max={d?.main.temp_max ?? 296.37}
                  description={d?.weather[0].description ?? 'Clear sky'}
                  visibility={metersToKm(d?.visibility ?? 10000)}
                  humidity={`${d?.main.humidity}%`}
                  windSpeed={convertWindSpeed(d?.wind.speed ?? 1.64)}
                  airPressure={`${d?.main.pressure} hPa`}
                  sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702949452), 'H:mm')}
                  sunset={format(fromUnixTime(data?.city.sunset ?? 1702949452), 'H:mm')}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </>
  )
}

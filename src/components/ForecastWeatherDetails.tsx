import { convertKelvinToCelsius } from '@/utils/convertKelvinToCelsius'
import { type ForecastDetailProps } from '../../type'
import Container from './Container'
import WeatherIcon from './WeatherIcon'
import WeatherDetails from './WeatherDetails'

interface Props {}

export default function ForecastWeatherDetails (props: ForecastDetailProps) {
  const {
    weatherIcon = '02d',
    date = '19.09',
    day = 'Monday',
    temp,
    feels_like,
    temp_min,
    temp_max,
    description
  } = props
  return (
    <Container className='gap-4'>
      {/* left section */}
      <section className='flex gap-4 items-center px-4'>
        <div className='flex flex-col gap-1 items-center'>
          <WeatherIcon iconName={weatherIcon} />
          <p>{date}</p>
          <p className='text-sm'>{day}</p>
        </div>
        {/*  */}
        <div className='flex flex-col px-4'>
          <span className='text-5xl'>
            {convertKelvinToCelsius(temp ?? 0)}º
          </span>
          <p className='text-xs space-x-1 whitespace-nowrap'>
            <span>Feels Like</span>
            <span>{convertKelvinToCelsius(feels_like ?? 0)}º</span>
          </p>
          <p className='capitalize'>{description}</p>
        </div>
      </section>
      {/* right section */}
      <section className='overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10'>
        <WeatherDetails {...props} />
      </section>
    </Container>
  )
}

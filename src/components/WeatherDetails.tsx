import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu'
import { type WeatherDetailProps, type SingleWeatherDetailProps } from '../../type'
import { FiDroplet } from 'react-icons/fi'
import { MdAir } from 'react-icons/md'
import { ImMeter } from 'react-icons/im'

export default function WeatherDetails (props: WeatherDetailProps): JSX.Element {
  const {
    visibility = '25km',
    humidity = '50%',
    windSpeed = '5 km/h',
    airPressure = '1000 hPa',
    sunrise = '6.20',
    sunset = '18.20'
  } = props

  const weatherDetails = [
    {
      information: 'Visibility',
      icon: <LuEye />,
      value: visibility
    },
    {
      information: 'Humidity',
      icon: <FiDroplet />,
      value: humidity
    },
    {
      information: 'Wind Speed',
      icon: <MdAir />,
      value: windSpeed
    },
    {
      information: 'Air Pressure',
      icon: <ImMeter />,
      value: airPressure
    },
    {
      information: 'Sunrise',
      icon: <LuSunrise />,
      value: sunrise
    },
    {
      information: 'Sunset',
      icon: <LuSunset />,
      value: sunset
    }
  ]

  return (
    <>
      {weatherDetails.map((detail, index) => (
        <SingleWeatherDatail
          key={index}
          information={detail.information}
          icon={detail.icon}
          value={detail.value}
        />
      ))}
    </>
  )
}

function SingleWeatherDatail (props: SingleWeatherDetailProps): JSX.Element {
  return (
    <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80">
      <p className="whitespace-nowrap">{props.information}</p>
      <div className="text-3xl">{props.icon}</div>
      <p>{props.value}</p>
    </div>
  )
}

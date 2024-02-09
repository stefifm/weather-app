interface Props {}

export default function WeatherDetails ({}: Props) {
  return (
    <div>WeatherDetails</div>
  )
}

export interface SingleWeatherDetailProps {
  information: string
  icon: React.ReactNode
  value: string
}

function SingleWeatherDatail (props: SingleWeatherDetailProps): JSX.Element {
  return (
    <div>SingleWeatherData</div>
  )
}

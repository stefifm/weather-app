import { cn } from '@/utils/cn'

export default function WeatherIcon (props: React.HTMLProps<HTMLDivElement> & { iconName: string }): JSX.Element {
  return (
    <div {...props} className={cn('relative h-20 w-20', props.className)}>
      <img
        className="w-full h-full absolute"
        src={`https://openweathermap.org/img/wn/${props.iconName}@4x.png`} alt="weather-icon" />
    </div>
  )
}

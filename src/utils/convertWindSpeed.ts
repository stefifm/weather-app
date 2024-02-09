export function convertWindSpeed (speedInMetersSecond: number): string {
  const speedInKmHour = speedInMetersSecond * 3.6
  return `${speedInKmHour.toFixed(0)} km/h`
}

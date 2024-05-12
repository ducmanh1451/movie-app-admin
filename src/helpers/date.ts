// format date in database => dd/mm/yyyy
// ex: 2024-05-04T17:00:00.000Z => 05/05/2024
export const formatDateToDisplay = (date: Date | string) => {
  const dateFormat = new Date(date).toLocaleDateString('en-GB')
  return dateFormat
}

// format date (dd/mm/yyyy) in client => original date to save in database
// ex: 05/05/2024 => 2024-05-04T17:00:00.000Z
export const formatDateToSave = (date: string) => {
  const [day, month, year] = date.split('/')
  const dateFormat = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  return dateFormat
}

// subtract day from date, params: date, number of subtract
export const subtractDate = (date: Date, numberDay: number) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() - numberDay)
  return newDate
}

// format datetime to display time
export const formatTimeToDisplay = (time: string) => {
  const datetime = new Date(time)
  const hours = datetime.getHours()
  const minutes = datetime.getMinutes()

  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`

  return `${formattedHours}:${formattedMinutes}`
}


const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday", 
  "Thursday",
  "Friday",
  "Saturday"
  
]

function formatDate(mydate) {
  console.log("mydate", mydate)
  let dateObj = new Date(mydate)
  console.log(dateObj)
  let year = dateObj.getFullYear().toString()
  let month = dateObj.toLocaleString('default', { month: 'long' })
  let weekday = days[dateObj.getDay()]
  let date = dateObj.getDate()
  return weekday + " " + month + " " + date + ", " + year
}

function formatTime(mydate) {
  let dateObj = new Date(mydate)
  let time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  return time
}

module.exports = {
  formatDate,
  formatTime
}
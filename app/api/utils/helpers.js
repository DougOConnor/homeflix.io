const {models} = require('../../models')
const { Op } = require("sequelize");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday", 
  "Thursday",
  "Friday",
  "Saturday"
  
]

const formatDate = (mydate) => {
  let dateObj = new Date(mydate)
  let year = dateObj.getFullYear().toString()
  let month = dateObj.toLocaleString('default', { month: 'long' })
  let weekday = days[dateObj.getDay()]
  let date = dateObj.getDate()
  return weekday + " " + month + " " + date + ", " + year
}

const formatTime = (mydate) => {
  let dateObj = new Date(mydate)
  let time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  return time
}

const zipSettings = (settings) => {
  let zip = {}
  settings.map((setting) => {
    zip[setting.key] = setting.value
  })
  return zip
}

const readSettings = async (settings) => {
  const data = await models.settings.findAll({where: { key: { [Op.in]: settings}}})
  let converted_data = {}
  data.map((setting) => {
    let value = setting.value
    if (setting.type === 'json') {
      value = JSON.parse(value)
    } else if (setting.type === 'boolean') {
      value = value === 'true'
    } else if (setting.type === 'integer') {
      value = parseInt(value)
    } else {
      value = value
    }
    converted_data[setting.key] = value
  })
  return converted_data
}

const writeSettings = async (settings) => {
  console.log(settings)
  let converted_settings = []
  Object.keys(settings).map((setting) => {
    let value = settings[setting]
    converted_settings.push({"key": setting, "value": value})
  })
  converted_settings.map((setting) => {
    models.settings.update({"value": setting.value}, {where: {key: setting.key}})
  })
}

module.exports = {
  formatDate,
  formatTime,
  zipSettings,
  writeSettings,
  readSettings
}
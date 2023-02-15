
const nodemailer = require("nodemailer");
const fs = require('fs')
var handlebars = require('handlebars');

const { models } = require('../../models');
const sequelize = require('../../models');
const axios = require('axios')

const emailConfigPath = './data/email.json'
const infoConfigPath = './data/info.json'

const {formatDate, formatTime} = require('../../utils/helpers')

const checkEmailEnabled = () => {
    if (fs.existsSync(emailConfigPath)) {
        let data = JSON.parse(fs.readFileSync(emailConfigPath, 'utf8'))
        return data.smtp_enabled
    } else {
        return false
    }
}

const renderTemplate = (template, replacements) => {
    let html = fs.readFileSync(__dirname + "/templates/" + template, {encoding: 'utf-8'})
    var compiled_template = handlebars.compile(html);
    var htmlToSend = compiled_template(replacements);
    return htmlToSend;

}

const sendReservationConfirmation = async (showing_id, user_id) => {
    if (checkEmailEnabled()) {
        let info = JSON.parse(fs.readFileSync(infoConfigPath, 'utf8'))
        let showingData = await models.showings.findByPk(showing_id)
        let userData = await models.users.findByPk(user_id)
        let seatData = await models.reservations.findAll({where: {showing_id: showing_id, user_id: user_id}})
        let seats = []
        seatData.map( seat => {
            seats.push(seat.seat_id)
        })
        let showing_date = formatDate(showingData.showing_datetime)
        let showing_time = formatTime(showingData.showing_datetime)

        html = await renderTemplate('reservation_confirmation.html', {
            movie_title: showingData.title,
            showing_date: showing_date,
            showing_time: showing_time,
            seats: seats.join(", "),
            poster_path: "https://image.tmdb.org/t/p/w500/" + showingData.poster_path,
            theater_name: info.theaterName,
        })
        await sendEmail(
            userData.email,
            'Reservation Confirmation for ' + showingData.title + " on " + showing_date,
            html,
            "Your reservation has been confirmed.",
            null)
    }
}


const sendEmail = async (to, subject, html, text, config) => {

    let data = {}

    if (config !== null) {
        data = config
    } else {
        data = JSON.parse(fs.readFileSync(emailConfigPath, 'utf8'))
    }
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: data.smtp_server,
        port: data.smtp_port,
        secure: false, // true for 465, false for other ports
        connectionTimeout: 10000,
        auth: {
            user: data.smtp_username, // generated ethereal user
            pass: data.smtp_password, // generated ethereal password
        },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"' + data.smtp_from_display_name + '" ' + data.smtp_from_email, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    console.log(info)
    return info
  }


module.exports.sendEmail = sendEmail
module.exports.renderTemplate = renderTemplate
module.exports.sendReservationConfirmation = sendReservationConfirmation
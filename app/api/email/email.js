
const nodemailer = require("nodemailer");
const fs = require('fs')
var handlebars = require('handlebars');

const { models } = require('../../models');

const { readSettings } = require('../utils/helpers')

const {formatDate, formatTime} = require('../../utils/helpers')

const checkEmailEnabled = async () => {
    let data = await readSettings(["smtp_enabled"])
    return data.smtp_enabled === true
}

const renderTemplate = (template, replacements) => {
    let html = fs.readFileSync(__dirname + "/templates/" + template, {encoding: 'utf-8'})
    var compiled_template = handlebars.compile(html);
    var htmlToSend = compiled_template(replacements);
    return htmlToSend;

}

const sendPasswordReset = async (email, host, token) => {
    let link = "http://" + host + "/reset-password?token=" + token
    if (await checkEmailEnabled()) {
        html = await renderTemplate('reset_email.html', {
            link: link
        })
        await sendEmail(
            email,
            'Password Reset Request',
            html,
            "Reset your password here " + link,
            null)
    }
}

const sendReservationConfirmation = async (showing_id, user_id) => {
    if (await checkEmailEnabled()) {
        let info = await readSettings(["theater_name", "app_url"])
        let showingData = await models.showings.findByPk(showing_id)
        let userData = await models.user.findByPk(user_id)
        let seatData = await models.reservations.findAll({where: {showing_id: showing_id, user_id: user_id}})
        let seats = []
        seatData.map( seat => {
            seats.push(seat.seat_id)
        })
        seats.sort()
        let showing_date = formatDate(showingData.showing_datetime)
        let showing_time = formatTime(showingData.showing_datetime)

        const appUrl = (info.app_url || 'http://localhost:8080').replace(/\/$/, '')
        // Same payload the in-app ticket QR uses, so the door scanner accepts it
        const ticketPayload = JSON.stringify({
            t: "homeflix-ticket",
            showing_id: parseInt(showing_id),
            title: showingData.title,
            showing_datetime: showingData.showing_datetime,
            seats: seats,
            email: userData.email,
        })
        const qr_url = "https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=16&data=" + encodeURIComponent(ticketPayload)

        html = await renderTemplate('reservation_confirmation.html', {
            movie_title: showingData.title,
            showing_date: showing_date,
            showing_time: showing_time,
            seats: seats.join(" · "),
            poster_path: "https://image.tmdb.org/t/p/w500/" + showingData.poster_path,
            theater_name: info.theater_name,
            ticket_url: appUrl + "/my-tickets/" + showing_id,
            qr_url: qr_url,
        })
        await sendEmail(
            userData.email,
            'Your tickets for ' + showingData.title + " — " + showing_date,
            html,
            "Your reservation has been confirmed. Seats: " + seats.join(", "),
            null)
    }
}


// From header: prefer the configured display name, fall back to the theater
// name, and never render a literal "null".
const buildFrom = async (data) => {
    let fromName = data.smtp_from_name
    if (!fromName || fromName === 'null') {
        const info = await readSettings(["theater_name"])
        fromName = info.theater_name || null
    }
    if (fromName) {
        return '"' + fromName.replace(/"/g, '') + '" <' + data.smtp_from_email + '>'
    }
    return data.smtp_from_email
}

const sendEmail = async (to, subject, html, text, config) => {

    let data = {}

    if (config !== null && config !== undefined) {
        data = config
    } else {
        data = await readSettings(["smtp_server", "smtp_port", "smtp_username", "smtp_password", "smtp_from_name", "smtp_from_email"])
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
        from: await buildFrom(data), // sender address
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
module.exports.buildFrom = buildFrom
module.exports.renderTemplate = renderTemplate
module.exports.sendReservationConfirmation = sendReservationConfirmation
module.exports.sendPasswordReset = sendPasswordReset
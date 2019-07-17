'use strict'
const nodemailer = require( 'nodemailer' )
const winston = require( '../../config/logger' )

let initOk = false

let transporter = nodemailer.createTransport( {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMPT_USERNAME,
    pass: process.env.SMPT_PASSWORD,
  }
} )

transporter.verify( ( err, success ) => {
  if ( err )
    winston.debug( err )
  else {
    initOk = true
    winston.debug( 'Email service is intialised.' )
  }
} )


exports.SendEmailVerification = ( { name, email, token } ) => {

  let message = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: `Speckle Password reset for your account on ${process.env.SERVER_NAME}`,
    text: `
      Hello ${name},

      Please verify your speckle account on ${process.env.SERVER_NAME} (${process.env.CANONICAL_URL}) by clicking on the following link:

      ${process.env.CANONICAL_URL}/api/accounts/verify/${token}

      If any problems, do get in touch via the forum (https://discourse.speckle.works).

      Best regards,
      Speckle

      ---
      Speckle is the open source data platform for AEC.

      > https://speckle.works
      > https://twitter.com/speckle_works

    `,
    html: `
      Hello ${name},
      <br>
      <br>
      We're happy you're on board! There's just a bit of house-keeping to take care of. Complete your registration by verifying your speckle account on ${process.env.SERVER_NAME} (${process.env.CANONICAL_URL}) by clicking on <a href="${process.env.CANONICAL_URL}/api/accounts/verify/${token}">this link.</a> If that doesn't work, copy paste it in your browser of choice:
      <br>
      <br>
      <pre>${process.env.CANONICAL_URL}/api/accounts/verify/${token}</pre>
      <br>
      <br>
      If you have any problems or questions, do get in touch via <a href="https://discourse.speckle.works">the forum</a>.
      <br>
      <br>
      Best regards,<br>
      Speckle
      <br>
      ---<br>
      <img src="https://speckle.systems/speckle-min.png">
      <br>
      Speckle is the open source data platform for architecture, engineering, and construction.
      <br>
      > https://speckle.works <br>
      > https://twitter.com/speckle_works <br>
    `
  }

  transporter.sendMail( message, ( err ) => {
    if(err) {
      winston.debug( 'OUPS ERRROROR')
      console.log( err )
      winston.debug( err )
    } else {
      winston.debug( 'email sent?')
      winston.debug( message )
    }
  } )
}

exports.SendPasswordReset = ( token ) => {

}

exports.default = {}

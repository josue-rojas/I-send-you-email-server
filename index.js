const express = require('express');
const nodemailer = require('nodemailer');
const parser = require('body-parser');
// http://excellencenodejsblog.com/express-nodemailer-sending-mails/
const hbs = require('nodemailer-express-handlebars');

var options = {
     viewEngine: {
         extname: '.hbs',
         layoutsDir: 'views/email/',
         defaultLayout : 'template',
         partialsDir : 'views/partials/'
     },
     viewPath: 'views/email/',
     extName: '.hbs'
 };
const app = express();
app.use(parser.json());
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var SCOPES = ['https://mail.google.com/'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';
// ENV VARIABLES NEEDED
var CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
var CLIENT_ID = process.env.GMAIL_CLIENT_ID;
var REDIRECT_URIS = process.env.GMAIL_REDIRECT_URIS;
var EMAIL = process.env.EMAIL;
var REFRESH_TOKEN = process.env.G_REFRESH_TOKEN;
var ACCESS_TOKEN = process.env.G_ACCESS_TOKEN;
var EXPIRE = process.env.G_EXPIRE;


app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

function sendMail(emailTo, subject, text){
  console.log(emailTo)
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
          user: EMAIL,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: ACCESS_TOKEN,
          expires: EXPIRE
    }
  });
  transporter.use('compile', hbs(options));
  var mailOptions = {
      from: EMAIL,
      to: emailTo,
      subject: subject,
      template: 'email',
      context: {email: emailTo, subject: subject, text:text}
    };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log('Email sent: ' + info.response);
      return true;
    }
  });
}

app.get('/*', (req, res) => {
  res.redirect('http://josuerz.xyz/I-send-you-email-front/')
})

app.post('/email', (req, res) => {
  // console.log(req.body);
  // console.log(res.body)
  sendMail(req.body.email, req.body.subject, req.body.message);
  res.send('send');
});



app.listen(process.env.PORT);
console.log('listening on port '+process.env.PORT)

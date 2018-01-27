const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
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


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// // google authoriaze modified for env
// function authorize_email(emailTo, subject, text) {
//   var clientSecret = CLIENT_SECRET;
//   var clientId = CLIENT_ID;
//   var redirectUrl = REDIRECT_URIS;
//   var auth = new googleAuth();
//   var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
//
//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, function(err, token) {
//     if (err) {
//       getNewToken(oauth2Client, sendMail, emailTo, subject, text);
//     } else {
//       oauth2Client.credentials = JSON.parse(token);
//       sendMail(oauth2Client, emailTo, subject, text);
//     }
//   });
// }
//
// // SAME AS GOOGLE EXAMPLE
// function getNewToken(oauth2Client, callback, emailTo, subject, text) {
//   var authUrl = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES
//   });
//   console.log('Authorize this app by visiting this url: ', authUrl);
//   var rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });
//   rl.question('Enter the code from that page here: ', function(code) {
//     rl.close();
//     oauth2Client.getToken(code, function(err, token) {
//       if (err) {
//         console.log('Error while trying to retrieve access token', err);
//         return;
//       }
//       oauth2Client.credentials = token;
//       storeToken(token);
//       callback(oauth2Client, emailTo, subject, text);
//     });
//   });
// }
//
// // same as google
// function storeToken(token) {
//   try {
//     fs.mkdirSync(TOKEN_DIR);
//   } catch (err) {
//     if (err.code != 'EEXIST') {
//       throw err;
//     }
//   }
//   fs.writeFile(TOKEN_PATH, JSON.stringify(token));
//   console.log('Token stored to ' + TOKEN_PATH);
// }

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
  var mailOptions = {
      from: EMAIL,
      to: emailTo,
      subject: subject,
      text: text
    };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

app.get('/*', (req, res) => {
  res.redirect('http://josuerz.xyz/I-send-you-email-front/')
})

app.post('/email', (req, res) => {
  sendMail('josuerojas.rojas@gmail.com', 'nothing', 'hahahahahah\nthis shoudl be a new line');
  res.send('send');
});



app.listen(process.env.PORT);
console.log('listening on port '+process.env.PORT)

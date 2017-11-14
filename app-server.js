
// app-server.js
var express = require('express');
var bodyParser = require('body-parser');  
var nodemailer = require('nodemailer');
var app = express();
app.set('port', process.env.PORT || 3000)
app.use(express.static(__dirname))
app.use(bodyParser.json())
var http = require('http').Server(app)
// Route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('/sendMail', (req, res) => {
  /*** Send Email  */
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gaung717@gmail.com',
      pass: '80080pitu-o'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  let HelperOptions = {
    from: '"Indra" <gaung717@gmail.com>',
    to: 'indra@neo-fusion.com',
    subject: 'tes',
    text: 'tes kirim dengan nodemail'
  };
  
  /*** Send Email  */
  transporter.sendMail(HelperOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("The message was sent!");
    console.log(info);
  });
})

http.listen(app.get('port'), () => {
  console.log('Conference App listening on ' + app.get('port'))
})

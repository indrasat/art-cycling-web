
// app-server.js
var express = require('express');
var bodyParser = require('body-parser');  
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var app = express();
app.set('port', process.env.PORT || 3000)
app.use(express.static(__dirname))
app.use(bodyParser.json())
var http = require('http').Server(app)

  /*** Send Email  */
  var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: 'gaung717@gmail.com', // my mail
        pass: '80080pitu-o'
    }
  }));  
  let HelperOptions = {
    from: '"Indra" <gaung717@gmail.com>',
    to: 'indra@neo-fusion.com',
    subject: 'tes',
    text: 'tes kirim dengan nodemail'
  };
  // Route
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  })

  app.get('/sendmail', (req, res) => {  
    /*** Send Email  */
    transporter.sendMail(HelperOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.json({yo: error});
      }
      console.log("The message was sent!");
      console.log(info);
    });
  })


http.listen(app.get('port'), () => {
  console.log('Conference App listening on ' + app.get('port'))
})

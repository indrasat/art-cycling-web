
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

var xoauth2 = require("xoauth2"),
xoauth2gen;

xoauth2gen = xoauth2.createXOAuth2Generator({
  user: "gaung717@gmail.com",
  clientId: "21247606951-r4ak47st49f05ji53v0va9mu1p3a7fff.apps.googleusercontent.com",
  clientSecret: "NezG50AyOM3Ljm7bv7CdA-uV",
  refreshToken: "1/dCupAEK48O6p_Fh4zOXKXv5VC0Hqlo_X5Pzgyz32AOZnrIWeC_1GIIdt2N5DvfVN",
  accessToken:"ya29.GlsEBU7JNoZiyXq1dYB33GwWF7sMKHaRDRr4DMSHJOl5-YbWzjqRZuPPRb3-EhzhrHvMVMZtAXJGU0y_151RZjL2JjSBk5vY91oO3Q8ycGcApSSLmUyV9O2hVHoe"
});
  /*** Send Email  */
  var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
      xoauth2: xoauth2gen,
    },
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
      }else{
        console.log("The message was sent!");
        console.log(info);
      }

    });
  })


http.listen(app.get('port'), () => {
  console.log('Conference App listening on ' + app.get('port'))
})

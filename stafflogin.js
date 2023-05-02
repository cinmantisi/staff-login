const { MessageEmbed } = require('discord.js')
const cooldown = new Set();
const mysql = require('mysql');
const nodemailer = require('nodemailer')
const ms = require('ms')
module.exports = {
    name : 'staff-login',
    category : 'info',
    description : 'staff log',

    run : async(client, message, args) => {
        if(cooldown.has(message.author.id)) {
            message.reply('error')
        } else {  
            const staff = args[0]
            const kullanici = message.author.tag
            if(!staff) return message.reply('Giriş yapılcak bir hesap kullanıcı adı gir.')
            const habbodb = mysql.createConnection({
                host: `localhost`,
                user: `root`,
                password: `pass`,
                database: `ur database name`
            })

            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'ur email',
                pass: 'ur pass key'
              }
            });

            habbodb.query(`SELECT * FROM users WHERE username = '${staff}'` , (err, habbo) => {
                if(err) {
                    console.log(err)

                } else if (habbo[0] == undefined) {
                    message.channel.send("I can't find ur account..")
                } else if (habbo[0].rank < 5) {
                    message.channel.send('Whoops. looks like thats not a staff account')
                } else {
                                     const dogrulamakodu = Math.floor(Math.random() * 1000000)
                                    const embed = new MessageEmbed()
                                    .setColor('RED')
                                    .setTitle('2AD')
                                    .setDescription('Giriş yapılacak hesabın e-posta adresine gönderilen doğrulama kodunu "i!staff-login-onay <kod>" şeklinde yazınız.')
                                    message.channel.send(embed)
                                    habbodb.query(`UPDATE users SET dogrulama = '${dogrulamakodu}' WHERE username = '${staff}'`)

                                    var mailOptions = {
                                    from: 'example@gmail.com',
                                    to: `${habbo[0].mail}`,
                                    subject: `${staff} Adlı personel hesabınız için ${kullanici} adlı hesabın doğrulama kodu : ${dogrulamakodu}`,
                                    text: 'Kodunuzla girişi onaylayabilirsiniz.'
                                    }

                                    transporter.sendMail(mailOptions, function(error, info){
                                        if (error) {
                                          console.log(error);
                                        } else {
                                          console.log('Email sent: ' + info.response);
                                        }





                                    })
                }

        })










        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, 10); // here will be the time in miliseconds 5 seconds = 5000 miliseconds

    }

}

}

const { MessageEmbed } = require('discord.js')
const cooldown = new Set();
const mysql = require('mysql');
const ms = require('ms')
module.exports = {
    name : 'staff-login-onay',
    category : 'info',
    description : 'staff log verification',

    run : async(client, message, args) => {
        if(cooldown.has(message.author.id)) {
            message.reply('error')
        } else {
           const kod = args[0]
           const kullanici = message.author.tag
           if(!kod) return message.reply('Bir doğrulama kodu belirt.')
            const habbodb = mysql.createConnection({
                host: `localhost`,
                user: `root`,
                password: `pass`,
                database: `habbo`
            })

            habbodb.query(`SELECT * FROM users WHERE dogrulama = '${kod}'` , (err, habbo) => {
                if(err) {
                    console.log(err)

                } else if (habbo[0] == undefined) {
                    message.reply('Böyle bir doğrulama kodu bulamadım.')
                } else {
                const embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('Başarılı')
                .setDescription('Giriş yapıldı.')
                .addField('Giriş yapılan hesap', habbo[0].username)
                message.channel.send(embed)
                const dogrulamakodu = Math.floor(Math.random() * 1000000)
                habbodb.query(`UPDATE users SET staffdiscord = '${kullanici}' WHERE dogrulama = '${kod}'`)
                habbodb.query(`UPDATE users SET dogrulama = '${dogrulamakodu}' WHERE username = '${habbo[0].username}'`)
                }


        })










        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, 10); // here will be the time in miliseconds 5 seconds = 5000 miliseconds

    }

}

}

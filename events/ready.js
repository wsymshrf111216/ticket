const chalk = require('chalk');

module.exports = {
  name: 'ready',
  execute(client) {
    console.log(chalk.green('a') + chalk.cyan('a'))
    console.log(chalk.red('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+='))
    console.log(chalk.green('Name: ') + chalk.cyan('Tickety v2'))
    console.log(chalk.green('Bot Status: ') + chalk.cyan('Initialized'))
    console.log(chalk.red('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+='))
    const oniChan = client.channels.cache.get(client.config.ticketChannel)

    function sendTicketMSG() {
      const embed = new client.discord.MessageEmbed()
        .setColor('#000a36')

        .setAuthor('Ticket', client.user.avatarURL())

        .setDescription('***مرحبا بك في الدعم الفني اذا كانت تواجهك اي مشكلة تفضل بفتح تذكرة \n \n ولكن عليك مراعات الاتي \n \n 1 - الرجاء عند فتح التذكرة كتابت المشكلة بكل وضوح \n \n 2 - الرجاء عدم منشنت الاداره إلا بعد انتظار لا يقل عن ( 15 ) دقيقه \n \n 3 - الرجاء مراجعة القوانين قبل فتح التذكرة \n \n ادارة سيرفر 𝐒𝐩𝐞𝐞𝐝 𝐂𝐨𝐦𝐦𝐮𝐧𝐢𝐭𝐲***')

        .setImage("https://cdn.discordapp.com/attachments/1067200494805717142/1097538864781983805/lv_0_20230417011506.gif")

        .setFooter(`${client.user.tag}`, client.user.displayAvatarURL())
      const row = new client.discord.MessageActionRow()
        .addComponents(
          new client.discord.MessageButton()
          .setCustomId('open-ticket')
          .setLabel('')
          .setEmoji('📩')
          .setStyle('SECONDARY'),
        )
      oniChan.send({
        embeds: [embed],
        components: [row]
      })
    }
    oniChan.bulkDelete(100).then(() => {
      sendTicketMSG()
      console.log(chalk.green('[Tickety v2]') + chalk.cyan(' Sent the ticket creation widget..'))
    })
  },
};
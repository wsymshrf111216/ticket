const { getPasteUrl, PrivateBinClient } = require('@agc93/privatebin');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId == "open-ticket") {
      if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id)) {
        return interaction.reply({
          content: 'You already have an open ticket!',
          ephemeral: true
        });
      };

      interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
        parent: client.config.parentOpened,
        topic: interaction.user.id,
        permissionOverwrites: [{
            id: interaction.user.id,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: client.config.roleSupport,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
        ],
        type: "GUILD_TEXT",
      }).then(async c => {
        interaction.reply({
          content: `Ticket created! <#${c.id}>`,
          ephemeral: true
        });

        const embed = new client.discord.MessageEmbed()
          .setColor('#000a36')

          .setImage("https://cdn.discordapp.com/attachments/1067131466951176242/1067821748168441876/7.png")

          .setDescription(`**حدد نوع المشكلة** <#${c.id}>`)
          .setFooter({text: `${client.user.tag}`, iconURL: client.user.displayAvatarURL()})
          .setTimestamp();

        const row = new client.discord.MessageActionRow()
          .addComponents(
            new client.discord.MessageSelectMenu()
            .setCustomId('category')
            .setPlaceholder('حدد سبب التذكرة')
            .addOptions([{
                label: client.config.Category1,
                value: client.config.Category1,
                emoji: '👨‍🏫',
              },
              {
                label: client.config.Category2,
                value: client.config.Category2,
                emoji: '😡',
              },
              {
                label: client.config.Category3,
                value: client.config.Category3,
                emoji: '991446524355682426',
              },
                                       {
                label: client.config.Category4,
                value: client.config.Category4,
                emoji: '👧',
              },
                                       {
                label: client.config.Category5,
                value: client.config.Category5,
                emoji: '💰',
              },
                                       {
                label: client.config.Category6,
                value: client.config.Category6,
                emoji: '995292213657477141',
              },
                                       {
                label: client.config.Category7,
                value: client.config.Category7,
                emoji: '❔',
              }
            ]),
          );

        msg = await c.send({
          content: `<@!${interaction.user.id}>`,
          embeds: [embed],
          components: [row]
        });

        const collector = msg.createMessageComponentCollector({
          componentType: 'SELECT_MENU',
          time: 20000 //20 seconds
        });

        collector.on('collect', i => {
          if (i.user.id === interaction.user.id) {
            if (msg.deletable) {
              msg.delete().then(async () => {
                const embed = new client.discord.MessageEmbed()
                  .setColor('#000a36')

                  .setImage("https://cdn.discordapp.com/attachments/1037384974124470272/1116851534764970115/Red0000.png")

                  .setDescription(`**مرحبا [<@!${interaction.user.id}>]
                  
نوع المشكله [\`${i.values[0]}\`]

شكرًا لك على اتصالك بفريق الدعم الفني
يرجى إخبارنا بالمشكلة حتى يتمكن الفريق من الرد عليك**`)
                  .setFooter({text: `${client.user.tag}`, iconURL: client.user.displayAvatarURL()})
                  .setTimestamp();


                const row = new client.discord.MessageActionRow()
                  .addComponents(
                    new client.discord.MessageButton()
                    .setCustomId('close-ticket')
                    .setLabel('أغلق التذكرة')
                    .setEmoji('🔒')
                    .setStyle('DANGER'),
                    new client.discord.MessageButton()
                    .setCustomId('close-12')
                    .setLabel('أستلام')
                    .setEmoji('🙋‍♂️')
                    .setStyle('SUCCESS'),
                  );


                const opened = await c.send({
                  content: `<@&${client.config.roleSupport}>`,
                  embeds: [embed],
                  components: [row]
                });

                opened.pin().then(() => {
                  opened.channel.bulkDelete(1);
                });
              });
            };
          };
        });

        collector.on('end', collected => {
          if (collected.size < 1) {
            c.send(`لم يكن هناك سبب ، سيتم إغلاق التذكرة.`).then(() => {
              setTimeout(() => {
                if (c.deletable) {
                  c.delete();
                };
              }, 5000);
            });
          };
        });
      });
    };

    if (interaction.customId == "close-12") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      const verif = await interaction.reply({
        embeds: [ new client.discord.MessageEmbed()
          .setTitle(`**تَذْكِرَة مستلمة**`)
          .setColor(`GREEN`)
          .setFooter({text: `${client.user.username}`, iconURL: client.user.displayAvatarURL()})
          .setDescription(`سيتم التعامل مع تذكرتك من قبل <@!${interaction.user.id}>`)
        
        ]

      });
    };
    
    if (interaction.customId == "close-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      const row = new client.discord.MessageActionRow()
        .addComponents(
          new client.discord.MessageButton()
          .setCustomId('confirm-close')
          .setLabel('نعم')
          .setStyle('DANGER'),
          new client.discord.MessageButton()
          .setCustomId('no')
          .setLabel('لا')
          .setStyle('SECONDARY'),
        );

      const verif = await interaction.reply({
        content: 'هل أنت متأكد أنك تريد إغلاق التذكرة؟',
        components: [row]
      });

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: 'BUTTON',
        time: 10000
      });

      collector.on('collect', i => {
        if (i.customId == 'confirm-close') {
          interaction.editReply({
            content: `تم إغلاق التذكرة من قبل <@!${interaction.user.id}>`,
            components: []
          });

          chan.edit({
              name: `closed-${chan.name}`,
              permissionOverwrites: [
                {
                  id: client.users.cache.get(chan.topic),
                  deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                  id: client.config.roleSupport,
                  allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                  id: interaction.guild.roles.everyone,
                  deny: ['VIEW_CHANNEL'],
                },
              ],
            })
            .then(async () => {
              const embed = new client.discord.MessageEmbed()
                .setColor('#000a36')
                .setAuthor({name: 'Ticket', iconURL: 'https://cdn.discordapp.com/attachments/1012634742186856489/1055174965852381194/9424E55C-E8AD-462B-8C3D-50559D2B144E.jpg'})
                .setDescription('حذف التذكرة')
                .setFooter({text: `${client.user.tag} ||`, iconURL: client.user.displayAvatarURL()})
                .setTimestamp();

              const row = new client.discord.MessageActionRow()
                .addComponents(
                  new client.discord.MessageButton()
                  .setCustomId('delete-ticket')
                  .setLabel('حذف')
                  .setEmoji('🗑️')
                  .setStyle('DANGER'),
                );

              chan.send({
                embeds: [embed],
                components: [row]
              });
            });

          collector.stop();
        };
        if (i.customId == 'no') {
          interaction.editReply({
            content: 'تم إلغاء إغلاق التذكرة!',
            components: []
          });
          collector.stop();
        };
      });

      collector.on('end', (i) => {
        if (i.size < 1) {
          interaction.editReply({
            content: 'تم فتح التذكرة',
            components: []
          });
        };
      });
    };

    if (interaction.customId == "delete-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      interaction.reply({
        content: 'جاري حفظ الرسائل'
      });

      chan.messages.fetch().then(async (messages) => {
        let a = messages.filter(m => m.author.bot !== true).map(m =>
          `${new Date(m.createdTimestamp).toLocaleString('en-EN')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
        ).reverse().join('\n');
        if (a.length < 1) a = "Nothing"
        var paste = new PrivateBinClient("https://privatebin.net/");
        var result = await paste.uploadContent(a, {uploadFormat: 'markdown'})
            const embed = new client.discord.MessageEmbed()
              .setAuthor({name: 'Ticket Logs', iconURL: 'https://cdn.discordapp.com/attachments/1034462964654297178/1042407258467872788/5C8FD717-D537-428A-8B4C-2BEE13FF0485.jpg'})
              .setDescription(`📰 سجلات للتذكرة \`${chan.id}\` | انشأ من قبل <@!${chan.topic}> | أغلقت <@!${interaction.user.id}>\n\nLogs: [**Click here to see the logs**](${getPasteUrl(result)})`)
              .setColor('#000a36')
              .setFooter({text: "This log will be deleted in 24 hrs!"})
              .setTimestamp();

            const embed2 = new client.discord.MessageEmbed()
              .setAuthor({name: 'Ticket Logs', iconURL: 'https://cdn.discordapp.com/attachments/1034462964654297178/1042407258467872788/5C8FD717-D537-428A-8B4C-2BEE13FF0485.jpg'})
              .setDescription(`📰 سجلات للتذكرة \`${chan.id}\`: [**Click here to see the logs**](${getPasteUrl(result)})`)
              .setColor('#000a36')
              .setFooter({text: "This log will be deleted in 24 hrs!"})
              .setTimestamp();

            client.channels.cache.get(client.config.logsTicket).send({
              embeds: [embed]
            }).catch(() => console.log("Ticket log channel not found."));
            chan.send('جارٍ حذف القناة');

            setTimeout(() => {
              chan.delete();
            }, 5000);
          });
    };
  },
};
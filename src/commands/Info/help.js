const { SelectMenuBuilder, ActionRowBuilder, EmbedBuilder, Colors } = require('discord.js')
const fs = require('fs')

module.exports = {
    name: 'help',
    description: 'Veja os meus comandos.',
    run: async (interaction, client) => {
        
        const selectMenusArray = []
        const categoryFolders = fs.readdirSync('./src/commands');
        for (const category of categoryFolders) {
            selectMenusArray.push({ label: `${category}`, description: 'a', value: `${category}` })
        }

        const menu = new ActionRowBuilder()
        .addComponents(new SelectMenuBuilder().setCustomId('select').addOptions(selectMenusArray))
        
        const embed = new EmbedBuilder({
            title: 'Central de Ajuda',
            color: Colors.Blue,
            description: `Esta é minha lista de comandos.`,
            footer: {
                text: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL({ dynamic: true })
            }
        })

        interaction.reply({ embeds: [embed], components: [menu], fetchReply: true }).then((msg) => {

            const filter = m => m.user.id == interaction.user.id

            const collector = msg.createMessageComponentCollector({ filter, time: (60 * 1000) * 2 })

            collector.on('collect', (i) => {
                i.deferUpdate()
                const selected = i.values[0]
                const commands = []
                const filesFolder = fs.readdirSync(`./src/commands/${selected}`)
                for (const files of filesFolder) {
                    const command = require(`../../commands/${selected}/${files}`)
                    commands.push(command.name)
                }
                interaction.editReply({ content: `${commands.join(", ")}` })
            })
        })
    }
}
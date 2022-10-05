const fs = require('fs')

module.exports = (client) => {
    const eventsFolders = fs.readdirSync('./src/events');
    for (const folders of eventsFolders) {
        const eventsFiles = fs.readdirSync(`./src/events/${folders}`)
        for (const files of eventsFiles) {
            if (!files.endsWith('.js')) return;
            const event = require(`../events/${folders}/${files}`)

            if (event.once) {
                client.once(event.name, (...args) => event.run(...args, client))
            } else {
                client.on(event.name, (...args) => event.run(...args, client))
            }
        }
    }
}
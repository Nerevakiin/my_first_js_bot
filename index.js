import { Telegraf } from 'telegraf'
import 'dotenv/config'

// 1. initialize the bot
const bot = new Telegraf(process.env.BOT_TOKEN)

// 2. command /start
bot.start((ctx) => {
    ctx.reply(`Welcome ${ctx.from.first_name}! I am your new node.js bot`)
})

// 3. command /help
bot.help((ctx) => ctx.reply(`Send me a sticker or just say hi!!`))

// 4. listen for specific text
bot.hears('hello there', (ctx) => ctx.reply('General Kenobi!'))

//5. handling stickers
bot.on('sticker', (ctx) => ctx.reply('oreo kapelo aderfe'))

// 6. launch the bot
bot.launch()

// enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

console.log("the bot is running...")
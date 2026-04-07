import { Telegraf } from 'telegraf'
import { Markup } from 'telegraf'
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

// test markup buttons
bot.command('menu', (ctx) => {
    return ctx.reply('ti einai xeirotero?',
        Markup.inlineKeyboard([
            [Markup.button.callback('na se dei o mpampas sou na ton pairneis?', 'opt_1'), 
                Markup.button.callback('na deis ton mpampa sou na ton pairnei', 'opt_2')],
            [Markup.button.url('bes edw na deis mia ekpliksi', 'https://www.youtube.com/watch?v=b7VhXzcacU4')]
        ])
    )
})

// handle the button click
bot.action('opt_1', (ctx) => ctx.answerCbQuery('patises to 1'))

// 6. launch the bot
bot.launch()

// enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

console.log("the bot is running...")
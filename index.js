import { Telegraf } from 'telegraf'
import { Markup } from 'telegraf'
import 'dotenv/config'

// 1. initialize the bot
const bot = new Telegraf(process.env.BOT_TOKEN)

// 2. command /start
// bot.start((ctx) => {
//     ctx.reply(`Welcome ${ctx.from.first_name}! I am your new node.js bot`)
// })

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
bot.action('opt_2', (ctx) => ctx.answerCbQuery('patises to 2'))




// =======================================

// 1. MAIN MENU
const mainMenu = (ctx) => {
    return ctx.reply('Ti tha itheles na kaneis?',
        Markup.inlineKeyboard([
            [
                Markup.button.callback('📝 Ftiakse ena task', 'create_task'),
                Markup.button.callback('📂 Des ta tasks sou', 'view_tasks')
            ],
            [Markup.button.callback('⚙️ Rithmiseis', 'settings')]
        ])
    )
}


// ============ START THE BOT ================
bot.start((ctx, mainMenu) => {
    ctx.reply(`Welcome ${ctx.from.first_name}! I am your new node.js bot`)
    mainMenu(ctx)
})

// 2. HANDLING BUTTON CLICKS (actions)

bot.action('create_task', async (ctx) => {
    // answerCbQuery stops the 'loading' spinner on the button
    await ctx.answerCbQuery()

    // instead of a new message we EDIT the current one
    await ctx.editMessageText('Grapse to onoma tou task sou...',
        Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ Pisw sto menu', 'back_to_menu')]
        ])
    )
})


bot.action('view_tasks', async (ctx) => {
    await ctx.answerCbQuery()
    await ctx.editMessageText('Exeis 0 energa tasks',
        [Markup.inlineKeyboard.callback('⬅️ Pisw sto menu', 'back_to_menu')]
    )
})


// 3. THE "BACK" LOGIC
bot.action('back_to_menu', async (ctx) => {
    await ctx.answerCbQuery()
    // Since mainMenu uses ctx.reply (new message), 
    // we manually edit this one back to the start state.
    await ctx.editMessageText('Ti tha itheles na kaneis?',
        Markup.inlineKeyboard([
            [
                Markup.button.callback('📝 Ftiakse ena task', 'create_task'),
                Markup.button.callback('📂 Des ta tasks sou', 'view_tasks')
            ],
            [Markup.button.callback('⚙️ Rithmiseis', 'settings')]
        ])
    )
})






// 6. launch the bot
bot.launch()

// enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

console.log("the bot is running...")
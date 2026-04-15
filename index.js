import { Telegraf } from 'telegraf'
import { Markup } from 'telegraf'
import 'dotenv/config'

// 1. initialize the bot
const bot = new Telegraf(process.env.BOT_TOKEN)



// MIDDLEWARE MUST BE ON TOP
bot.use(async (ctx, next) => {
    const start = Date.now()

    // call the next middleware/command
    await next()

    const ms = Date.now() - start
    console.log(`response time: ${ms}ms from User: ${ctx.from.first_name}`)
})




// HELPER FUNCTIONS (UI COMPONENT)
// WE DEFINE THE MENU HERE SO WE CAN REUSE IT
const mainKeyboard = Markup.inlineKeyboard([
    [
        Markup.button.callback('📝 Ftiakse ena task', 'create_task'),
        Markup.button.callback('📂 Des ta tasks sou', 'view_tasks')
    ],
    [Markup.button.callback('⚙️ Rithmiseis', 'settings')],
    [Markup.button.callback('🌟 Agorase to Premium', 'buy_stars')]
])





// COMMANDS (/start, /help, /menu)



// THE START COMMAND
bot.start((ctx) => {
    ctx.reply(`Welcome ${ctx.from.first_name}! I am your new node.js bot`, mainKeyboard)
    
})

// 3. command /help
bot.help((ctx) => ctx.reply(`Send me a sticker or just say hi!!`))


// MENU COMMAND
bot.command('menu', (ctx) => {
    return ctx.reply('Ti tha itheles na kaneis?', mainKeyboard)
})


// test markup buttons. Custom joke COMMAND
bot.command('joke', (ctx) => {
    return ctx.reply('ti einai xeirotero?',
        Markup.inlineKeyboard([
            [Markup.button.callback('na se dei o mpampas sou na ton pairneis?', 'opt_1'),
            Markup.button.callback('na deis ton mpampa sou na ton pairnei', 'opt_2')],
            [Markup.button.url('bes edw na deis mia ekpliksi', 'https://www.youtube.com/watch?v=b7VhXzcacU4')]
        ])
    )
})










// LISTENERS (text, stickers, etc)

// listen for specific text
bot.hears('hello there', (ctx) => ctx.reply('General Kenobi!'))

// handling stickers
bot.on('sticker', (ctx) => ctx.reply('oreo kapelo aderfe'))




// ACTIONS (button clicks)


// handle the button click. ACTIONS!
bot.action('opt_1', (ctx) => ctx.answerCbQuery('patises to 1'))
bot.action('opt_2', (ctx) => ctx.answerCbQuery('patises to 2'))

// HANDLING MENU BUTTON CLICKS (actions)

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
    await ctx.answerCbQuery();
    await ctx.editMessageText('Exeis 0 energa tasks',
        Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ Pisw sto menu', 'back_to_menu')]
        ])
    );
});


// ============ THE BUY PREMIUM OPTION BUTTON ===========
bot.action('buy_stars', (ctx) => {
    return ctx.replyWithInvoice({
        title: "support this poor fella",
        description: "pare mou ena kafedaki re magga",
        payload: "internal_payload_id_001", // internal tracking ID
        provider_token: "", // When using Stars, you leave this empty. If you were using credit cards via Stripe, you would put a token from BotFather here.
        currency: "XTR",
        prices: [
            { label: "kafedaki", amount: 1} // 1 star
        ]
    })
})








// 3. THE "BACK" LOGIC
bot.action('back_to_menu', async (ctx) => {
    await ctx.answerCbQuery()
    // Since mainMenu uses ctx.reply (new message), 
    // we manually edit this one back to the start state.
    await ctx.editMessageText('Ti tha itheles na kaneis?', mainKeyboard)
})







// ==================================
// TELEGRAM STARS PAYMENT (BAREBONES)
// ==================================

// 1. Send the invoice with a command
bot.command('donate', (ctx) => {
    return ctx.replyWithInvoice({
        title: "support this poor fella",
        description: "pare mou ena kafedaki re magga",
        payload: "internal_payload_id_001", // internal tracking ID
        provider_token: "", // When using Stars, you leave this empty. If you were using credit cards via Stripe, you would put a token from BotFather here.
        currency: "XTR",
        prices: [
            { label: "kafedaki", amount: 1} // 1 star
        ]
    })
})

//2. Pre-Checkout (MANDATORY)
// Telegram asks: "Is this item still available?" 
// You must answer within 10 seconds.
bot.on('pre_checkout_query', (ctx) => {
    // Logic where available stock can be checked can be implemented here
    // For now, lets say TRUE (yes)
    return ctx.answerPreCheckoutQuery(true)
})

// 3. Successful Payment
bot.on('successful_payment', async (ctx) => {
    const user = ctx.from.first_name
    const amount = ctx.message.successful_payment.total_amount

    console.log(`Payment received from ${user}: ${amount} stars!`)

    await ctx.reply(`na sai kala re ${user} alani! Esteiles ${amount} asteria!🌟🌟🌟`)
})

// ======================================================================================















// 6. launch the bot

async function startBot() {
    try {
        console.log("1. Checking connection to Telegram...");
        
        // This checks if your token is valid BEFORE starting the bot
        const botInfo = await bot.telegram.getMe();
        console.log(`2. Success! Connected as @${botInfo.username}`);

        console.log("3. Starting polling...");
        await bot.launch();
        
        console.log("4. Bot is live and listening for messages! ✅");
    } catch (error) {
        console.error("ERROR: Failed to start the bot:");
        console.error(error);
    }
}

startBot();




// enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

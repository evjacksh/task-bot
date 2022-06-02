import TelegramApi from 'node-telegram-bot-api'
import axios from 'axios'
import FormData from 'form-data'
import http from 'http'
const token = '5313280359:AAGlHJST4liN8RI2si_yEPFaCl8pTm8tmx0'
const bot = new TelegramApi(token, {polling: true})




// Server
const requestListener = (req,res) => {
    console.log(req,res)
    res.writeHead(200)
    res.end('')
}






// RegularExp

// Stat RegularExp
const statRegularExp = /=((([А-Я]{1,10}[1,9]{1,3})((\*)[0-9]{1,10}){4})|(([А-Я]{1,10})(\*)[0-9]{1,10}))$/


// Meet RegularExp
const meetRegularExp = /(@(([A-Z]|[a-z])+) (([0-9]{1,2}\.){2})([0-9]{4}) ([0-9]{1,2}:[0-9]{1,2}$))/
const meetUsernameRegularExp = /(@(([A-Z]|[a-z])+))/
const meetDateRegularExp = /(([0-9]{1,2}\.){2})([0-9]{4})/
const meetTimeRegularExp = /([0-9]{1,2}:[0-9]{1,2})$/


const POST_FETCH_REQUEST = async (form) => {
    
    const URL = 'https://panel.garantsc.ru/tg_bot.php'

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
        }
    }

    axios.post(URL, form, options)
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
}

const formatCheck = (text,Regexp) => text.match(Regexp) ? text.match(Regexp)[0] : null

const onBugs = async (chatId) => {
    await bot.sendMessage(chatId, `Письмо об ошибке,должно быть описано в одном сообщении,включая прикрепленные файлы.

Опишите некорректную работу платформы,по возможности,прикрепите фото/видео-материалы и отправляйте сообщение.

Если вы все сделали верно, бот пришлет сообщение с соотвествующим контекстом.
            `)

    return bot.once('message', async msg => {
        const {first_name,username} = msg.from
        let {text,date} = msg

        const form = new FormData()
        form.append('command_type', 'bug')
        form.append('chat_id', chatId)
        form.append('user_text', text)
        form.append('username', username)
        form.append('first_name', first_name)

        await POST_FETCH_REQUEST(form)
        return bot.sendMessage(chatId, `Спасибо за проявленную инициативность! В ближайшее время ошибка будет исправлена :)`)
    })   
}

const onUpgrade = async (chatId) => {
    await bot.sendMessage(chatId, `Письмо об улучшении,должно быть описано в одном сообщении,включая прикрепленные файлы.

Опишите свою идею,по возможности,прикрепите фото/видео-материалы, в качестве референсов и отправляйте сообщение.

Если вы все сделали верно, бот пришлет сообщение с соотвествующим контекстом.
            `)

   return bot.once('message', async msg => {
        const {first_name,username} = msg.from
        let {text,date} = msg

        const form = new FormData()
        form.append('command_type', 'upg')
        form.append('chat_id', chatId)
        form.append('user_text', text)
        form.append('username', username)
        form.append('first_name', first_name)

        await POST_FETCH_REQUEST(form)
        return bot.sendMessage(chatId, `Спасибо за проявленную инициативность! В ближайшее время мы рассмотрим ваше предложение :)`)
    })   
}

const onStat = async (chatId) => {
    await bot.sendMessage(chatId, `Чтобы успешно записать отчет вам обязательно нужно придерживаться заданного стандарта.
На данный момент существует два варианта записи отчета: полный и быстрый.

Полный выглядит так: =СПБ1*17000*7222*17*3

Быстрый выглядит так: =СПБ*21873302
    `)

    return bot.once('message', async msg => {
        const {first_name,username} = msg.from
        let {text,date} = msg

        if(formatCheck(text,statRegularExp) !== null){
            const form = new FormData()
            form.append('command_type', 'stat')
            form.append('chat_id', chatId)
            form.append('user_text', text)
            form.append('username', username)
            form.append('first_name', first_name)

            await POST_FETCH_REQUEST(form)
            return  bot.sendMessage(chatId, 'Отчет отправлен :)')
        } else{
            return bot.sendMessage(chatId, `Отчет не отправлен. 
Убедитесь,что придерживались заданного стандарта`)
        }
    })
}

const onMeet = async (chatId) => {
    await bot.sendMessage(chatId, `Чтобы назначить встречу,укажите username сотрудника и дату в следующем формате:
    
@username 02.06.2022 15:30
    `)

    bot.once('message', async msg => {
        const {first_name,username} = msg.from
        let {text,date} = msg
        const meet_username = formatCheck(text,meetUsernameRegularExp)
        const meetTime = formatCheck(text,meetTimeRegularExp)
        const meetDate = formatCheck(text,meetDateRegularExp)
        const meet_date = new Date(meetDate + ' ' + meetTime).getTime()

        if( formatCheck(text,meetRegularExp) !== null & meetTime !== null & meetDate !== null & meet_username !== null){
            const form = new FormData()
            form.append('command_type', 'meet')
            form.append('chat_id', chatId)
            form.append('user_text', text)
            form.append('username', username)
            form.append('first_name', first_name)
            form.append('meet_date', meet_date)
            form.append('meet_username', meet_username)

            
            // await POST_FETCH_REQUEST(form)
            return bot.sendMessage(chatId, 'Встреча назначена :)')
        } else{
            return bot.sendMessage(chatId, 'Встреча не назначена. Убедитесь,что данные введены в верном формате')
        }
    })
}

const start = () => {

    bot.setMyCommands([
        {command: '/start', description: 'Запустить бота'},
        {command: '/bug', description: 'Сообщить об обнаруженной недоработке'},
        {command: '/upd', description: 'Предложить идею по дополнению функционала'},
        {command: '/stat', description: 'Написать отчет'},
        {command: '/meet', description: 'Назначить встречу'},
    ])

    bot.on('message', async msg => {
        const chatId = msg.chat.id
        const {text} = msg


        console.log(msg)
        if(text === '/start'){
            const form = new FormData()
            form.append('command_type', 'start')
            form.append('chat_id', chatId)
            form.append('username', username)
    
            await POST_FETCH_REQUEST(form)
            return bot.sendMessage(chatId, `В этого бота можно отправлять замеченные вами недоработки, предложения по улучшению функционала той платформы, с которой вы работаете, отправлять отчеты по эффективности рекламе, назначать встречи.
            
Чтобы это сделать, вам для начала нужно выбрать нужный пункт в меню или нажать на кнопку с соотвествующим названием и отправить информацию в соотвествии с инструкцией в сообщении,появившемся после нажатия на кнопку.

Либо же ввести одну из команд: 
/bug - в случае,если вы нашли недоработку. 
/upg - в случае,если вы хотите что-нибудь предложить.
/stat - в случае,если вы хотите отправить отчет по рекламе.
/meet - в случае,если вы хотите назначить встречу.
            `)
        }

        if(text === '/bug'){
            return onBugs(chatId)
        }

        if(text === '/upg'){
            return onUpgrade(chatId)
        }

        if(text === '/stat'){
            return onStat(chatId)
        }

        if(text === '/meet'){
            return onMeet(chatId)
        }
    })
  
}

start()


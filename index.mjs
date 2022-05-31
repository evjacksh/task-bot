import TelegramApi from 'node-telegram-bot-api'
import fetch from 'node-fetch'
import axios from 'axios'
import FormData from 'form-data'
const token = '5313280359:AAGlHJST4liN8RI2si_yEPFaCl8pTm8tmx0'
const bot = new TelegramApi(token, {polling: true})


const data = []
export default data

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


const onBugs = async (chatId) => {
    await bot.sendMessage(chatId, `Письмо об ошибке,должно быть описано в одном сообщении,включая прикрепленные файлы.

Опишите некорректную работу платформы,по возможности,прикрепите фото/видео-материалы и отправляйте сообщение.

Если вы все сделали верно, бот пришлет сообщение с соотвествующим контекстом.
            `)

    return bot.once('message', async msg => {
        const {first_name,username} = msg.from
        let {text,date} = msg

        const form = new FormData()
        form.append('chat_id', chatId)
        form.append('user_text', text)
        form.append('username', username)
        form.append('first_name', first_name)
        form.append('date', date)

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
        form.append('chat_id', chatId)
        form.append('user_text', text)
        form.append('username', username)
        form.append('first_name', first_name)
        form.append('date', date)

        await POST_FETCH_REQUEST(form)
        return bot.sendMessage(chatId, `Спасибо за проявленную инициативность! В ближайшее время мы рассмотрим ваше предложение :)`)
    })   
}

const start = () => {

    bot.setMyCommands([
        {command: '/start', description: 'Запустить бота'},
        {command: '/bugs', description: 'Сообщить об обнаруженной недоработке'},
        {command: '/upgrade', description: 'Предложить идею по дополнению функционала'},
    ])

    bot.on('message', async msg => {
        const chatId = msg.chat.id
        const {text} = msg
        console.log(msg)
        if(text === '/start'){
            return bot.sendMessage(chatId, `В этого бота можно отправлять замеченные вами недоработки или предложения по улучшению функционала той платформы, с которой вы работаете
            
    Чтобы это сделать, вам для начала нужно нажать на кнопку с соотвествующим названием и отправить информацию в соотвествии с инструкцией в сообщении,появившемся после нажатия на кнопку.

    Либо же ввести одну из команд: /bugs - в случае,если вы нашли недоработку или /upgrade - в случае,если вы хотите предложить улучшение функционала
            `)
        }

        if(text === '/bugs'){
            return onBugs(chatId)
        }

        if(text === '/upgrade'){
            return onUpgrade(chatId)
        }

    })
  
}

start()
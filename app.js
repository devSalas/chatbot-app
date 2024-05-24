const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MySQLAdapter = require('@bot-whatsapp/database/mysql')
const MongoAdapter = require('@bot-whatsapp/database/mongo')
/* const DBProvider = require('@bot-whatsapp/database/mock') */

/**
 * Declaramos las conexiones de MySQL
 */
const MYSQL_DB_HOST = 'localhost'
const MYSQL_DB_USER = 'root'
const MYSQL_DB_PASSWORD = '12345678'
const MYSQL_DB_NAME = 'whatsapp'
const MYSQL_DB_PORT = 3306



const { GoogleGenerativeAI } = require("@google/generative-ai")
const genAI = new GoogleGenerativeAI(process.env.SECRET_GEMINI || "");

const fs = require("fs")


async function runGemini(request) {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = request

    const data ="Tecnología Global XYZ es una empresa líder en soluciones tecnológicas innovadoras, dedicada a transformar la manera en que las empresas operan en la era digital. Fundada en 2010, nuestra misión es empoderar a las organizaciones a través de servicios de consultoría en tecnología avanzada, desarrollo de software personalizado y estrategias de ciberseguridad de vanguardia. Con un equipo de expertos apasionados por la tecnología, ofrecemos un enfoque integral que abarca desde la modernización de inf"


    const result = await model.generateContent(`ten en cuenta solo esta información para contestar a esta pregunta: ${data}. ahora responde a esto:  ${prompt}`);
    const response = await result.response;
    return response.text();
}





const REGEX_RESPONSE = '/.*/';
const flujoPrincipal = addKeyword(REGEX_RESPONSE, { regex: true }).addAction(async (ctx, { flowDynamic }) => {

    const numero = ctx.from

    const data  =await runGemini(ctx.body)
    console.log(data)
    await flowDynamic(data)
})






const main = async () => {
    /*   const adapterDB = new MySQLAdapter({
          host: MYSQL_DB_HOST,
          user: MYSQL_DB_USER,
          database: MYSQL_DB_NAME,
          password: MYSQL_DB_PASSWORD,
          port: MYSQL_DB_PORT,
      }) */
    /* const adapterDB = new DBProvider() */
    const adapterDB = new MongoAdapter({ dbUri: "mongodb+srv://esteban:9mka6pw0IpMUW8hN@cluster0.sg2d9.mongodb.net/whatsapp?retryWrites=true&w=majority" })
    const adapterFlow = createFlow([flujoPrincipal])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()

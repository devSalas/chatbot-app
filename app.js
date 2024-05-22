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



/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */

/* const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

 */

const flujoPrincipal = addKeyword(["hola","ola","Ola"]).addAnswer("bienvenido a Sunetya")

const flujoSecundario = addKeyword("info").addAnswer("perfecto, ahora le damos la información")


const main = async () => {
  /*   const adapterDB = new MySQLAdapter({
        host: MYSQL_DB_HOST,
        user: MYSQL_DB_USER,
        database: MYSQL_DB_NAME,
        password: MYSQL_DB_PASSWORD,
        port: MYSQL_DB_PORT,
    }) */
    /* const adapterDB = new DBProvider() */
    const adapterDB = new MongoAdapter({ dbUri: "mongodb+srv://esteban:9mka6pw0IpMUW8hN@cluster0.sg2d9.mongodb.net/whatsapp?retryWrites=true&w=majority"})
    const adapterFlow = createFlow([flujoPrincipal,flujoSecundario])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()

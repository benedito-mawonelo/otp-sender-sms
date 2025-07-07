const functions = require("firebase-functions")
const twilio = require("twilio")
const cors = require("cors")({ origin: true })


const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

const client = twilio(ACCOUNT_SID, AUTH_TOKEN)

exports.sendOtpSms = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const numero = req.body.numero
    const codigo = req.body.codigo

    if (!numero || !codigo) {
      return res.status(400).send({ error: "Número ou código ausente" })
    }

    try {
      const message = await client.messages.create({
        body: `Seu código de verificação é: ${codigo}`,
        from: TWILIO_PHONE_NUMBER,
        to: `+258${numero}`
      })

      return res.status(200).send({ success: true, sid: message.sid })
    } catch (e) {
      console.error(e)
      return res.status(500).send({ error: "Erro ao enviar SMS", details: e.message })
    }
  })
})

import twilio from 'twilio'

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

const client = twilio(ACCOUNT_SID, AUTH_TOKEN)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' })
  }

  const { numero, codigo } = req.body

  if (!numero || !codigo) {
    return res.status(400).json({ error: 'Número ou código ausente.' })
  }

  try {
    const message = await client.messages.create({
      body: `Seu código de verificação é: ${codigo}`,
      from: TWILIO_PHONE_NUMBER,
      to: `+258${numero}`
    })

    return res.status(200).json({ success: true, sid: message.sid })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Erro ao enviar SMS', details: e.message })
  }
}

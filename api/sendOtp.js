import twilio from 'twilio'

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

const client = twilio(ACCOUNT_SID, AUTH_TOKEN)

export default async function handler(req, res) {
  // Habilita CORS para qualquer origem — em produção, substitua "*" por seu domínio
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Trata a requisição OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { numero, codigo } = req.body

  if (!numero || !codigo) {
    return res.status(400).json({ error: 'Número ou código ausente' })
  }

  try {
    const message = await client.messages.create({
      body: `Seu código de verificação é: ${codigo}`,
      from: TWILIO_PHONE_NUMBER,
      to: `+258${numero}`
    })

    return res.status(200).json({ success: true, sid: message.sid })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao enviar SMS', details: error.message })
  }
}

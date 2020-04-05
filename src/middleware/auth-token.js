const { AUTHORIZATION_TOKEN } = require('../config')

function requireToken(req, res, next) {
  const authToken = req.get('Authorization') || ''

  let token
  if (!authToken.toLowerCase().startsWith('token ')) {
    return res.status(401).json({ error: 'Missing token' })
  } else {
    token = authToken.slice(6, authToken.length)
  }

  if(token !== AUTHORIZATION_TOKEN){
    return res.status(400).json({
      error: `Incorrect Token`
    })
  }

  next()
}

module.exports = {
  requireToken,
}
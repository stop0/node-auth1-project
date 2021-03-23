const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../users/users-model')

router.post('/register', (req, res, next) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 10) // 2 ^ 10
  const userForDatabase = { username, password: hash }

  User.add(userForDatabase)
    .then(user => {
      res.json(user)
    })
    .catch(next)
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body

  User.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user // SAVE SESSION and SET COOKIE
        res.json('welcome back!')
      } else {
        res.status(401).json('invalid credentials')
      }
    })
    .catch(next)
})

router.get('/logout', (req, res, next) => {
  if(req.session && req.session.user) {
    req.session.destroy(err => {
      if (err) {
        res.json('you cannot leave')
      } else {
        res.json('goodbye')
      }
    })
  } else {
    res.json('you are not actually logged in')
  }
})

module.exports = router

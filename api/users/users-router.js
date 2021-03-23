const router = require("express").Router();

const Users = require("./users-model.js");

function protected(req, res, next) {
  if (req.session && req.session.user) {
    next()
  } else {
    res.status(401).json({
      message: 'you shall not pass!',
    })
  }
}

router.get("/", protected, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;

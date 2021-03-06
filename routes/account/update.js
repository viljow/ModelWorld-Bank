const Account = require('../../models/account.js')

module.exports = function (req, res, next) {
  Account.findOne({'_id': req.params.id}).populate('wages').exec(function (err, document) {
    if (err) {
      return next(err)
    }

    if (document == null) {
      return res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
    }

    if ((document.users[req.decoded.name] >= 2) || (req.decoded.admin === true)) { // Permission level greater than 1 or they are admin
      for (let property in req.body.changes) {
        if (req.body.changes.hasOwnProperty(property)) {
          const possibleFields = ['description', 'public']

          if (possibleFields.includes(property) ) {
            document[property] = req.body.changes[property]
          }
        }
      }

      document.save()
        .then(() =>{
          res.status(200).json({})
        })
        .catch(next)
    } else {
      return res.status(403).json({err: {code: 403, desc: 'You do not have permission'}})
    }
  })
}

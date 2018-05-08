const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
  let token = req.get('authorization');

  //console.log(process.env.SEED);
  //console.log(process.env.CADUCIDAD_TOKEN);

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};

module.exports = {
  verificaToken
};

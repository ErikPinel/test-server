const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  
  console.log('VERIFYYYYYYYYYYIng')

  if(req.method === 'OPTIONS')
    return res.send();

  console.log('req.headers')
  console.log(req.headers)

  console.log('req.headers["Authorization"]')
  console.log(req.headers["Authorization"])

  const token =
    req.body.token || req.query.token || req.headers["Authorization"] || req.headers["authorization"] || req.headers["x-access-token"];

  console.log('token========================+>')
  console.log(token)
  
  if (!token) {
    console.log('!token========================+>')
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('decoded========================+>')
    console.log(decoded)
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
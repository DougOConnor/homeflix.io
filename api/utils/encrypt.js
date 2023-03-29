const bcrypt = require("bcrypt")

generateEncryptedPassword = async (password) => {
  const saltRounds = 10
  let salt = await bcrypt.genSalt(saltRounds);
  let hash = await bcrypt.hash(password, salt);
  return hash
}

validateEncryptedPassword = async (password, hash) => {
  let check = await bcrypt.compare(password, hash)
  return check
}


module.exports = {
  generateEncryptedPassword,
  validateEncryptedPassword
}
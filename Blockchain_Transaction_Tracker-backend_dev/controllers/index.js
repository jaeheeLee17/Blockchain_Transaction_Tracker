const cwr = require('../utils/createWebResponse');

/* GET home page. */
function homepage (req, res) {
  const header = res.setHeader('Content-Type', 'application/json')
  return cwr.createWebResp(res, header, 200, {
    message: 'Transaction Loading API',
  });
}

module.exports = {
  homepage,
}
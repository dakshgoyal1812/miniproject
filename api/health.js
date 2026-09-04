const { handleHealthRequest } = require('../lib/smartqueue-api');

module.exports = async (req, res) => {
  return handleHealthRequest(req, res);
};

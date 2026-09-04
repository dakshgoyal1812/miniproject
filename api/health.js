const { handleHealthRequest } = require('../server');

module.exports = async (req, res) => {
  return handleHealthRequest(req, res);
};

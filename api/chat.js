const { handleChatRequest } = require('../lib/smartqueue-api');

module.exports = async (req, res) => {
  return handleChatRequest(req, res);
};

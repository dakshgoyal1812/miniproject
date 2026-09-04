const { handleChatRequest } = require('../server');

module.exports = async (req, res) => {
  return handleChatRequest(req, res);
};

const { handleSendConfirmationRequest } = require('../server');

module.exports = async (req, res) => {
  return handleSendConfirmationRequest(req, res);
};

const { handleSendConfirmationRequest } = require('../lib/smartqueue-api');

module.exports = async (req, res) => {
  return handleSendConfirmationRequest(req, res);
};

const webResponse = require('./WebResponse')

const createWebResp = (res, header, statusCode, data) => {
  const response = new webResponse();
  response.statusCode = statusCode;
  response.header = header;
  response.data = data;
  res.status(response.getStatusCode).send(response.create())
};

const errorWebResp = (res, header, statusCode, errorMessage, errorData) => {
  const response = new webResponse();
  response.statusCode = statusCode;
  response.header = header;
  response.message = errorMessage;
  response.errorData = errorData;
  res.status(response.getStatusCode).send(response.create())
};

module.exports = {
  createWebResp,
  errorWebResp,
};
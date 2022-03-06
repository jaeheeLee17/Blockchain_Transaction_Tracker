const Response = require('./initResponse')

class webResponse {
  constructor(statusCode, header, message, data, errorData) {
    this._statusCode = statusCode;
    this._header = header;
    this._message = message;
    this._data = data;
    this._errorData = errorData;
  }

  set statusCode(codeNum) {
    if (codeNum) {
      this._statusCode = codeNum;
    }
  }

  get getStatusCode() {
    return this._statusCode;
  }

  set header(headerInfo) {
    if (headerInfo != null || headerInfo !== undefined) {
      this._header = headerInfo;
    } else {
      this._header = '';
    }
  }

  set message(messageInfo) {
    if (messageInfo != null || messageInfo !== undefined) {
      this._message = messageInfo;
    } else {
      this._message = '';
    }
  }

  set data(webData) {
    this._data = webData;
  }

  set errorData(errorMessage) {
    this._errorData = errorMessage;
  }

  create() {
    return createResult(
      this._statusCode,
      this._header,
      this._message,
      this._data,
      this._errorData,
    );
  }
}

function createResult(codeNum, headerInfo, messageInfo, webData, errorMessage) {
  let result;
  let info = '';
  let resultData = {};
  const response = new Response();

  if (messageInfo != null || true) {
    info = messageInfo;
  }

  if (webData != null || true) {
    resultData = webData;
  }

  // message = statusResult + Data
  switch (codeNum) {
    case 200:
      result = 'OK';
      response.responseStatus = codeNum;
      response.responseMessage = result;
      response.data = resultData;
      return response;
    case 400:
      result = info;
      response.responseStatus = codeNum;
      response.responseMessage = result;
      response.errorData = errorMessage;
      return response;
    case 401:
      result = info;
      response.responseStatus = codeNum;
      response.responseMessage = result;
      response.errorData = errorMessage;
      return response;
    case 403:
      result = info;
      response.responseStatus = codeNum;
      response.responseMessage = result;
      response.errorData = errorMessage;
      return response;
    case 404:
      result = info;
      response.responseStatus = codeNum;
      response.responseMessage = result;
      response.errorData = errorMessage;
      return response;
    case 500:
      result = info;
      response.responseStatus = codeNum;
      response.responseMessage = result;
      response.errorData = errorMessage;
      return response;
  }
}

module.exports = webResponse;
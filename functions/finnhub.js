const { callApi } = require("./apiutils");

exports.handler = async (event) => {
  const url = "https://finnhub.io/api/v1/" + event.queryStringParameters.path;
  delete event.queryStringParameters.path;

  event.queryStringParameters.token = process.env.VUE_APP_FINNHUB_SECRET_KEY;

  let response = await callApi(url, event);
  return response;
};

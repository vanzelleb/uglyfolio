const { callApi } = require("./apiutils");

exports.handler = async (event) => {
  const url =
    "http://api.exchangeratesapi.io/" + event.queryStringParameters.path;
  delete event.queryStringParameters.path;

  event.queryStringParameters.access_key =
    process.env.VUE_APP_EXCHANGERATESAPI_SECRET_KEY;

  let response = await callApi(url, event);
  return response;
};

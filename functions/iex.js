const { callApi } = require("./apiutils");

exports.handler = async (event) => {
  const url = "https://cloud.iexapis.com/stable/" + event.queryStringParameters.path
  delete event.queryStringParameters.path

  event.queryStringParameters.token = process.env.VUE_APP_IEXCLOUD_SECRET_KEY;;

  let response = await callApi(url, event);
  return response;
};

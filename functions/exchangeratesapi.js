const { callApi } = require("./apiutils");

exports.handler = async (event) => {
  const origin = event.headers.origin;
  let { url, params } = JSON.parse(event.body);
  let response = await callApi(url, params, origin);
  return response;
};

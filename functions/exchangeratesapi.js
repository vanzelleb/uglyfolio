const { callApi } = require("./apiutils");

exports.handler = async (event) => {
  const access_key = process.env.VUE_APP_EXCHANGERATESAPI_SECRET_KEY;
  const origin = event.headers.origin;
  let { url, params } = JSON.parse(event.body);
  params.access_key = access_key;
  let response = await callApi(url, params, origin);
  return response;
};

const { callApi } = require("./apiutils");

exports.handler = async (event) => {
  const token = process.env.VUE_APP_IEXCLOUD_SECRET_KEY;
  const origin = event.headers.origin;
  let { url, params } = JSON.parse(event.body);
  params.token = token;
  let response = await callApi(url, params, origin);
  return response;
};

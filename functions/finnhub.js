const { callApi } = require("./apiutils");

exports.handler = async (event) => {
  //const url = "https://finnhub.io/api/v1/" + event.queryStringParameters.path
  return {
    statusCode: 404,
    header: {
      "Access-Control-Allow-Origin": event.headers.origin
    },
    body: event.queryStringParameters
  };
  //delete event.queryStringParameters.path

  //event.queryStringParameters.token = process.env.VUE_APP_FINNHUB_SECRET_KEY;;

  //let response = await callApi(url, event);
  //return response;
};

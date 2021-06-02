//const fetch = require("node-fetch");
const axios = require("axios");

exports.callApi = function (url, event) {
  return new Promise(async function (resolve) {
    let headers = {
      // cache the response from the API for 1 hour
      "Cache-Control": "private, max-age=3600",
      "Access-Control-Allow-Origin": event.headers.origin
    };

    //const allowedOrigins = ["https://uglyfolio.netlify.app"];
    //if (allowedOrigins.indexOf(origin) > -1) {
    //headers["Access-Control-Allow-Origin"] = event.headers.origin
    //}

    axios
      .get(url, {
        params: event.queryStringParameters
      })
      .then(function (response) {
        resolve({
          statusCode: 200,
          headers: headers,
          body: JSON.stringify(response.data)
        });
      })
      .catch(function (error) {
        resolve({
          statusCode: 404,
          headers: headers,
          body: JSON.stringify(error.message)
        });
      });
  });
};

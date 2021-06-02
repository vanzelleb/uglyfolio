//const fetch = require("node-fetch");
const axios = require("axios");

const allowedOrigins = ["https://uglyfolio.netlify.app"];

exports.callApi = function (url, event) {
  return new Promise(async function (resolve) {
    //let responseText = null;
    let headers = {
      // cache the response from the API for 1 hour
      "Cache-Control": "private, max-age=3600"
    };
    //let res = null;

    //if (allowedOrigins.indexOf(origin) > -1) {
    headers["Access-Control-Allow-Origin"] = event.headers.origin;

    //}

    //try {
    //url = new URL(url);
    //Object.keys(event.queryStringParameters).forEach((key) =>
    // url.searchParams.append(key, event.queryStringParameters[key])
    //);

    axios
      .get(url, {
        params: event.queryStringParameters
      })
      .then(function (response) {
        resolve({
          statusCode: 200,
          headers,
          body: response.data
        });
      })
      .catch(function (error) {
        resolve({
          statusCode: 404,
          headers,
          body: error.message
        });
      });

    //res = await fetch(url);
    //responseText = await res.text();
    //if (data === {}) data = "No data received.";

    //} catch (e) {
    // if the API call fails, e.g. because of an unknown stock symbol

    //}
  });
};

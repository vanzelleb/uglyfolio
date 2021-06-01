const fetch = require("node-fetch");

const allowedOrigins = ["https://uglyfolio.netlify.app"];

exports.callApi = function (url, params, origin) {
  return new Promise(async function (resolve) {
    let responseText = null;
    let headers = {};
    let res = null;

    //if (allowedOrigins.indexOf(origin) > -1) {
    headers["Access-Control-Allow-Origin"] = origin;
    // cache the response from the API for 1 hour
    headers["Cache-Control"] = "private, max-age=3600";
    //}

    try {
      url = new URL(url);
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
      res = await fetch(url);
      responseText = await res.text();
      if (responseText === "{}") responseText = "No data found.";
      resolve({
        statusCode: 200,
        headers,
        body: responseText
      });
    } catch (e) {
      // if the API call fails, e.g. because of an unknown stock symbol
      resolve({
        statusCode: 404,
        headers,
        body: e.message
      });
    }
  });
};

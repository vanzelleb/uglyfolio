import axios from "axios";

// Backend consists of Netlify functions that can access secret API keys
const backend = axios.create({
  baseURL: "https://uglyfolio.netlify.app/.netlify/functions/"
});

// handles requests that have a fallback API provider, e.g. when request limit is reached or when symbol is unknown
export default function (apiOptions) {
  async function callServer(reqObj, resObj) {
    for (let i = 1; i <= Object.keys(apiOptions).length; i++) {
      try {
        // generate the the address to call the API with
        const { provider, params } = apiOptions[i].prepareRequest(reqObj);
        const { data } = await backend.get(provider, { params: params });
        apiOptions[i].handleResponse(data, resObj);
        // break the loop if a successful API response was received
        break;
        // catch API errors and try the next API option
      } catch (e) {
        console.log("API error: ", e.message);
      }
    }
  }

  return {
    callServer
  };
}

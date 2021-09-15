import useBackend from "../composables/useBackend";
import { finnhubAPI } from "../modules/finnhub";
import { saveAsset } from "../modules/asset";

const apiOptions = {
  1: {
    prepareRequest: function ({ asset, from, to }) {
      const params = {
        path: finnhubAPI.companyNews,
        symbol: asset.ticker,
        from: from,
        to: to
      };
      return { provider: "finnhub", params };
    },
    handleResponse: function (json, { asset }) {
      const uniqueHeadlines = [...new Set(json.map((item) => item.headline))];
      const uniqueNews = json.filter(
        (news, i) => news.headline === uniqueHeadlines[i]
      );
      asset.dataload.news = uniqueNews.map((item) => {
        item.datetime = finnhubAPI.toDate(item.datetime);
        return item;
      });
      console.log("All unique news items: ", asset.dataload.news);
      saveAsset(asset);
    }
  }
};

export default function (asset) {
  const { callServer } = useBackend(apiOptions);

  const getNews = async (from, to) => {
    await callServer({ asset: asset, from: from, to: to }, { asset: asset });
  };

  return {
    getNews
  };
}

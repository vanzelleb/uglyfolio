import { sampleCorrelation } from "simple-statistics";
import * as tf from "@tensorflow/tfjs";
import { mean, standardDeviation } from "simple-statistics";

let correlationMatrix = [];
let returns = [];
let vols = [];
let weights = null;
let finalvol = null;
let finalreturn = null;

onmessage = function (msg) {
  console.log("Message received from main script: ", msg);
  initialize(msg.data.prices);
  train();
};

const initialize = (prices) => {
  weights = tf.variable(tf.div(tf.ones([prices.length, 1]), prices.length));
  // make all price histories the same length
  const adjustedPrices = adjustPriceHistory(prices);
  const dailyChangePct = adjustedPrices.map((list) => calcDailyChangePct(list));

  returns = dailyChangePct.map((list) => [predictYearlyChangePct(list)]);
  vols = dailyChangePct.map((list) => [predictYearlyVolatility(list)]);
  createCorrelationMatrix(dailyChangePct);

  console.log("Asset Returns: ", returns);
  console.log("Asset Volatilities: ", vols);
};

// The main training function
async function train(done) {
  // Number of iterations to run the optimiser; I found that 750 is about enough for the loss (Sharpe Ratio in this case) to stablise
  const epochs = 500;
  // Learning rate for the optimiser
  const learning_rate = 0.01;
  // We use a adam optimiser here. I tried some others like SGD, but adam seems to converge faster
  const optimizer = tf.train.adam(learning_rate);

  for (let i = 0; i < epochs; i++) {
    let cost;

    cost = tf.tidy(() => {
      cost = optimizer.minimize(() => {
        constraints();
        const sharpe = predict();
        return sharpe;
      }, true);
      constraints();
      return cost;
    });
    //console.log("Epochs: " + i);
  }

  let weights_array = [];
  let final_weights = weights.dataSync();
  //console.log("Optimized weights: ", final_weights);
  for (const weight of final_weights) {
    weights_array.push(Number(weight));
  }

  let weighted_vols = weights.mul(vols);
  let vol = weighted_vols
    .transpose()
    .matMul(correlationMatrix)
    .matMul(weighted_vols)
    .squeeze();
  finalvol = 100 * Math.sqrt(vol.dataSync());

  let returns_sum = weights.mul(returns).sum();
  finalreturn = 100 * returns_sum.dataSync();

  const workerResponse = {
    weights: weights_array,
    return: finalreturn,
    vol: finalvol
  };

  console.log("Posting message back to application: ", workerResponse);
  postMessage(workerResponse);
}

function predict() {
  return tf.tidy(() => {
    const weighted_vols = weights.mul(vols);
    const vol = tf.sqrt(
      weighted_vols
        .transpose()
        .matMul(correlationMatrix)
        .matMul(weighted_vols)
        .squeeze()
    );
    const returns_sum = weights.mul(returns).sum();
    // For those not familiar, the Sharpe ratio shows us how much returns we are getting per unit of risk
    // We negate the number as the higher the better, but our optimise is searching for the minimum
    const sharpe = tf.neg(tf.div(returns_sum, vol));

    return sharpe;
  });
}

function constraints() {
  // Weights that breach the constraints will be set to 0, 1, or the preset floors or ceilings
  /*const floors = assets.value.map((asset) => [0]);
    const ceils = assets.value.map((asset) => [1]);

    const mask_wts_less_than_floor = tf.greater(floors, weights);
    weights.assign(
      tf.where(mask_wts_less_than_floor, tf.tensor(floors), weights)
    );

    const mask_wts_more_than_ceil = tf.greater(weights, ceils);
    weights.assign(
      tf.where(mask_wts_more_than_ceil, tf.tensor(ceils), weights)
    );*/

  const mask_wts_less_than_zero = tf.greater(0.0, weights);
  weights.assign(
    tf.where(mask_wts_less_than_zero, tf.zerosLike(weights), weights)
  );

  const mask_wts_more_than_one = tf.greater(weights, 1.0);
  weights.assign(
    tf.where(mask_wts_more_than_one, tf.onesLike(weights), weights)
  );
  // Here we make sure the sum of weights = 1 by scaling them down
  const result_sum = tf.sum(weights);
  weights.assign(tf.div(weights, result_sum)); //If sum > 1, dividing it by the sum scales it back to 1

  tf.mul(weights, returns).sum();
  // returns_sum.print();
}

function calcDailyChangePct(priceList) {
  const dailyChangePct = [];
  for (let i = 1; i < priceList.length; i++) {
    dailyChangePct.push(priceList[i] / priceList[i - 1] - 1);
  }
  return dailyChangePct;
}

function predictYearlyChangePct(dailyChangePctList) {
  const avgDailyChange = mean(dailyChangePctList);
  const predictedYearlyChangePct = avgDailyChange * 252;
  return predictedYearlyChangePct;
}

function predictYearlyVolatility(dailyChangePctList) {
  const volatility = standardDeviation(dailyChangePctList);
  const predictedYearlyVolatility = volatility * Math.sqrt(252);
  return predictedYearlyVolatility;
}

function adjustPriceHistory(prices) {
  // ensure that the daily returns array of each asset is the same length
  const shortestList = prices
    .map((list) => list.length)
    .sort((a, b) => {
      return a - b;
    })[0];
  //console.log("Shortest day count: ", shortestTimeseries);
  if (shortestList > 1) {
    prices.forEach((list, index) => {
      //console.log("Days in this list is " + list.length);
      if (list.length > shortestList) {
        // remove x elements from the start of the array
        let deleteCount = list.length - shortestList;
        //console.log("Delete elements from start: " + deleteCount);
        prices[index].splice(0, deleteCount);
      }
      //console.log("Daily Change " + index + ": " + dfDailyChange[index].length);
    });
    return prices;
  } else return null;
}

function createCorrelationMatrix(dailyChangePct) {
  dailyChangePct.forEach((A, i) => {
    let row = [];
    dailyChangePct.forEach((B, j) => {
      row.push(sampleCorrelation(A, B));
    });
    correlationMatrix.push(row);
  });
  console.log("Correlation matrix: ", correlationMatrix);
}

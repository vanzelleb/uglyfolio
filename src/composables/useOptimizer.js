import { ref, onMounted, watch } from "vue";
import { sampleCorrelation } from "simple-statistics";
import * as tf from "@tensorflow/tfjs";

export default function useOptimizer(assets, chart) {
  let correlationMatrix = [];
  let returns = [];
  let vols = [];
  let weights = null;
  const finalvol = ref(0);
  const finalreturn = ref(0);

  const initialize = () => {
    weights = tf.variable(
      tf.div(tf.ones([assets.value.length, 1]), assets.value.length)
    );
    returns = assets.value.map((asset) => [asset.predictYearlyChangePct()]);
    vols = assets.value.map((asset) => [asset.predictYearlyVolatility()]);

    // ensure that the daily returns array of each asset is the same length
    let dfDailyChange = assets.value.map((asset) => asset.dailyChangePctList());
    let dayCountList = dfDailyChange.map((list) => (list ? list.length : 0));
    // find the asset with the shortest timeseries
    dayCountList.sort((a, b) => {
      return a - b;
    });
    console.log("Day counts: ", dayCountList);
    const shortestDayCount = dayCountList[0];
    console.log("Shortest day count: ", shortestDayCount);

    if (shortestDayCount > 1) {
      dfDailyChange.forEach((list, index) => {
        // remove x elements from the start of the array
        //console.log("Days in this list is " + list.length);
        if (list.length > shortestDayCount) {
          let deleteCount = list.length - shortestDayCount;
          //console.log("Delete elements from start: " + deleteCount);
          dfDailyChange[index].splice(0, deleteCount);
        }
        //console.log("Daily Change " + index + ": " + dfDailyChange[index].length);
      });

      dfDailyChange.forEach((A, i) => {
        let row = [];
        dfDailyChange.forEach((B, j) => {
          row.push(sampleCorrelation(A, B));
        });
        correlationMatrix.push(row);
      });
      console.log("Correlation matrix: ", correlationMatrix);
    }
  };

  const optimize = () => {
    // Number of iterations to run the optimiser; I found that 750 is about enough for the loss (Sharpe Ratio in this case) to stablise
    const epochs = 300;

    console.log("Asset Returns: ", returns);
    console.log("Asset Volatilities: ", vols);

    train(epochs, () => {
      let weights_array = [];

      let final_weights = weights.dataSync();
      console.log("Optimized weights: ", final_weights);

      assets.value.forEach((asset, i) => {
        weights_array.push(Number(final_weights[i]));
      });
      //console.log(chart.value.w.globals.series);
      chart.value.updateSeries(weights_array);

      // Write the final return and vol of the portfolio to the screen
      let weighted_vols = weights.mul(vols);
      let vol = weighted_vols
        .transpose()
        .matMul(correlationMatrix)
        .matMul(weighted_vols)
        .squeeze();
      finalvol.value = 100 * Math.sqrt(vol.dataSync());

      let returns_sum = weights.mul(returns).sum();
      finalreturn.value = 100 * returns_sum.dataSync();
    });
  };

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
    // All the constraints that we are applying
    // It looks complicated, but all we are doing is resetting the weights at each cycle
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
    // This is a little different
    // Here we make sure the sum of weights = 1 by scaling them down
    const result_sum = tf.sum(weights);
    weights.assign(tf.div(weights, result_sum)); //If sum > 1, dividing it by the sum scales it back to 1

    tf.mul(weights, returns).sum();
    // returns_sum.print();
  }

  // The main training function
  async function train(epochs, done) {
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
      console.log("Epochs: " + i);
    }
    done();
  }

  onMounted(initialize);
  watch(assets, initialize);

  return {
    optimize,
    finalvol,
    finalreturn
  };
}

import { mixins, Scatter } from 'vue-chartjs'
const { reactiveProp } = mixins;

export default {
  extends: Scatter,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    console.log('mounted');
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    options: function () {
      this.renderChart(this.chartData, this.options);
    },
  }
}
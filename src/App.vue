<template id="bblah">
  <div class="page-container nji-main">
    <div class="md-layout md-gutter md-alignment-center-center">
      <div class="md-layout-item md-small-size-90 md-medium-size-75 md-large-size-50 nji-content-card">
        <div class="md-layout nji-column md-gutter md-alignment-center-center">
          <div class="md-layout-item md-display-3 nji-title">Playlist Magic</div>
          <div class="md-layout-item md-body-2 nji-subheader">Analyze your favorite playlist, or compare two to each other.</div>
          <playlist-input v-on:create-graph="createGraph"/>
          <div style="margin-top: 20px;" class="md-layout-item md-body-2 nji-subheader">
            {{errorMessage}}
          </div>
          <md-progress-spinner v-if="showSpinner" :md-diameter="100" :md-stroke="10" md-mode="indeterminate" style="margin: 40px;"></md-progress-spinner>
          <scatter v-if="showChart" :chart-data="scatterData" :options="chartOptions"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Scatter from './components/Scatter'
  import Input from './components/Input';

  const tempData =  {
    labels: ['test'],
    datasets: [{
      label: 'Scatter Dataset',
      data: [{
        x: .2,
        y: .2
      }]
    }]
  };

  function createScatterArrays(arr, xAxis, yAxis) {
    const labels = [];
    const data = [];

    arr.forEach(function (track) {
      data.push({
        x: track[xAxis],
        y: track[yAxis]
      });
      labels.push(track.name + " by " + track.artist);
    });

    return [labels, data];
  }

  function getOptions(xAxis, yAxis) {
    let option = {
      scales: {
        xAxes: [{
          display: true,
          ticks: {
            min: 0,
            max: 1
          },
          scaleLabel: {
            display: true,
            labelString: xAxis
          }
        }],
          yAxes: [{
          display: true,
          ticks: {
            min: 0,
            max: 1
          },
          scaleLabel: {
            display: true,
            labelString: yAxis
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].labels[tooltipItem.index];
          }
        }
      }
    };

    if (xAxis === 'popularity') {
      option.scales.xAxes[0].ticks.max = 100;
    } else if (xAxis === 'tempo') {
      option.scales.xAxes[0].ticks.max = 180;
    } else {
      option.scales.xAxes[0].ticks.max = 1;
    }
    if (yAxis === 'popularity') {
      option.scales.yAxes[0].ticks.max = 100;
    } else if (yAxis === 'tempo') {
      option.scales.yAxes[0].ticks.max = 180;
    } else {
      option.scales.yAxes[0].ticks.max = 1;
    }
    return option;
  }

  export default {
    name: 'App',
    data: () => {
      return {
        errorMessage: '',
        showChart: false,
        showSpinner: false,
        scatterData: tempData,
        chartOptions: getOptions('','')
      }
    },
    methods: {
      createGraph: async function (options) {
        this.showChart = false;
        this.showSpinner = true;
        this.errorMessage = '';
        try {
          // to make functional
          let response = await axios.get(
            "http://node-express-env.eba-wrkpfpwj.us-east-2.elasticbeanstalk.com/data/" + options.playlistId);
          let [labels, values] = createScatterArrays(response.data.tracks, options.xAxis, options.yAxis);
          let chartData = {
            labels: labels,
            datasets: [{
              label: response.data.name,
              labels: labels,
              data: values,
              borderWidth: 1,
              backgroundColor: '#9a989f'
            }]
          };
          if (options.playlistId2 !== '') {
            let response2 = await axios.get(
              "http://node-express-env.eba-wrkpfpwj.us-east-2.elasticbeanstalk.com/data/" + options.playlistId2);
            let [labels2, values2] = createScatterArrays(response2.data.tracks, options.xAxis, options.yAxis);
            chartData.datasets.push({
              label: response2.data.name,
              labels: labels2,
              data: values2,
              borderWidth: 1,
              backgroundColor: '#ff8b46'
            });
          }
          this.chartOptions = getOptions(options.xAxis, options.yAxis);
          this.scatterData = chartData;
          setTimeout(() => {
            this.showSpinner = false;
            this.showChart = true;
          }, 500);
        }
        catch (e) {
          this.errorMessage = "Problem finding playlist data"
          this.showSpinner = false;
        }
      },
    },
    components: {
      'scatter': Scatter,
      'playlist-input': Input
    }
  }
</script>

<style lang="scss">
  .nji-main {
    height: fit-content;
    background-color: #1f1f1f;
    padding: 20px;

    .nji-column {
      flex-direction: column;
    }

    .md-alignment-center-center {
      height: 100%;

      .nji-content-card {
        border-radius: 10px;
        background-color: #fafafa;
        min-height: 400px;
        min-width: 400px;
        text-align: center;

        .nji-title {
          margin: 20px;
        }

        .nji-subheader {
        }

        .nji-playlist-input {
          .md-field {
            min-width: 250px;
          }

          .center-label {
            left: 50%;
            transform: translateX(-50%);
          }

          input {
            text-align: center;
          }
        }
      }
    }
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>

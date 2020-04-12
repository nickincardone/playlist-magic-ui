<template id="bblah">
  <div class="page-container nji-main">
    <div class="md-layout md-gutter md-alignment-center-center">
      <div class="md-layout-item md-small-size-90 md-medium-size-75 md-large-size-50 nji-content-card">
        <div class="md-layout nji-column md-gutter md-alignment-center-center">
          <div class="md-layout-item md-display-3 nji-title">Playlist Magic</div>
          <div class="md-layout-item md-body-2 nji-subheader">Analyze your favorite playlist</div>
          <div class="md-layout-item nji-playlist-input">
            <md-field>
              <label class="center-label">Playlist ID</label>
              <md-input v-model="playlistId"></md-input>
            </md-field>
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-field>
                  <label for="xAxis">X Axis</label>
                  <md-select v-model="xAxis" name="xAxis" id="xAxis">
                    <md-option value="valence">Valence</md-option>
                    <md-option value="energy">Energy</md-option>
                    <md-option value="popularity">Popularity</md-option>
                    <md-option value="speechiness">Speechiness</md-option>
                    <md-option value="acousticness">Acousticness</md-option>
                    <md-option value="instrumentalness">Instrumentalness</md-option>
                    <md-option value="liveness">Liveness</md-option>
                    <md-option value="tempo">Tempo</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label for="yAxis">Y Axis</label>
                  <md-select v-model="yAxis" name="yAxis" id="yAxis">
                    <md-option value="valence">Valence</md-option>
                    <md-option value="energy">Energy</md-option>
                    <md-option value="popularity">Popularity</md-option>
                    <md-option value="speechiness">Speechiness</md-option>
                    <md-option value="acousticness">Acousticness</md-option>
                    <md-option value="instrumentalness">Instrumentalness</md-option>
                    <md-option value="liveness">Liveness</md-option>
                    <md-option value="tempo">Tempo</md-option>
                  </md-select>
                </md-field>
              </div>
            </div>

            <md-button class="md-raised" v-on:click="blah">Analyze</md-button>
          </div>
          <div style="margin-top: 20px;" class="md-layout-item md-body-2 nji-subheader">{{hello}}
          </div>
          <scatter v-if="showChart" :chart-data="scatterData" :options="options"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Scatter from './components/Scatter'

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
            let label = data.labels[tooltipItem.index];
            return label;
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
        hello: '',
        showChart: false,
        scatterData: tempData,
        xAxis: 'valence',
        yAxis: 'energy',
        playlistId: '',
        options: getOptions('','')
      }
    },
    methods: {
      blah: async function () {
        try {
          let response = await axios.get(
            "http://node-express-env.eba-wrkpfpwj.us-east-2.elasticbeanstalk.com/data/" + this.playlistId);
          let [labels, values] = createScatterArrays(response.data.tracks, this.xAxis, this.yAxis);
          let chartData = {
            labels: labels,
            datasets: [{
              label: response.data.name,
              data: values,
              borderWidth: 1,
              backgroundColor: '#000000'
            }]
          };
          this.options = getOptions(this.xAxis, this.yAxis);
          this.scatterData = chartData;
          this.showChart = true;
        }
        catch (e) {
          console.log(e);
          this.hello = "Problem finding playlist data"
        }
      },
    },
    components: {
      'scatter': Scatter
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
            min-wdth: 250px;
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

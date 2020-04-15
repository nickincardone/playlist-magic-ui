<template id="bblah">
  <div class="page-container nji-main">
    <div class="md-layout md-gutter md-alignment-center-center">
      <div
        class="md-layout-item md-small-size-95 md-medium-size-75 md-large-size-50 md-xlarge-size-40 nji-content-card">
        <div class="md-layout nji-column md-gutter md-alignment-center-center">
          <div class="md-layout-item md-display-3 nji-title">Playlist Magic</div>
          <div class="md-layout-item md-body-2 nji-subheader">Analyze your favorite Spotify playlist, or
            compare two to each other.
          </div>
          <playlist-input v-on:create-graph="createScatterGraph"/>
          <div style="margin-top: 20px;" class="md-layout-item md-body-2 nji-subheader">
            {{errorMessage}}
          </div>
          <md-progress-spinner v-if="showSpinner" :md-diameter="100" :md-stroke="10"
                               md-mode="indeterminate" style="margin: 40px;" id="spinner"></md-progress-spinner>
          <scatter v-if="showChart" :chart-data="scatterData" :options="chartOptions"/>
          <bar v-if="showChart" :chart-data="barData" :options="barOptions"/>
          <bar v-if="showChart" :chart-data="dateData" :options="dateOptions"/>
          <div id="bottom-page"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Scatter from './components/Scatter';
  import Input from './components/Input';
  import VueScrollTo from 'vue-scrollto';
  import Bar from './components/Bar';

  const tempData = {
    labels: ['test'],
    datasets: [{
      label: 'Scatter Dataset',
      data: [{
        x: .2,
        y: .2
      }]
    }]
  };

  const barData = {
    labels: [1990, 2000, 2005],
    datasets: [
      {
        label: 'Data One',
        backgroundColor: '#f87979',
        data: [40,10, 20]
      },
      {
        label: 'Data two',
        backgroundColor: '#f80979',
        data: [14,23, 15]
      }
    ]
  };

  function createBarChartData(playlist1, playlist2) {
    const genres1 = playlist1.genres;
    const labels = [];
    const data1 = [];
    let genresArray = Object.entries(genres1);
    genresArray.sort((a,b) => b[1] - a[1]);
    genresArray = genresArray.splice(0,playlist2 ? 8 : 12);
    genresArray.forEach((genre) => {
      labels.push(genre[0]);
      data1.push(genre[1]);
    });

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: playlist1.name,
          backgroundColor: '#9a989f',
          data: data1
        }
      ]
    };

    if (!playlist2) return chartData;
    const genres2 = playlist2.genres;

    const data2 = [];
    labels.forEach((label) => {
      data2.push(genres2[label] ? genres2[label] : 0);
    });
    let genresArray2 = Object.entries(genres2);
    genresArray2.sort((a,b) => b[1] - a[1]);
    genresArray2 = genresArray2.splice(0,8);
    genresArray2.forEach((genre) => {
      if (labels.indexOf(genre[0]) !== -1) return;
      labels.push(genre[0]);
      data1.push(genres1[genre[0]] ? genres1[genre[0]] : 0);
      data2.push(genre[1]);
    });

    chartData.datasets.push({
      label: playlist2.name,
      backgroundColor: '#ff8b46',
      data: data2
    });
    return chartData;
  }

  function createDateChartData(playlist1, playlist2) {
    const dates1 = playlist1.years;
    const labels = [];
    const data1 = [];

    Object.entries(dates1).forEach((date) => {
      labels.push(date[0]);
      data1.push(date[1]);
    });

    const dateData = {
      labels: labels,
      datasets: [
        {
          label: playlist1.name,
          backgroundColor: '#9a989f',
          data: data1
        }
      ]
    };

    if (!playlist2) return dateData;

    const dates2 = playlist2.years;
    const data2 = [];
    labels.forEach((label) => {
      data2.push(dates2[label] ? dates2[label] : 0);
    });

    Object.entries(dates1).forEach((date) => {
      if (labels.indexOf(date[0]) !== -1) return;
      labels.push(date[0]);
      data1.push(0);
      data2.push(date[1]);
    });

    dateData.datasets.push({
      label: playlist2.name,
      backgroundColor: '#ff8b46',
      data: data2
    });

    return dateData;
  }

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

  function getScatterOptions(xAxis, yAxis) {
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
          label: function (tooltipItem, data) {
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

  function getBarOptions() {
    return  {
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            min: 0
          },
          scaleLabel: {
            display: true,
            labelString: '# of Artists'
          }
        }]
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  function getDateOptions() {
    return  {
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            min: 0
          },
          scaleLabel: {
            display: true,
            labelString: '# of Artists'
          }
        }],
        xAxes: [{
          type: "time",
        }]
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  function cleanPlaylistID(dirtyPlaylistID) {
    const playlistIndex = dirtyPlaylistID.indexOf('playlist/');
    if (playlistIndex === -1) {
      return dirtyPlaylistID;
    }
    const questionIndex = dirtyPlaylistID.indexOf('?');
    const startIndex = playlistIndex + 9;
    const endIndex = questionIndex === -1 ? dirtyPlaylistID.length : questionIndex;
    return dirtyPlaylistID.substring(startIndex, endIndex);
  }

  export default {
    name: 'App',
    data: () => {
      return {
        errorMessage: '',
        showChart: false,
        showSpinner: false,
        scatterData: tempData,
        chartOptions: getScatterOptions('', ''),
        barData: barData,
        barOptions: getBarOptions(),
        dateData: barData,
        dateOptions: getDateOptions()
      }
    },
    methods: {
      createScatterGraph: async function (options) {
        this.showChart = false;
        this.showSpinner = true;
        this.errorMessage = '';
        try {
          // to make functional
          let response = await axios.get(
            "http://node-express-env.eba-wrkpfpwj.us-east-2.elasticbeanstalk.com/data/" + cleanPlaylistID(options.playlistId));


          let [labels, values] = createScatterArrays(response.data.tracks,
            options.xAxis,
            options.yAxis);
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
          let response2 = null;
          if (options.playlistId2 !== '') {
            response2 = await axios.get(
              "http://node-express-env.eba-wrkpfpwj.us-east-2.elasticbeanstalk.com/data/" + cleanPlaylistID(options.playlistId2));
            let [labels2, values2] = createScatterArrays(response2.data.tracks,
              options.xAxis,
              options.yAxis);
            chartData.datasets.push({
              label: response2.data.name,
              labels: labels2,
              data: values2,
              borderWidth: 1,
              backgroundColor: '#ff8b46'
            });
          }

          this.barData = createBarChartData(response.data, response2 ? response2.data : null);

          this.dateData = createDateChartData(response.data, response2 ? response2.data : null);

          this.chartOptions = getScatterOptions(options.xAxis, options.yAxis);
          this.scatterData = chartData;
          setTimeout(() => {
            this.showSpinner = false;
            this.showChart = true;
            setTimeout(() => {
              VueScrollTo.scrollTo('#bottom-page', 500);
            }, 500);
          }, 500);
        }
        catch (e) {
          console.log(e);
          this.errorMessage = "Problem finding playlist data";
          this.showSpinner = false;
        }
      },
    },
    components: {
      'bar': Bar,
      'scatter': Scatter,
      'playlist-input': Input
    }
  }
</script>

<style lang="scss">
  .nji-main {
    height: fit-content;
    background-color: #1f1f1f;
    padding: 10px;

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
        @media (max-width: 600px) {
          min-width: 310px;
        }

        .nji-title {
          margin: 20px;
        }

        .nji-subheader {
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

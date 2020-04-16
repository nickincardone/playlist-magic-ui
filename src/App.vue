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
          <playlist-input v-on:create-graph="createGraphs"/>
          <div style="margin-top: 20px;" class="md-layout-item md-body-2 nji-subheader">
            {{errorMessage}}
          </div>
          <md-progress-spinner v-if="showSpinner" :md-diameter="100" :md-stroke="10"
                               md-mode="indeterminate" style="margin: 40px;" id="spinner"/>
          <div id="scroll-point"></div>
          <scatter v-if="showChart" :chart-data="scatterData" :options="chartOptions"/>
          <bar v-if="showChart" :chart-data="barData" :options="barOptions"/>
          <bar v-if="showChart" :chart-data="dateData" :options="dateOptions"/>
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
  import ChartHelper from './helpers/chartHelper';

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
        scatterData: {},
        chartOptions: ChartHelper.getScatterOptions('', ''),
        barData: {},
        barOptions: ChartHelper.getBarChartOptions(),
        dateData: {},
        dateOptions: ChartHelper.getDateChartOptions(),
        oldPlaylistId1 : '',
        response1: null,
        oldPlaylistId2 : '',
        response2: null,
      }
    },
    methods: {
      createGraphs: async function (options) {
        this.showChart = false;
        this.showSpinner = true;
        this.errorMessage = '';
        try {
          if (options.playlistId !== this.oldPlaylistId1) {
            this.response1 = await axios.get(
              "http://node-express-env.eba-wrkpfpwj.us-east-2.elasticbeanstalk.com/data/" + cleanPlaylistID(options.playlistId));
          }
          this.oldPlaylistId1 = options.playlistId;

          if (options.playlistId2 === '') {
            this.response2 = null;
          } else if (options.playlistId2 !== this.oldPlaylistId2) {
            this.response2 = await axios.get(
              "http://node-express-env.eba-wrkpfpwj.us-east-2.elasticbeanstalk.com/data/" + cleanPlaylistID(options.playlistId2));
          }
          this.oldPlaylistId2 = options.playlistId2;

          this.scatterData = ChartHelper.createScatterGraphData(this.response1.data,
            this.response2 ? this.response2.data : null, options.xAxis, options.yAxis);
          this.chartOptions = ChartHelper.getScatterOptions(options.xAxis, options.yAxis);
          this.barData = ChartHelper.createBarChartData(this.response1.data, this.response2 ? this.response2.data : null);
          this.dateData = ChartHelper.createDateChartData(this.response1.data, this.response2 ? this.response2.data : null);

          setTimeout(() => {
            this.showSpinner = false;
            this.showChart = true;
            setTimeout(() => {
              VueScrollTo.scrollTo('#scroll-point', 500);
            }, 200);
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

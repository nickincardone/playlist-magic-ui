<template id="bblah">
  <div class="page-container nji-main">
    <div class="md-layout md-gutter md-alignment-center-center">
      <div class="md-layout-item md-size-50 nji-content-card">
        <div class="md-layout nji-column md-gutter md-alignment-center-center">
          <div class="md-layout-item md-display-3 nji-title">Playlist Magic</div>
          <div class="md-layout-item md-body-2 nji-subheader">Analyze your favorite playlist</div>
          <div class="md-layout-item nji-playlist-input">
            <md-field md-inline>
              <label>Initial Value</label>
              <md-input v-model="initial"></md-input>
            </md-field>
            <md-button class="md-raised" v-on:click="blah">Analyze</md-button>
          </div>
          <div style="margin-top: 20px;" class="md-layout-item md-body-2 nji-subheader">{{hello}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  axios.get(
    "http://node-express-env.eba-wrkpfpwj.us-east-2.elasticbeanstalk.com/dates/0aHp3o7GazTz7sXYvM0kOs")
  .then((response) => {
    console.log(response.data)
  });

  export default {
    name: 'App',
    data: () => {
      return {
        hello: '',
        initial: 'Spotify Playlist ID'
      }
    },
    methods: {
      blah: async function () {
        try {
          let response = await axios.get(
            "http://node-express-env.eba-wrkpfpwj.us-east-2.elasticbeanstalk.com/dates/" + this.initial);
          this.hello = response.data;
        }
        catch (e) {
          this.hello = "Problem finding playlist data"
        }
      }
    },
    components: {}
  }
</script>

<style lang="scss">
  .nji-main {
    height: 100%;
    background-color: #1f1f1f;

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
          margin-bottom: 40px;
        }

        .nji-playlist-input {
          .md-field {
            min-wdth: 250px;
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

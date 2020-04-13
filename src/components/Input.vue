<template>
  <div id="nji-playlist-input" class="md-layout-item">
    <md-dialog :md-active.sync="showParamDialog">
      <md-dialog-title>Parameters Descriptions</md-dialog-title>
      <ul style="padding-right: 20px">
        <li><b>Valence</b>: A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track</li>
        <li><b>Energy</b>: Represents a perceptual measure of intensity and activity.</li>
        <li><b>Danceability</b>: Describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.</li>
        <li><b>Popularity</b>: The popularity of the track from 0 to 100 as calculated by Spotify</li>
        <li><b>Speechiness</b>: The presence of spoken words in a track</li>
        <li><b>Acousticness</b>: A confidence measure from 0.0 to 1.0 of whether the track is acoustic</li>
        <li><b>Instrumentalness</b>: Predicts whether a track contains no vocals.</li>
        <li><b>Liveness</b>: Represent the probability a track is being performed live</li>
        <li><b>Tempo</b>: The overall estimated tempo of a track in beats per minute (BPM)</li>
      </ul>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showParamDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog :md-active.sync="showHowToDialog">
      <md-dialog-title>How to find Spotify Playlist ID</md-dialog-title>
      <ol style="padding-right: 20px">
        <li>Open Playlist on Spotify</li>
        <li>Go to share</li>
        <li>Click "Copy Spotify URI" (On mobile you can just click "Copy Link")</li>
      </ol>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showHowToDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
    <div>
      <a v-on:click="showHowToDialog = true">How do I find a playlist's ID?</a>
      /
      <a v-on:click="showParamDialog = true">What do the parameters mean?</a>
    </div>
    <md-field>
      <label class="center-label">Playlist 1 ID or Link</label>
      <md-input v-model="options.playlistId"></md-input>
    </md-field>
    <md-field>
      <label class="center-label">Playlist 2 ID or Link (optional)</label>
      <md-input v-model="options.playlistId2"></md-input>
    </md-field>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label>X Axis</label>
          <md-select v-model="options.xAxis" name="xAxis" id="xAxis">
            <md-option value="valence">Valence</md-option>
            <md-option value="energy">Energy</md-option>
            <md-option value="danceability">Danceability</md-option>
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
          <label>Y Axis</label>
          <md-select v-model="options.yAxis" name="yAxis" id="yAxis">
            <md-option value="valence">Valence</md-option>
            <md-option value="energy">Energy</md-option>
            <md-option value="danceability">Danceability</md-option>
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
    <md-button class="md-raised" v-on:click="$emit('create-graph', options)">Analyze</md-button>
  </div>
</template>

<script>
  export default {
    name: "Input",
    data: function () {
      return {
        showParamDialog: false,
        showHowToDialog: false,
        options: {
          xAxis: 'valence',
          yAxis: 'energy',
          playlistId: '',
          playlistId2: '',
        },
      }
    },
  }
</script>

<style lang="scss">
  #nji-playlist-input {
    padding: 15px;

    .md-field {
      min-width: 250px;
    }

    .center-label {
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
    }

    input {
      text-align: center;
    }
  }
</style>
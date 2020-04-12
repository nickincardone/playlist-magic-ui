<template>
  <div class="md-layout-item nji-playlist-input">
    <md-dialog :md-active.sync="showDialog">
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
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-field>
      <label class="center-label">Playlist 1 ID</label>
      <md-input v-model="options.playlistId"></md-input>
    </md-field>
    <md-field>
      <label class="center-label">Playlist 2 ID (optional)</label>
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
    <div style="margin: 20px"><a v-on:click="showDialog = true">What do the parameters mean?</a></div>
    <md-button class="md-raised" v-on:click="$emit('create-graph', options)">Analyze</md-button>
  </div>
</template>

<script>
  export default {
    name: "Input",
    data: function () {
      return {
        showDialog: false,
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

</style>
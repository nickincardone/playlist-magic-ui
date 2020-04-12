<template>
  <div class="md-layout-item nji-playlist-input">
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
    <md-button class="md-raised" v-on:click="$emit('create-graph', options)">Analyze</md-button>
  </div>
</template>

<script>
  export default {
    name: "Input",
    data: function () {
      return {
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

<style scoped>

</style>
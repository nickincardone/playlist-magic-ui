class ChartHelper {
  static backgroundColor1 = '#9a989f';
  static backgroundColor2 = '#ff8b46';

  static createBarChartData = (playlist1, playlist2) => {
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
          backgroundColor: this.backgroundColor1,
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
      backgroundColor: this.backgroundColor2,
      data: data2
    });
    return chartData;
  };

  static createDateChartData= (playlist1, playlist2) => {
    const dates1 = playlist1.years;
    const labels = [];
    const data1 = [];
    //let minDate = '2015';

    Object.entries(dates1).forEach((date) => {
      labels.push(date[0]);
      data1.push(date[1]);
    });

    const dateData = {
      labels: labels,
      datasets: [
        {
          label: playlist1.name,
          backgroundColor: this.backgroundColor1,
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

    Object.entries(dates2).forEach((date) => {
      if (labels.indexOf(date[0]) !== -1) return;
      labels.push(date[0]);
      data1.push(0);
      data2.push(date[1]);
    });

    dateData.datasets.push({
      label: playlist2.name,
      backgroundColor: this.backgroundColor2,
      data: data2
    });

    return dateData;
  };

  static createScatterGraphData = (playlist1, playlist2, xAxis, yAxis) => {
    const labels1 = [];
    const data1 = [];

    playlist1.tracks.forEach(function (track) {
      data1.push({
        x: track[xAxis],
        y: track[yAxis]
      });
      labels1.push(track.name + " by " + track.artist);
    });

    let chartData = {
      labels: labels1,
      datasets: [{
        label: playlist1.name,
        labels: labels1,
        data: data1,
        borderWidth: 1,
        backgroundColor: this.backgroundColor1
      }]
    };

    if (!playlist2) return chartData;

    const labels2 = [];
    const data2 = [];

    playlist2.tracks.forEach(function (track) {
      data2.push({
        x: track[xAxis],
        y: track[yAxis]
      });
      labels2.push(track.name + " by " + track.artist);
    });

    chartData.datasets.push({
      label: playlist2.name,
      labels: labels2,
      data: data2,
      borderWidth: 1,
      backgroundColor: this.backgroundColor2
    });

    return chartData;
  };

  static getScatterOptions(xAxis, yAxis) {
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

  static getBarChartOptions= () => {
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
  };

  static getDateChartOptions = (labels) => {
    let min = 2015;
    let max = 0;

    labels.forEach((label) => {
      if (parseInt(label) < min) min = parseInt(label);
      if (parseInt(label) > max) max = parseInt(label);
    });

    return  {
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            min: 0
          },
          scaleLabel: {
            display: true,
            labelString: '# of Songs'
          }
        }],
        xAxes: [{
          type: "time",
          bounds: 'data',
          ticks: {
            max: '' + (max + 1),
            min: '' + (min - 1)
          }
        }]
      },
      responsive: true,
      maintainAspectRatio: false
    };
  };

}

export default ChartHelper;
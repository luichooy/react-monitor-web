export default {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#283b56'
      }
    }
  },
  legend: {},
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLabel: {
      rotate: -60,
      // formatter(value) {
      //   return value.split(' ')[1];
      // }
    }
  },
  yAxis: [
    {
      type: 'value',
      name: '请求次数',
      min: 0,
      boundaryGap: [
        0,
        0.2
      ],
      axisLine: {
        lineStyle: {
          color: '#c23531'
        }
      },
      splitLine: {
        show: false
      }
    },
    {
      type: 'value',
      name: '时间(ms)',
      min: 0,
      boundaryGap: [
        0,
        0.2
      ],
      axisLine: {
        lineStyle: {
          color: '#2f4554'
        }
      },
      splitLine: {
        show: false
      }
    }
  ],
  series: [
    {
      name: '请求次数',
      type: 'line',
      smooth: true
    },
    {
      name: '响应时间',
      type: 'line',
      yAxisIndex: 1,
      smooth: true
    }
  ],
  dataset: {
    dimensions: [
      'time',
      '请求次数',
      '响应时间'
    ],
    source: []
  }
};

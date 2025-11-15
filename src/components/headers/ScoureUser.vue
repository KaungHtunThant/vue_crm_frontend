<template>
  <div
    class="me-2 pt-1"
    ref="gaugeChart"
    style="width: 40px; height: 40px"
  ></div>
</template>
<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      score: 80,
    };
  },
  mounted() {
    this.initGauge();
  },
  methods: {
    initGauge() {
      const chart = echarts.init(this.$refs.gaugeChart);

      const getScoreColor = (score) => {
        if (score <= 25) return "#A00000";
        if (score >= 26 && score <= 35) return "#FF0000";
        if (score >= 36 && score <= 60) return "#FFA500";
        if (score >= 61 && score <= 75) return "#90EE90";
        if (score >= 76 && score <= 100) return "#006400";
        return "#eee";
      };

      const scoreColor = getScoreColor(this.score);

      const option = {
        series: [
          {
            type: "gauge",
            radius: "85%",
            startAngle: 225,
            endAngle: -45,
            min: 0,
            max: 100,
            axisLine: {
              lineStyle: {
                width: 3,
                color: [
                  [this.score / 100, scoreColor],
                  [1, "#eee"],
                ],
              },
            },
            pointer: { show: false },
            detail: {
              show: true,
              valueAnimation: true,
              formatter: "{value}",
              color: "#fff",
              fontSize: 10,
              offsetCenter: [0, "13%"],
            },
            title: { show: false },
            splitLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            data: [
              {
                value: this.score,
              },
            ],
          },
        ],
      };

      chart.setOption(option);
    },
  },
  watch: {
    score() {
      this.initGauge();
    },
  },
};
</script>

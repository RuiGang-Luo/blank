<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <table-list />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <notice-list />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <label class="topcontent">统一接入访问次数</label>
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <label class="topcontent">接口访问次数</label>
          <line-chartb :chart-data="lineChartbData" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import NoticeList from './components/noticeList'
import TableList from './components/tableList'
import LineChart from './components/LineChart'
import LineChartb from './components/LineChartb'

const lineChartData = {
  newVisitis: {
    expectedData: [0, 100, 120, 80, 200, 160]
  },

  interfaceVisitis: {
    actualData: [0, 40, 20, 50, 50]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    NoticeList,
    TableList,
    LineChart,
    LineChartb
  },
  data () {
    return {
      lineChartData: lineChartData.newVisitis,
      lineChartbData: lineChartData.interfaceVisitis
    }
  }
}

</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    position: relative;
    top: -5px;
    background: #fff;
    padding: 5px 15px 10px;
    margin-bottom: 32px;
  }
}
.topcontent{
  font-size: 20px;
  margin: 0px 10px;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

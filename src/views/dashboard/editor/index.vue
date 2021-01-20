<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <panel-group @handleSetLineChartData="handleSetLineChartData" />
      <el-row v-show="displaytype === 'messages'" style="background:#fff;padding:16px 16px 0;margin-bottom:5px;">
        <line-chart :chart-data="lineChartData" width="100%" />
      </el-row>
      <el-row v-show="displaytype === 'newlist'" style="background:#fff;padding:16px 16px 0;margin-bottom:5px;">
        <notice-list />
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'
import LineChart from '../admin/components/LineChart'
import NoticeList from './components/noticeList'

const lineChartData = {
  newVisitis: {
    expectedData: [0, 100, 120, 80, 200, 160]
  }
}

export default {
  name: 'DashboardEditor',
  components: {
    PanelGroup,
    LineChart,
    NoticeList

  },
  data() {
    return {
      displaytype: 'messages',
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
      lineChartData: lineChartData.newVisitis
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  methods: {
    handleSetLineChartData(type) {
      this.displaytype = type
    }
  }
}
</script>

<style lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 85vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;

    }
    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;
      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }
</style>

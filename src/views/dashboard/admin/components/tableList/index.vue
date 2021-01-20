<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <label class="font">访问统计</label>
      <ul class="filters header-right">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ val.text }}</a>
        </li>
      </ul>
    </header>
    <!-- main section -->
    <section v-show="visibility === 'visittime'" class="main">
      <el-table highlight-current-row size:medium :data="filteredTodos" class="tablecontent">
        <el-table-column prop="date" label="时间" width="180" />
        <el-table-column prop="number" label="次数" width="180" />
      </el-table>
    </section>
    <section v-show="visibility === 'visitaddress'" class="main">
      <el-table highlight-current-row size:medium :data="addressTodos" class="tablecontent">
        <el-table-column prop="ip" label="ip" width="180" />
        <el-table-column prop="number" label="次数" width="180" />
      </el-table>
    </section>
  </section>
</template>

<script>
const filters = {
  visittime: { list: todotimes => todotimes.filter(todo => todo.type === 'visittime'), text: '时间' },
  visitaddress: { list: todoaddresses => todoaddresses.filter(todo => todo.type === 'visitaddress'), text: '地址' }
}
const addressList = [
  { ip: '10.253.77.1', number: '10', router: '', type: 'visitaddress' },
  { ip: '10.253.77.2', number: '9', router: '', type: 'visitaddress' },
  { ip: '10.253.77.3', number: '8', router: '', type: 'visitaddress' },
  { ip: '10.253.77.4', number: '7', router: '', type: 'visitaddress' },
  { ip: '10.253.77.5', number: '6', router: '', type: 'visitaddress' }
]
const timeList = [
  { number: '50', router: '', date: '2019-07-31', type: 'visittime' },
  { number: '40', router: '', date: '2019-07-30', type: 'visittime' },
  { number: '30', router: '', date: '2019-07-29', type: 'visittime' },
  { number: '20', router: '', date: '2019-07-28', type: 'visittime' },
  { number: '10', router: '', date: '2019-07-27', type: 'visittime' }
]
export default {
  filters: {
    pluralize: (n, w) => n === 1 ? w : w + 's',
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
  },
  data () {
    return {
      visibility: 'visittime',
      filters,
      todotimes: timeList,
      todoaddresses: addressList
    }
  },
  computed: {
    filteredTodos () {
      // console.log(filters[this.visibility].list(this.todotimes))
      return filters[this.visibility].list(this.todotimes)
    },
    addressTodos () {
      return filters[this.visibility].list(this.todoaddresses)
    }
  }

}
</script>

<style lang="scss">
  @import './index.scss';
  .header {
    .bell-font{
      font-size: 30px;
      margin: 0px 10px;
    }
    .font{
      font-size: 20px;
    }
    .header-right{
      float: right;
    }
  }
  .tablecontent{
    margin: 0 auto;

  }
</style>

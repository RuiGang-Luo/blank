<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header" style="width: 950px">
      <i class="el-icon-bell bell-font" />
      <label class="font">通知公告</label>
      <ul class="filters header-right">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ val.text }}</a>
        </li>
      </ul>
    </header>
    <!-- main section -->
    <section v-show="todos.length" class="main" style="width: 950px">
      <ul class="todo-list">
        <todo
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
        />
      </ul>
    </section>
  </section>
</template>

<script>
import Todo from './Notice.vue'

const STORAGE_KEY = 'todos'
const filters = {
  notice: { list: todos => todos.filter(todo => todo.type === 'notice'), text: '公告' }
}
const defalutList = [
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-04', type: 'notice' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-04', type: 'notice' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-04', type: 'notice' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-04', type: 'notice' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-04', type: 'notice' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-04', type: 'notice' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-04', type: 'notice' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-04', type: 'notice' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-04', type: 'notice' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-04', type: 'notice' }
]
export default {
  components: { Todo },
  filters: {
    pluralize: (n, w) => n === 1 ? w : w + 's',
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
  },
  data () {
    return {
      visibility: 'notice',
      filters,
      // todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || defalutList
      todos: defalutList
    }
  },
  computed: {
    allChecked () {
      return this.todos.every(todo => todo.done)
    },
    filteredTodos () {
      return filters[this.visibility].list(this.todos)
    },
    remaining () {
      return filters[this.visibility].list(this.todos).length
    }
  },
  methods: {
    setLocalStorage () {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    clearCompleted () {
      this.todos = this.todos.filter(todo => !todo.done)
      this.setLocalStorage()
    },
    toggleAll ({ done }) {
      this.todos.forEach(todo => {
        todo.done = done
        this.setLocalStorage()
      })
    }
  }
}
</script>

<style lang="scss">
  @import './index.scss';
  .header{
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
  .todoapp{
    width:1000px;
    margin: 5px 20px;
  }
</style>

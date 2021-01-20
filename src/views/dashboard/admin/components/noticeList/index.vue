<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <i class="el-icon-bell bell-font" />
      <label class="font">通知公告</label>
      <ul class="filters header-right">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ val.text }}</a>
        </li>
      </ul>
    </header>
    <!-- main section -->
    <section v-show="todos.length" class="main">
      <ul class="todo-list">
        <todo
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
        />
      </ul>
    </section>
    <!-- footer -->
    <!--<footer v-show="todos.length" class="footer">-->
    <!--<span class="todo-count">-->
    <!--<strong>{{ remaining }}</strong>-->
    <!--{{ remaining | pluralize('item') }}-->
    <!--</span>-->

    <!--&lt;!&ndash; <button class="clear-completed" v-show="todos.length > remaining" @click="clearCompleted">-->
    <!--Clear completed-->
    <!--</button> &ndash;&gt;-->
    <!--</footer>-->
  </section>
</template>

<script>
import Todo from './Notice.vue'

const STORAGE_KEY = 'todos'
const filters = {
  all: { list: todos => {
    const temps = []
    todos.forEach((todo) => {
      if (temps.length < 10) {
        temps.push(todo)
      } else {
        return
      }
    })
    return temps
  }, text: '全部' },
  apply: { list: todos => todos.filter(todo => todo.type === 'apply'), text: '申请' },
  exception: { list: todos => todos.filter(todo => todo.type === 'exception'), text: '异常' },
  notice: { list: todos => todos.filter(todo => todo.type === 'notice'), text: '公告' }
}
const defalutList = [
  { text: '蚂蚁金服提交注册审批', router: '', date: '2019-03-30', type: 'apply' },
  { text: 'Management-tp-core微服务报错信息：java.lang.NullPointerException', router: '', date: '2019-03-29', type: 'exception' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-28', type: 'notice' },
  { text: '蚂蚁金服提交注册审批', router: '', date: '2019-03-27', type: 'apply' },
  { text: 'Management-tp-core微服务报错信息：java.lang.NullPointerException', router: '', date: '2019-03-26', type: 'exception' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-25', type: 'notice' },
  { text: '蚂蚁金服提交注册审批', router: '', date: '2019-03-24', type: 'apply' },
  { text: 'Management-tp-core微服务报错信息：java.lang.NullPointerException', router: '', date: '2019-03-23', type: 'exception' },
  { text: 'Management-tp-core微服务报错信息：java.lang.NullPointerException', router: '', date: '2019-03-22', type: 'exception' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-21', type: 'notice' },
  { text: 'Management-tp-core微服务报错信息：java.lang.NullPointerException', router: '', date: '2019-03-20', type: 'exception' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-19', type: 'notice' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-18', type: 'notice' },
  { text: '蚂蚁金服提交注册审批', router: '', date: '2019-03-17', type: 'apply' },
  { text: '蚂蚁金服提交注册审批', router: '', date: '2019-03-16', type: 'apply' },
  { text: '蚂蚁金服提交注册审批', router: '', date: '2019-03-30', type: 'apply' },
  { text: 'Management-tp-core微服务报错信息：java.lang.NullPointerException', router: '', date: '2019-03-29', type: 'exception' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-28', type: 'notice' },
  { text: '蚂蚁金服提交注册审批', router: '', date: '2019-03-27', type: 'apply' },
  { text: 'Management-tp-core微服务报错信息：java.lang.NullPointerException', router: '', date: '2019-03-26', type: 'exception' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-25', type: 'notice' },
  { text: '蚂蚁金服提交注册审批', router: '', date: '2019-03-24', type: 'apply' },
  { text: 'Management-tp-core微服务报错信息：java.lang.NullPointerException', router: '', date: '2019-03-23', type: 'exception' },
  { text: 'Management-tp-core微服务报错信息：java.lang.NullPointerException', router: '', date: '2019-03-22', type: 'exception' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-21', type: 'notice' },
  { text: 'Management-tp-core微服务报错信息：java.lang.NullPointerException', router: '', date: '2019-03-20', type: 'exception' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-19', type: 'notice' },
  { text: '系统通知：2019年7月6日将进行停机维护', router: '', date: '2019-03-18', type: 'notice' },
  { text: '蚂蚁金服提交注册审批', router: '', date: '2019-03-17', type: 'apply' },
  { text: '蚂蚁金服提交注册审批', router: '', date: '2019-03-16', type: 'apply' }
]
export default {
  components: { Todo },
  filters: {
    pluralize: (n, w) => n === 1 ? w : w + 's',
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
  },
  data () {
    return {
      visibility: 'all',
      filters,
      // todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || defalutList
      todos: defalutList
    }
  },
  computed: {
    filteredTodos () {
      return filters[this.visibility].list(this.todos)
    },
    remaining () {
      console.log(filters[this.visibility].list(this.todos))
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
</style>

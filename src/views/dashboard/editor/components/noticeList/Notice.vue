<template>
  <li class="todo">
    <div class="view">
      <span class="inline-left">{{ todo.text | fixedLength(device==='mobile'?initTextLength/2:initTextLength) }}</span>
      <span class="inline-right" v-text="todo.date" />
    </div>
  </li>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Todo',
  filters: {
    fixedLength: (n, w) => {
      if (typeof w === 'number' && w > 3) {
        let char_length = 0
        let font_length = 0
        const font = [...n].filter(char => {
          if (char_length + font_length >= w) {
            return false
          } else if (!/[a-z|A-Z]/.test(char)) {
            font_length++
            return true
          } else {
            char_length += 0.5
            return true
          }
        })
        return font.length > w ? font.join('') + '...' : font.join('')
      } else {
        console.log('The length is not numeric or less than 4')
        return n
      }
    }
  },
  props: {
    todo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      initTextLength: 20
    }
  },
  computed: {
    ...mapGetters([
      'device'
    ])
  }

}
</script>
<style lang="scss">
  .todo{
    .view{
      &:hover{
          background-color: #c5ff99;
       }
      span{
        font-size: 14px;
      }
      span.inline-left{
        /*float: left;*/
      }
      span.inline-right{
        float: right;
      }
    }
  }
</style>

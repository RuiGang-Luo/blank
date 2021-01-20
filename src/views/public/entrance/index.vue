<template>
  <div class="entrance-container">
    <div><img :src="meituanImgSrc" @click="handleUrl(meituanUrl)"></div>
    <div><img :src="meituanImgSrc" ></div>
    <div><img :src="meituanImgSrc" ></div>
  </div>
</template>

<script>
    export default {
        name: 'Entrance',
        components: { },
        data() {
            return {
                meituanImgSrc: require('@/icons/meituan-entrance.png'),
                meituanUrl:'https://activity.waimai.meituan.com/acstatic/scan/index?restaurant=853398335794469&wlMaterialNo=322494_1'
            }
        },
        methods: {
            handleUrl(target){
                window.location.href = target
            },

        }
    }
</script>
<style lang="scss">
  .entrance-container{
    height:100vh;
    background-color: transparent;
    width:100%;
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto;

    div{
      width:100%;
      img{
        width: 100%;
        border-radius: 25px;
        margin: 0px 0px 10px 0px;
      }
    }
  }
</style>




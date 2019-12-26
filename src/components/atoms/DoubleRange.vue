<template>
  <div class="doubleRange">
    <div ref="ruler" class="ruler">
      <div class="thumb" :style="{left: ((minThumb - lowest) * 100 / range) + '%'}">{{minThumb}}</div>
      <div class="thumb" :style="{left: ((maxThumb - lowest) * 100 / range) + '%'}">{{maxThumb}}</div>
    </div>
    <div class="scalebar">
      <div class="valueLabel">{{lowest}}</div>
      <div class="valueLabel">{{highest}}</div>
    </div>
  </div>
</template>

<script>
//панелька справа с выбором фильтрации
export default {
  name: 'DoubleRange',
  props: {
  },
  data: ()=>{return {
    lowest: 150,
    highest: 550,
    minThumb: 155,
    maxThumb: 339
  }},
  computed: {
    range: function() {
      return this.highest - this.lowest
    },
  },
  methods: {
    piece: function() {
      return this.$refs.ruler.offsetWidth / this.range
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.doubleRange
  width 100%
  --thumbHeight 25px
  .ruler
    height 3px
    background-color #ccc
    box-shadow 0 0 3px 2px #aaa
    border-radius 25px
    box-sizing border-box
    margin 18px 10px
    position relative
  .scalebar
    display flex
    justify-content space-between
  .thumb
    margin-top -12px
    height var(--thumbHeight)
    min-width var(--thumbHeight)
    max-width var(--thumbHeight)
    line-height var(--thumbHeight)
    border-radius 100%
    background-color #0005
    box-shadow 0 0 3px 0px #999
    cursor pointer
    position absolute
    color white
    &:hover
      box-shadow 0 0 3px 1px white
  *
    margin 0
  .line
    display flex
    justify-content space-between
  .alignRight
      align-self flex-end
</style>

<template>
  <div class="DDSelect">
    <input ref="mainInput" @input="$emit('update:city', $event.target.value)" @keypress="pressEnter" type="text" :value="picked" @focusin="i_focus = true" @focusout="focout" :placeholder="ph">
    <ul class="dd" v-if="i_focus">
      <li @click="selectit(city)" v-for="city in cities.slice(1).filter(c=>c.toLowerCase().includes(picked.toLowerCase()))" :key="city">{{city}}</li>
    </ul>
  </div>
</template>

<script>


export default {
  name: 'DDSelect',
  props: {
    cities: Array,
    ph: String,
    picked: String
  },
  data: ()=>{return {
    //cities: ['London', 'Moscow', 'Japan'],
    //picked: '',
    i_focus: false,
  }},
  methods: {
    pressEnter(e) {
      if (e.keyCode === 13) {
        //window.console.log('13')
        this.$refs.mainInput.blur()
        this.i_focus = false
      }
    },
    focout() {
      setTimeout(x=>{this.i_focus = false},250)
    },
    selectit(city) {
      this.i_focus = false
      //this.picked = city
      //console.log(city)
      this.$emit('update:city', city)
    }
  },
  // watch: {
  //   picked(new1) {
  //     this.$emit('update:city', new1)
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.DDSelect
  position relative
  input
    width 100%
    border-radius 10px
    border 0
    height 36px
    box-shadow 0px 2px 15px rgba(0, 0, 0, 0.1)
    padding 0 12px
    font-family: Montserrat, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 15px;
    background-image url('./../../../public/assets/arrow2.png')
    background-repeat no-repeat
    background-position right 11px center
    
    &::placeholder
      color black
      opacity .3
.dd
  position absolute
  background-color white
  color black
  z-index 1
  list-style none
  padding 0
  width 100%
  cursor pointer
  font-family: Montserrat, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 30px;
  user-select: none;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.1);
  li
    padding 2px 12px
    &:hover
      background-color var(--violet-btn-color)
      color white

</style>

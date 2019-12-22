<template>
  <div class="home">
    Карта:
    <ul>
      <li>на страничке Вакансии - список всех вакансий в базе</li>
      <li>на страничке Публиция - публикация и список собственных опубликованных именно этим пользователем</li>
      <li>по адресу /jobs.json - список всех вакансий в формате json</li>
    </ul>
    
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    //HelloWorld
  }
}
</script>

<style lang="stylus">
.home
  margin 0
  text-align left
</style>
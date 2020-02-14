<template>
  <div class="q-pr-md" style="min-width: 270px">
    <q-list bordered padding class="rounded-borders text-primary">
      <q-item
        v-for="(lr, index) in localroutes"
        :key="index"
        clickable
        :active="localRoute === lr.r"
        @click="$emit('setLocalRoute', lr.r)"
        active-class="my-menu-link"
      >
        <q-item-section>{{lr.l}}</q-item-section>
      </q-item>
      <q-separator spaced />
      <q-item
        clickable
        :active="localRoute == localroutesX.r"
        @click="$emit('setLocalRoute', localroutesX.r)"
        active-class="my-menu-link"
      >
        <q-item-section>{{localroutesX.l}}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>

export default {
  name: 'ProfileNav',
  props: {
    localRoute: String,
    localroutes: Array,
    localroutesX: Object
  }
}
</script>

<style scoped lang="stylus">
.my-menu-link
  color white !important
  background var(--main-borders-color)//#248CEC
</style>

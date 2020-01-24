<template>
  <div class="q-pr-md" style="min-width: 270px">
    <q-list bordered padding class="rounded-borders text-primary">
      <q-item
        clickable

        :active="localRoute === 'published'"
        @click="$emit('setLocalRoute', 'published')"
        active-class="my-menu-link"
      >
        <q-item-section>Вакансии</q-item-section>
      </q-item>

      <q-item
        clickable

        :active="localRoute === 'responses'"
        @click="$emit('setLocalRoute', 'responses')"
        active-class="my-menu-link"
      >
        <q-badge color="positive" floating>5</q-badge>
        <q-item-section>Отклики</q-item-section>
      </q-item>

      <q-item
        clickable

        :active="localRoute === 'cabout'"
        @click="$emit('setLocalRoute', 'cabout')"
        active-class="my-menu-link"
      >

        <q-item-section>О компании</q-item-section>
      </q-item>

      <q-separator spaced />

      <q-item
        clickable

        :active="localRoute == 'settings'"
        @click="$emit('setLocalRoute', 'settings')"
        active-class="my-menu-link"
      >
        <q-item-section>Изменить пароль</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>

export default {
  name: 'EntProfileNav',
  props: {
    localRoute: String
    // showLiked: Boolean,
    // liked: Boolean,
    // way: String,
    // job: Object,
    // searchFilter: {type: String, default: ''},
    // lenses: {type: String, default: 'full'},
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
*
  margin 0
.my-menu-link
  color white
  background #248CEC
</style>

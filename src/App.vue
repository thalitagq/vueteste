<template>
  <v-app>
    <div id="app" class="" data-app>
      <transition name="fade">
        <div class="gap">
          <router-view></router-view>        
        </div>
      </transition>
    </div>
  </v-app>
</template>

<script>

</script>

<style>
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
      opacity: 0
    }
</style>

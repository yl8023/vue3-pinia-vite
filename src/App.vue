

<template>
  <div class="main-body">
    <router-view v-slot="{ Component }">
        <component :is="Component" />
    </router-view>
  </div>

</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
  setup() {
    return {
    }
  }
})
</script>
<style lang="less" scoped>
</style>


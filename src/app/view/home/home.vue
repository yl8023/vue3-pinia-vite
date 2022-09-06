<template>
  <div class="home-content">
    <sliderBar :activeName="active">
      <div>
        <router-view />
        <van-tabbar v-model="active" active-color="#ff9b15" inactive-color="#000" :before-change="tabbarBeforeChange">
          <van-tabbar-item name="note" to="/home/list/note" icon="notes-o">笔记本</van-tabbar-item>
          <van-tabbar-item name="todo" to="/home/list/todo" icon="todo-list-o">待办</van-tabbar-item>
          <van-tabbar-item name="add" class="tabbar-add">
            <addStatus v-model:active="addActive"></addStatus>
          </van-tabbar-item>
          <addItem v-model:active="addActive" :addType="active"></addItem>
        </van-tabbar>
      </div>
    </sliderBar>
    
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
import addStatus from './component/add-status.vue'
import sliderBar from './component/slider-bar.vue'
import addItem from './component/add-item.vue'
import { MemoType } from '@/common/constants';
import { useRoute, RouteLocationNormalizedLoaded } from 'vue-router';
export default defineComponent({
  name: 'home',
  components: {
    addStatus,
    sliderBar,
    addItem
  },
  setup() {
    const addActive: Ref<boolean> = ref(false) //底部add弹框的加号rive图标状态
    const active: Ref<MemoType> = ref(MemoType.note); //当前tab
    const route: RouteLocationNormalizedLoaded = useRoute()
    const tabbarBeforeChange = (name: any) => {
      if (name === 'add') {
        return false
      } else {
        return true
      }
    }
    
    onMounted(() => {
      active.value = route.params.type as MemoType
      
    })
    
    return {
      active,
      addActive,
      tabbarBeforeChange,
    }
  }
})
</script>
<style lang="less" scoped>
.van-tabbar-item {
  background-color: #fff;
}
.tabbar-add {
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  margin: auto;
  bottom: 0;
  width: 70px;
  height: 70px;
  background-color: #fff;
  border-radius: 50%;
}
</style>
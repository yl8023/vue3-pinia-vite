<template>
    <div class="todo-content">
        <van-nav-bar title="待办事项">
            <template #left>
                <van-icon name="arrow-left" @click="routerCancel" color="#000" />
            </template>
        </van-nav-bar>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { routerCancel } from "@/common/util";

export default defineComponent({
    name: 'todo',
    setup() {
        return {
            routerCancel
        }
    }
})
</script>
<style>
.todo-content {
    height: 100vh;
}
</style>
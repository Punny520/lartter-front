<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
</script>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: var(--el-color-primary-light-9);
}

.el-main {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--el-color-primary);
}
</style> 
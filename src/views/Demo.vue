<template>
  <div class="demo-container">
    <h2>推文展示 Demo</h2>
    <div class="posts-container">
      <!-- 纯文本推文 -->
      <PostNorm :post-data="textOnlyPost" />

      <!-- 单图推文 -->
      <PostNorm :post-data="singleImagePost" />

      <!-- 双图推文 -->
      <PostNorm :post-data="twoImagesPost" />

      <!-- 三图推文 -->
      <PostNorm :post-data="threeImagesPost" />

      <!-- 四图推文 -->
      <PostNorm :post-data="fourImagesPost" />

      <!-- 已点赞推文 -->
      <PostNorm :post-data="likedPost" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PostNorm from '../components/PostNorm.vue'

// 测试数据
const textOnlyPost = {
  type: 0,
  postNormDto: {
    id: 1,
    text: "这是一条纯文本推文，用于测试基本的文本显示效果。Hello World! 这是一条纯文本推文，用于测试基本的文本显示效果。",
    likeCount: 42,
    commentCount: 12,
    repostCount: 5,
    createTime: "2024-02-15T10:30:00",
    liked: false
  }
}

const singleImagePost = {
  type: 0,
  postNormDto: {
    id: 2,
    text: "这是一条单图推文，测试单张图片的显示效果。",
    url1: "https://picsum.photos/800/400",
    likeCount: 1234,
    commentCount: 89,
    repostCount: 23,
    createTime: "2024-02-15T09:15:00",
    liked: false
  }
}

const twoImagesPost = {
  type: 0,
  postNormDto: {
    id: 3,
    text: "这是一条双图推文，测试两张图片的布局效果。",
    url1: "https://picsum.photos/400/400",
    url2: "https://picsum.photos/401/400",
    likeCount: 9876,
    commentCount: 432,
    repostCount: 123,
    createTime: "2024-02-15T08:20:00",
    liked: false
  }
}

const threeImagesPost = {
  type: 0,
  postNormDto: {
    id: 4,
    text: "这是一条三图推文，测试三张图片的布局效果。",
    url1: "https://picsum.photos/402/800",
    url2: "https://picsum.photos/403/400",
    url3: "https://picsum.photos/404/400",
    likeCount: 15678,
    commentCount: 789,
    repostCount: 234,
    createTime: "2024-02-15T07:45:00",
    liked: false
  }
}

const fourImagesPost = {
  type: 0,
  postNormDto: {
    id: 5,
    text: "这是一条四图推文，测试四张图片的布局效果。",
    url1: "https://picsum.photos/405/400",
    url2: "https://picsum.photos/406/400",
    url3: "https://picsum.photos/407/400",
    url4: "https://picsum.photos/408/400",
    likeCount: 99999,
    commentCount: 8765,
    repostCount: 3456,
    createTime: "2024-02-15T06:30:00",
    liked: false
  }
}

const likedPost = {
  type: 0,
  postNormDto: {
    id: 6,
    text: "这是一条已点赞的推文，测试点赞状态的显示效果。❤️",
    url1: "https://picsum.photos/409/400",
    likeCount: 1000000,
    commentCount: 50000,
    repostCount: 12000,
    createTime: "2024-02-15T05:15:00",
    liked: true
  }
}
</script>

<style scoped>
.demo-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #1DA1F2;
  text-align: center;
}

.posts-container {
  border: 1px solid #eee;
  border-radius: 16px;
  overflow: hidden;
}
</style> 
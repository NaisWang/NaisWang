<template>
  <div>
    <ul id="content"></ul>
    <ul id="nav"></ul>
  </div>
</template>

<script>
import {MarkdownPreview} from "../src/js/MarkdownPreview";

import $ from "jquery"

export default {
  name: "ContentShow",
  data() {
    return {
      markdownPreview: null,
    }
  },
  mounted() {

    // 图片预览刷新
    this.$previewRefresh();
    this.$preview.on('close', () => {
      this.isShow = false
    })

    this.markdownPreview = new MarkdownPreview(this.$router, this.$route);
    this.markdownPreview.setMkContent("." + this.$route.path);

  },
}
</script>

<style scoped>

</style>
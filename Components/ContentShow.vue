<template>
  <div>
    <ul id="content"></ul>
    <ul id="nav"></ul>
  </div>
</template>

<script>
import {MarkdownPreview} from "../src/js/MarkdownPreview";

export default {
  name: "ContentShow",
  data() {
    return {
      markdownPreview: null
    }
  },
  mounted() {
    this.markdownPreview = new MarkdownPreview();
    this.markdownPreview.setMkContent("." + this.$route.path)
  }
}
</script>

<style scoped>

</style>
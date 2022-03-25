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
    this.markdownPreview = new MarkdownPreview( this.$router, this.$route, this.$previewRefresh);
    this.markdownPreview.setMkContent("." + this.$route.path);
  },
}
</script>

<style scoped>

</style>
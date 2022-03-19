<template>
  <div>
    <input type="search" id="fileSearchInput" placeholder="搜索...">
    <ul id="files"></ul>
    <ul id="content"></ul>
    <ul id="nav"></ul>
    <ul id="myUL"></ul>
  </div>
</template>

<script>
import {MarkdownPreview} from "./js/MarkdownPreview";
import {FilesShow} from "./js/FilesShow";
import {FileSearch} from "./js/FileSearch";

export default {
  data() {
    return {
      msg: 'OK'
    }
  },
  mounted() {
    this.$nextTick(() => {
      let markdownPreview = new MarkdownPreview();
      let filesShow = new FilesShow(markdownPreview);
      let fileSearch = new FileSearch();
      filesShow.setFilesContent();
    })
  }
}
</script>

<style lang="css" scoped>
h1 {
  color: red;
}
</style>

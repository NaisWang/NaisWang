<template>
  <div>
    <div class="top">
      <input type="search" id="fileSearchInput" placeholder="搜索...">
      <button id="allFileSearchButton" style="height: 26px; cursor: pointer">全文搜索</button>
      <button style="height: 26px; border-radius: 50%; margin-left: 10px; cursor: pointer"
              onclick="window.scrollTo({ left: 0,top: 0,behavior: 'smooth'})">
        置顶
      </button>
      <span id="topTitle"></span>
    </div>
    <ul id="files"></ul>
    <ul id="content"></ul>
    <ul id="nav"></ul>
    <div id="allFileSearch" class="hide">
      <input id="allFileSearchInput" type="search" placeholder="搜索..." @keyup.enter="allFileQuery()">
      <div id="showView">
      </div>
      <div id="allFileSearchNums" style="font-size: 12px;margin-top: 5px; color: yellow"></div>
    </div>
    <div id="shadow" style="display: none"></div>
  </div>
</template>

<script>
import {MarkdownPreview} from "./js/MarkdownPreview";
import {FilesShow} from "./js/FilesShow";
import {FileSearch} from "./js/FileSearch";
import {AllFileSearch} from "./js/allFileSearch";

import $ from "jquery"

export default {
  data() {
    return {
      msg: 'OK',
      allFileSearch: null,
      markdownPreview: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.markdownPreview = new MarkdownPreview();
      this.allFileSearch = new AllFileSearch(this.markdownPreview);
      let filesShow = new FilesShow(this.markdownPreview);
      let fileSearch = new FileSearch();
      filesShow.setFilesContent();
    })
  },
  methods: {
    allFileQuery() {
      this.allFileSearch.query($('#allFileSearchInput').val())
    }
  }

}
</script>

<style lang="css" scoped>
h1 {
  color: red;
}
</style>

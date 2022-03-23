<template>
  <div>
    <div class="top">
      <input type="search" id="fileSearchInput" placeholder="搜索...">
      <div id="allFileSearchButton">
        <svg t="1648025539535" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
             p-id="13634" width="32" height="32">
          <path
              d="M452.77 492H342c-82.71 0-150-67.29-150-150s67.29-150 150-150 150 67.29 150 150v110.77c0 21.632-17.598 39.23-39.23 39.23zM342 252c-49.626 0-90 40.374-90 90s40.374 90 90 90h90v-90c0-49.626-40.374-90-90-90z"
              fill="#4988FD" p-id="13635"></path>
          <path
              d="M342 832c-82.71 0-150-67.29-150-150s67.29-150 150-150h110.77c21.632 0 39.23 17.6 39.23 39.23V682c0 82.71-67.29 150-150 150z m0-240c-49.626 0-90 40.374-90 90s40.374 90 90 90 90-40.374 90-90v-90h-90z"
              fill="#4988FD" p-id="13636"></path>
          <path
              d="M682 492h-110.77C549.6 492 532 474.402 532 452.77V342c0-82.71 67.29-150 150-150s150 67.29 150 150-67.29 150-150 150z m-90-60h90c49.626 0 90-40.374 90-90s-40.374-90-90-90-90 40.374-90 90v90z"
              fill="#4988FD" p-id="13637"></path>
          <path
              d="M660 788c-70.58 0-128-57.42-128-128s57.42-128 128-128 128 57.42 128 128-57.42 128-128 128z m0-196c-37.496 0-68 30.504-68 68s30.504 68 68 68 68-30.504 68-68-30.504-68-68-68z"
              fill="#FF4B07" p-id="13638"></path>
          <path
              d="M802 832a29.9 29.9 0 0 1-21.212-8.788l-68-68c-11.716-11.714-11.716-30.71 0-42.426 11.714-11.714 30.71-11.714 42.426 0l68 68c11.716 11.714 11.716 30.71 0 42.426A29.908 29.908 0 0 1 802 832z"
              fill="#FF4B07" p-id="13639"></path>
        </svg>
      </div>
      <button style="cursor: pointer" class="back-to-top"
              onclick="window.scrollTo({ left: 0,top: 0,behavior: 'smooth'})">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon back-to-top-icon" viewBox="0 0 1024 1024"
             ariaLabelledby="back-to-top"><title id="back-to-top" lang="en">back-to-top icon</title>
          <g fill="currentColor">
            <path
                d="M512 843.2c-36.2 0-66.4-13.6-85.8-21.8-10.8-4.6-22.6 3.6-21.8 15.2l7 102c.4 6.2 7.6 9.4 12.6 5.6l29-22c3.6-2.8 9-1.8 11.4 2l41 64.2c3 4.8 10.2 4.8 13.2 0l41-64.2c2.4-3.8 7.8-4.8 11.4-2l29 22c5 3.8 12.2.6 12.6-5.6l7-102c.8-11.6-11-20-21.8-15.2-19.6 8.2-49.6 21.8-85.8 21.8z"></path>
            <path
                d="m795.4 586.2-96-98.2C699.4 172 513 32 513 32S324.8 172 324.8 488l-96 98.2c-3.6 3.6-5.2 9-4.4 14.2L261.2 824c1.8 11.4 14.2 17 23.6 10.8L419 744s41.4 40 94.2 40c52.8 0 92.2-40 92.2-40l134.2 90.8c9.2 6.2 21.6.6 23.6-10.8l37-223.8c.4-5.2-1.2-10.4-4.8-14zM513 384c-34 0-61.4-28.6-61.4-64s27.6-64 61.4-64c34 0 61.4 28.6 61.4 64S547 384 513 384z"></path>
          </g>
        </svg>
      </button>

      <div class="topRight">

        <div id="topTitle"></div>

        <div class="editPage">
          <svg t="1648026965228" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="4237" width="28" height="28">
            <path
                d="M384.659 571.632l70.172 70.036-93.508 23.304zM936.493 129.167l-35.479-35.412c-9.771-9.789-25.709-9.789-35.448 0L678.381 280.829l46.764 46.699-46.799-46.701-283.74 283.315 70.923 70.805 283.769-283.305 0.006 0.008 187.189-187.089c9.773-9.772 9.773-25.639 0-35.394z"
                fill="#00A0E9" p-id="4238"></path>
            <path
                d="M139.853 940.403c-29.676 0-53.818-24.155-53.818-53.848V205.064c0-29.676 24.143-53.818 53.818-53.818h590.182L622.396 258.88H193.723v573.886h573.832V406.3l107.638-107.675v587.931c0 29.692-24.142 53.848-53.817 53.848H139.853z"
                fill="#0071BC" p-id="4239"></path>
          </svg>
        </div>

      </div>

    </div>
    <ul id="files"></ul>


    <router-view :key="$route.path"></router-view>

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
import {FilesShow} from "./js/FilesShow";
import {FileSearch} from "./js/FileSearch";
import {AllFileSearch} from "./js/allFileSearch";

import $ from "jquery"

export default {
  data() {
    return {
      msg: 'OK',
      allFileSearch: null,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.allFileSearch = new AllFileSearch(this.$router);
      let filesShow = new FilesShow(this.$router);
      let fileSearch = new FileSearch();
      filesShow.setFilesContent();

      $(".topRight .editPage").on("click", function (e) {
        let title = $("#topTitle")[0].textContent
        if (title.endsWith(".md")) {
          window.open("https://github.com/NaisWang/NaisWang.github.io/edit/master" + title.replace(".", ""));
        }
      })

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

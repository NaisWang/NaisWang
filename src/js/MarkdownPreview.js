import $ from "jquery"
import MarkdownIt from "markdown-it";
import markdownItTocDoneRight from "markdown-it-toc-done-right";
import markdownitSup from "markdown-it-sup"
import markdownitSub from "markdown-it-sub"
import markdownitFootnote from "markdown-it-footnote"
import markdownitDeflist from "markdown-it-deflist"
import markdownitTaskLists from "markdown-it-task-lists"
import markdownitMark from "markdown-it-mark"
import markdownItAnchor from "markdown-it-anchor"
import slugify from "@sindresorhus/slugify";
import mathjax3 from "markdown-it-mathjax3"
import {hljs} from "./highlight";
import {assertSourceType} from "@babel/core/lib/config/validation/option-assertions";


export class MarkdownPreview {
  constructor($router, $route) {
    this.$router = $router
    this.$route = $route
    this.mkContent = "";
    this.$mkPreviewDiv = document.getElementById("content")
    this.$NavPreviewDiv = document.getElementById("nav")
    this.nav = [];
  }

  init() {
    this.$mkPreviewDiv.innerHTML = ""
    this.$NavPreviewDiv.innerHTML = ""
    this.nav = []
    this.mkContent = ""
    this.bindEvent()
  }

  bindEvent() {
    let that = this
    $("#nav").on("click", "a.linkClass", function (e) {
      e.preventDefault()
      let title = $(this).data("title")
      that.scrollToTitle(title)

      if (decodeURIComponent(title) !== decodeURIComponent(location.hash.substring(location.hash.lastIndexOf("#") + 1, location.hash.length))) {
        that.$router.push({path: "#" + $(this).data("title")})
        that.activeLi($(this).data("title"))
      }
    })

    //监听滚动栏停下来后，判断当前标题是什么
    document.onscroll = function () {
      let t1 = 0
      let t2 = 0
      let timer = null; // 定时器
      clearTimeout(timer);
      timer = setTimeout(() => {
        t2 = document.documentElement.scrollTop || document.body.scrollTop;
        if (t2 === t1) {
          let el = document.elementFromPoint(window.innerWidth / 2, 45)

          while (el != null && !el.tagName.startsWith("H")) {
            el = el.previousElementSibling;
          }
          if (el != null && el.id && decodeURIComponent(el.id) !== decodeURIComponent(location.hash.substring(location.hash.lastIndexOf("#") + 1, location.hash.length))) {
            that.$router.replace({hash: decodeURIComponent(el.id)})

            that.activeLi(decodeURIComponent(el.id))
          }
        }
      }, 100);
      t1 = document.documentElement.scrollTop || document.body.scrollTop;
    }

  }


  setMkContent(file) {
    if (file !== undefined) {
      this.init();
      if (file.endsWith(".pdf") || file.endsWith(".doc") || file.endsWith(".docx")) {
        let iframeNode = document.createElement('iframe');
        iframeNode.setAttribute("width", "100%");
        iframeNode.setAttribute("height", window.innerHeight - 45 + "px");
        if (file.endsWith(".pdf")) {
          iframeNode.setAttribute("src", file);
        } else {
          iframeNode.setAttribute("src", "https://view.officeapps.live.com/op/embed.aspx?src=https://naiswang.github.io/" + file);
        }
        this.$mkPreviewDiv.classList.add("other");
        this.$NavPreviewDiv.classList.add("other");
        this.$mkPreviewDiv.appendChild(iframeNode);
      } else {
        let that = this
        this.$mkPreviewDiv.classList.remove("other");
        this.$NavPreviewDiv.classList.remove("other");
        $.get(file, function (data) {
          that.mkContent = data
          that.previewContent(file)
          $('#topTitle').html(decodeURI(file))
        })
      }
    }
  }

  previewContent(file) {

    var md = MarkdownIt({
      html: true, //可以识别html
      linkify: true,//自动检测像链接的文本
      breaks: true,//回车换行
      typographer: true,//优化排版，标点
      //代码高亮
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return '<pre class="hljs"><code>' +
                hljs.highlight(lang, str, true).value +
                '</code></pre>';
          } catch (__) {
          }
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
      }
    })
        .use(mathjax3)
        .use(markdownitSub)
        .use(markdownitSup)
        .use(markdownitFootnote)
        .use(markdownitDeflist)
        .use(markdownitTaskLists)
        .use(markdownitMark)
        .use(markdownItAnchor, {
          permalink: false,
          permalinkBefore: false,
          permalinkSymbol: '#'
        })
        .use(markdownItTocDoneRight, {
          containerClass: 'toc',
          containerId: 'toc',
          listType: 'ul',
          listClass: 'listClass',
          itemClass: 'itemClass',
          linkClass: 'linkClass',
          callback: function (html, ast) {
            //把目录单独列出来
            document.getElementById("nav").innerHTML = html
          }
        });

    this.mkContent = md.render(this.mkContent);
    this.$mkPreviewDiv.innerHTML = this.mkContent;


    this.changeTocUrl()

    let that = this
    window.onload = function () {
      let title = decodeURIComponent(that.$route.hash.substring(1, that.$route.hash.length))
      that.scrollToTitle(title)
      that.activeLi(title)
    }

  }

  activeLi(title) {
    $("#nav li").removeClass("active")
    $(`#nav a[data-title='${title}']`)[0].parentNode.classList.add("active")
  }

  scrollToTitle(title) {
    window.scrollTo({
      top: document.getElementById(encodeURIComponent(title)).offsetTop,
      behavior: 'smooth'
    })
  }

  changeTocUrl() {
    document.querySelectorAll("a.linkClass").forEach(item => {
      item.setAttribute("data-title", decodeURIComponent(item.getAttribute("href").substring(1, 1000)))
    })
  }
}


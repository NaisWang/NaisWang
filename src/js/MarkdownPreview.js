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
  constructor($router, $route, $previewRefresh) {
    this.$previewRefresh = $previewRefresh
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
      that.activeLi(title)
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
          let el = null

          // 排除el匹配到的为空标签或者是为ul#content标签
          for (let i = 45; i < 500;) {
            el = document.elementFromPoint(window.innerWidth / 2, i)
            if (el != null && (el.hasAttribute("id") && el.id !== "content") || !el.hasAttribute("id")) {
              break
            }
            i += 3
          }

          // 使el匹配到的为ul#content的直接子标签，因为<h>标签一定是ul#content的直接子标签
          while (el != null && el.parentElement != null && (!el.parentElement.hasAttribute("id") || el.parentElement.id !== "content")) {
            el = el.parentElement
          }

          // 使el匹配到<h>标签
          while (el != null && !el.tagName.startsWith("H")) {
            el = el.previousElementSibling;
          }

          if (el != null && el.id && decodeURIComponent(encodeURIComponent(el.id)) !== decodeURIComponent(encodeURIComponent(location.hash.substring(location.hash.lastIndexOf("#") + 1, location.hash.length)))) {
            let href = location.href
            if (href.indexOf(".md#") !== -1) {
              href = href.substring(0, href.lastIndexOf("#") + 1) + decodeURIComponent(el.id)
            } else {
              href += "#" + decodeURIComponent(el.id);
            }
            history.replaceState(null, document.title, href)
            that.activeLi(el.id)
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
        })
      }
      $('#topTitle').html(decodeURI(file))
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
            document.getElementById("nav").style.height = $("body").clientHeight - 45 + "px"
            //把目录单独列出来
            document.getElementById("nav").innerHTML = html
          }
        });

    this.mkContent = md.render(this.mkContent);
    this.$mkPreviewDiv.innerHTML = this.mkContent;

    //给img标签添加preview属性
    $("#content img").attr("preview", "0")

    this.changeTocUrl()

    let that = this


    setTimeout(() => {
      // 标记对应文件目录
      $("#files li.selected").removeClass("selected");
      $(`#files li[data-path='.${decodeURIComponent(that.$route.path)}']`).addClass("selected");

      let title = decodeURIComponent(that.$route.hash.substring(1, that.$route.hash.length))
      that.scrollToTitle(title)
      that.activeLi(title)

      // 图片预览刷新
      that.$previewRefresh();

    }, 500)

  }

  activeLi(title) {
    if (title) {
      title = decodeURIComponent(title)
      $("#nav li").removeClass("active")
      $(`#nav a[data-title='${title}']`)[0].parentElement.classList.add("active")
    }
  }

  scrollToTitle(title) {
    if (title) {
      window.scrollTo({
        top: document.getElementById(encodeURIComponent(title)).offsetTop,
        behavior: 'smooth'
      })
    }
  }

  changeTocUrl() {
    document.querySelectorAll("a.linkClass").forEach(item => {
      item.setAttribute("data-title", decodeURIComponent(item.getAttribute("href").substring(1, 1000)))
    })
  }
}


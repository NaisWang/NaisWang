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
import mathjax3 from "markdown-it-mathjax3"
import {hljs} from "./highlight";


export class MarkdownPreview {
  constructor() {
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
  }

  setMkContent(file) {
    if (file !== undefined) {
      this.init();
      if (file.endsWith(".pdf") || file.endsWith(".doc") || file.endsWith("docx")) {
        let iframeNode = document.createElement('iframe');
        iframeNode.setAttribute("width", "100%");
        iframeNode.setAttribute("height", "100%");
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
          that.previewContent()
          $('#topTitle').html(file)
        })
      }
    }
  }

  previewContent() {

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
  }
}


/**
 * 全文搜索功能
 */
import $ from "jquery"

export class AllFileSearch {

  constructor($router) {
    this.$router = $router
    this.allFileSearchJson = null;
    this.init()
  }

  init() {
    this.allFileSearchTxtToJson();
    this.bindEvent()
  }

  bindEvent() {
    let that = this
    $("#showView").on("click", ".card", function (e) {
      let filePath = $(this).data("path");
      filePath = filePath.replaceAll("\./", "");
      that.$router.push({path: `/${filePath}`})
      that.hideSearchDiv()
    })

    $("#shadow").click(function (e) {
      that.hideSearchDiv()
    })

    $(document).keyup(function (e) {
      if (e.keyCode === 221) {
        that.showSearchDiv()
      }
    })

    $("#allFileSearchButton").click(function (e) {
      that.showSearchDiv()
      e.stopPropagation()
    })

  }

  showSearchDiv() {
    $('#shadow').show()
    $('#allFileSearch').removeClass('hide')
    $('#allFileSearch input').focus()
  }

  hideSearchDiv() {
    $('#allFileSearch').addClass('hide')
    $('#shadow').hide()
  }

  allFileSearchTxtToJson() {
    $.get("./allFileSearch.txt", (data) => {
      this.allFileSearchJson = JSON.parse(data);
    })
  }

  query(text) {
    let isAllFlag = true
    let ans = []
    for (let i = 0; i < this.allFileSearchJson.length; i++) {
      let item = this.allFileSearchJson[i];
      let positions = this.searchSubStr(item.body, text);
      if (positions.length !== 0) {
        positions.forEach(matchIndex => {
          let result = {}
          result["title"] = item.title
          result["body"] = item.body.substring(matchIndex - 30, matchIndex + 30)
          result["body"] = result["body"].replace(text, "<span style='color: red'>" + text + "</span>")
          ans.push(result);
        })
      }
    }

    let showView = document.getElementById("showView");
    showView.innerHTML = "";
    let generateCardNums = ans.length > 200 ? 200 : ans.length;
    for (let i = 0; i < generateCardNums; i++) {
      let item = ans[i];
      showView.innerHTML = showView.innerHTML + "<div class='card' data-path='" + item['title'] + "'>\n" +
          "                <div class=\"card-header\">" + item['title'] + "</div>\n" +
          "                <div class=\"card-body\">\n" +
          "                    <p class=\"card-text\">" + item['body'] + "</p>\n" +
          "                </div>\n" +
          "            </div>";
    }

    $("#allFileSearchNums").html("总符合数：" + ans.length + " ； 展示数：" + generateCardNums);
  }


  searchSubStr(str, subStr) {
    let positions = []
    let pos = str.indexOf(subStr);
    while (pos > -1) {
      positions.push(pos);
      pos = str.indexOf(subStr, pos + 1);
    }
    return positions
  }


}


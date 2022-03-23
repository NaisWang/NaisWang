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
      let title = e.currentTarget.children[0].children[0].textContent.toLowerCase().replaceAll(" ", "")
      let searchContent = e.currentTarget.children[1].children[0].textContent
      let filePath = $(this).data("path");
      filePath = filePath.replaceAll("\./", "");
      that.$router.push({path: `/${filePath}${title}`})
      that.hideSearchDiv()
    })

    $("#shadow").click(function (e) {
      that.hideSearchDiv()
    })

    $(document).keyup(function (e) {
      // 按下 /
      if (e.keyCode === 221) {
        that.showSearchDiv()
      }

      // 按下 ESC
      if (e.keyCode === 27) {
        that.hideSearchDiv()
      }
    })

    $("#allFileSearchButton").click(function (e) {
      that.showSearchDiv()
      e.stopPropagation()
    })

  }

  replaceStr(str) {
    return str.replaceAll("-", "").replaceAll("*", "").replace("#", "").replace("`", "");
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
      //let tempBody = item.body
      if (positions.length !== 0) {
        positions.forEach(matchIndex => {
          //tempBody = tempBody.substring(matchIndex + 1, tempBody.length)
          let result = {}
          result["title"] = item.title
          result["header"] = this.findTitle(item.body, matchIndex)
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
          "                <div class=\"card-header\">" + item['title'] + "-------" + "<span class='card-header-detail' style='color:cadetblue'>" + item['header'] + "</span></div>\n" +
          "                <div class=\"card-body\">\n" +
          "                    <p class=\"card-text\">" + item['body'] + "</p>\n" +
          "                </div>\n" +
          "            </div>";
    }

    $("#allFileSearchNums").html("总符合数：" + ans.length + " ； 展示数：" + generateCardNums);
  }

  // 查找位于matchIndex前最近的标题
  findTitle(str, matchIndex) {
    str = str.replace(/[ ]*```([\s\S](?!```))+\n[ ]*```/g, function (word) {
      return word.replaceAll("#", "*")
    })
    let index = str.lastIndexOf("#", matchIndex);
    return str.substring(index, str.indexOf("\n", index))
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


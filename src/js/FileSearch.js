import $ from "jquery"

export class FileSearch {
  constructor() {
    this.$fileInput = $("#fileSearchInput")
    this.$filesPreviewDiv = $("#files")
    this.init()
  }

  init() {
    this.bindEvent();
  }

  bindEvent() {
    let that = this;
    this.$fileInput.on('keyup', function () {
      that.search($(this).val());
    })

    this.$fileInput.on('search', function () {
      that.search("");
    })

    $(document).keyup(function (e) {
      if (e.keyCode === 191) {
        that.$fileInput.focus();
      }
    })

  }

  search(searchContent) {
    this.unflodAll();
    let fileLists = this.$filesPreviewDiv.find("li:not(.parent)").toArray();
    fileLists.forEach((item) => {
      if (!$(item).html().toLowerCase().includes(searchContent.toLowerCase())) {
        $(item).removeClass('show')
        $(item).addClass('hide')
      } else {
        $(item).addClass('show')
        $(item).remove('hide')
      }
    })
    this.hideParentNode();
  }

  hideParentNode() {
    let parentNodes = this.$filesPreviewDiv.find("li.parent").toArray();
    parentNodes.forEach((item) => {
      if ($(item).find("li:not('parent').show").length === 0) {
        $(item).addClass('hide');
      } else {
        $(item).removeClass('hide');
      }
    })

  }

  unflodAll() {
    $("#files").find("ul").css('display', '');
    $("#files").find("ul li:not(.parent)").removeClass('hide').addClass('show');
    $("#files .parent").removeClass('close').addClass('open');
  }
}

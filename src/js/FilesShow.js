import $ from "jquery"

export class FilesShow {

  constructor($router) {
    this.$router = $router
    this.$filsPreviewDiv = document.getElementById("files")
    this.filesJson = {}
    this.setFilesContent();
    this.init();
  }

  init() {
    this.bindEvent();
  }

  bindEvent() {
    let that = this;
    $("#files").on("click", "li", function (e) {
      if ($(this).hasClass('parent')) {
        if ($(this).hasClass('open')) {
          $(this).removeClass('open');
          $(this).addClass('close');
          $(this).children().slideUp(500)
        } else {
          $(this).removeClass('close');
          $(this).addClass('open');
          $(this).children().slideDown(500)
        }
      } else {
        $("#files li.selected").removeClass("selected");
        $(this).addClass("selected");
        let filePath = $(this).data("path");
        $('title').html($(this).html())
        filePath = filePath.replaceAll("\./", "");
        that.$router.push({path: `/${filePath}`})
      }
      e.stopPropagation();
    })
  }

  setFilesContent() {
    let that = this;
    $.get("./files.txt", function (data) {
      that.filesJson = JSON.parse(data);
      that.previewFilesContent()
    });
  }

  previewFilesContent() {
    this.$filsPreviewDiv.innerHTML = ""
    this.$filsPreviewDiv.appendChild(this.generateFilesUl("", this.filesJson, "./notes"));
  }

  generateFilesUl(name, target, path) {
    if (target.constructor !== Object) {
      let liNode = document.createElement('li');
      liNode.setAttribute('data-path', path);
      liNode.classList.add("show")
      liNode.innerHTML = target;
      return liNode;
    }
    let liNode = document.createElement('li');
    liNode.classList.add('parent');
    liNode.classList.add('open');
    liNode.innerHTML = name;
    let UlNode = document.createElement('ul');
    Object.keys(target).forEach((item) => {
      UlNode.appendChild(this.generateFilesUl(item, target[item], path + '/' + item));
    })
    liNode.appendChild(UlNode);
    return liNode
  }

}

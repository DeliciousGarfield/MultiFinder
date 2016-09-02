(function () {
  function addFindScript() {
    var script = document.createElement("script");
    script.setAttribute("src", "resource://multifinder/data/js/find.js");

    document.head.appendChild(script);
  }

  function addInnerStyle() {
    var innerStyle = document.createElement("link");
    innerStyle.setAttribute("rel", "stylesheet");
    innerStyle.setAttribute("type", "text/css");
    innerStyle.setAttribute("href", "resource://multifinder/data/css/panel.css");

    document.head.appendChild(innerStyle);
  }

  function createPanel() {
    var panel = document.createElement("div");
    panel.setAttribute("id", "multifind-panel");

    var findBoxes = document.createElement("div");
    findBoxes.setAttribute("id", "multifind-find-boxes");

    var add = document.createElement("i");
    add.setAttribute("class", "fa fa-plus-square-o");
    add.setAttribute("id", "multifind-add");

    var close = document.createElement("span");
    close.setAttribute("class", "multifind-close");
    close.setAttribute("id", "multifind-close");

    panel.appendChild(findBoxes);
    panel.appendChild(add);
    panel.appendChild(close);

    document.body.appendChild(panel);
  }

  function addPanelScript() {
    var script = document.createElement("script");
    script.setAttribute("src", "resource://multifinder/data/js/panel.js");

    document.body.parentNode.appendChild(script);
  }

  function onClose() {
    var close = document.getElementById("multifind-close");

    close.addEventListener("click", function() {
      self.port.emit('close_panel');
    });
  }

  addFindScript();
  addInnerStyle();
  createPanel();
  addPanelScript();
  onClose();
})();

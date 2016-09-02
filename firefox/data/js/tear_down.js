(function() {
  function onClose() {
    var event = document.createEvent('MouseEvents');
    event.initEvent("click", true, true);
    event.eventType = 'message';
    var close = document.getElementById("multifind-close");
    close.dispatchEvent(event);
  }

  function removeScripts() {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].getAttribute("src") == "resource://multifinder/data/js/find.js" ||
      scripts[i].getAttribute("src") == "resource://multifinder/data/js/panel.js") {
        scripts[i].parentNode.removeChild(scripts[i]);
        i--;
      }
    }
  }

  function removeStyles() {
    var links = document.getElementsByTagName("link");
    for(var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("href") == "resource://multifinder/data/css/panel.css") {
        links[i].parentNode.removeChild(links[i]);
        i--;
      }
    }
  }

  function removeInlineStyles() {
    var styles = document.getElementsByTagName("style");
    for (var i = 0; i < styles.length; i++) {
      if (styles[i].childNodes[0].nodeValue.indexOf("multifind-keyword") != -1 ||
      styles[i].childNodes[0].nodeValue.indexOf("multifind-highlight") != -1) {
        styles[i].parentNode.removeChild(styles[i]);
        i--;
      }
    }
  }

  function removePanel() {
    var findPanel = document.getElementById("multifind-panel");
    findPanel.parentNode.removeChild(findPanel);
  }

  onClose();
  removeScripts();
  removeStyles();
  removeInlineStyles();
  removePanel();
})();

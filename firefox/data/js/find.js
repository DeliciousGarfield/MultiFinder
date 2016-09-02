(function() {
  var color = new Array("#FF4040","#FF8C00","#6495ED","#66CD00");
  var key_index = new Object();
  var iterators = new Object();
  var current = new Object();

  function do_find(n, keyword) {
    if (keyword == "")
      return -1;

    if (n >= color.length) {
      // alert("Number of keywords limit exceeded!");
      return -1;
    }

    if (key_index[keyword] != undefined) {
      // alert("Keyword already exists!");
      return -1;
    }

    FILTER = new Object();

    FILTER.acceptNode = function(node)

    {
      return (node.parentNode.tagName == "SCRIPT" || node.parentNode.tagName == "STYLE" || node.parentNode.tagName == "NOSCRIPT") ? NodeFilter.FILTER_REJECT: NodeFilter.FILTER_ACCEPT;
    }

    var iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT, FILTER, false);

    var processed = new Array();
    var node;
    var found = false;
    while (node = iterator.nextNode()) {
      if (processed.indexOf(node) == -1) {
        var nodeText = node.nodeValue;
        var re = new RegExp(keyword, "g");
        var result;

        if (result = re.exec(nodeText)) {
          found = true;

          var placeholder = document.createElement("SPAN");
          placeholder.setAttribute("class", "multifind-placeholder");

          var beg = result.index;
          var end = re.lastIndex;

          var left = nodeText.substring(0, beg);
          var right = nodeText.substring(end);

          if (left.length != 0) {
            var leftNode = document.createTextNode(left);
            placeholder.appendChild(leftNode);
          }

          var keywordElemNode = document.createElement("SPAN");
          placeholder.appendChild(keywordElemNode);
          keywordElemNode.setAttribute("class", "multifind-highlight" + n);
          var keywordTextNode = document.createTextNode(keyword);
          keywordElemNode.appendChild(keywordTextNode, node);

          if (right.length != 0) {
            var rightNode = document.createTextNode(right);
            placeholder.appendChild(rightNode);
          }

          node.parentNode.insertBefore(placeholder, node);
          node.parentNode.removeChild(node);
          processed.push(keywordTextNode);
        }
      }
    }

    if (found) {
      do_highlight(n);
      key_index[keyword] = n;

      return 0;
    }
    else {
      // alert("Keyword not found!");
      return -1;
    }
  }

  function undo_find(keyword) {
    if (key_index[keyword] == undefined) {
      // alert("Keyword not exists!");
      return;
    }

    FILTER = new Object();

    FILTER.acceptNode = function(node)

    {
      return (node.tagName == "SPAN" && node.getAttribute("class") != null && node.getAttribute("class").indexOf("multifind-placeholder") != -1 && node.textContent.indexOf(keyword) != -1) ? NodeFilter.FILTER_ACCEPT: NodeFilter.FILTER_REJECT;
    }

    var iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT, FILTER, false);

    var node;
    while (node = iterator.nextNode()) {
      var iter = document.createNodeIterator(node, NodeFilter.SHOW_TEXT, null, false);

      var origText = "";
      var nod;
      while (nod = iter.nextNode()) {
        origText += nod.nodeValue;
      }

      var textNode = document.createTextNode(origText);
      node.parentNode.insertBefore(textNode, node);
      node.parentNode.removeChild(node);
    }

    undo_highlight(key_index[keyword]);
    delete key_index[keyword];
    delete iterators[keyword];
  }

  function do_find_once(n, keyword) {
    if (key_index[keyword] == undefined)
      if (do_find(n, keyword) == -1)
        return -1;

      FILTER = new Object();

      FILTER.acceptNode = function(node)

      {
        return (node.tagName == "SPAN" && node.getAttribute("class") != null && node.getAttribute("class").indexOf("multifind-highlight" + key_index[keyword]) != -1) ? NodeFilter.FILTER_ACCEPT: NodeFilter.FILTER_REJECT;
      }

      var iterator;
      if (iterators[keyword] == undefined) {
        iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT, FILTER, false);
        iterators[keyword] = iterator;
      }
      else {
        iterator = iterators[keyword];
      }

      var next = iterator.nextNode();
      if (next.getAttribute("class").indexOf("multifind-keyword") != -1)
        next = iterator.nextNode();

      if (next != null) {
        var clazz = next.getAttribute("class");

        if (current[keyword] != undefined) {
          current[keyword].setAttribute("class", clazz);
        }

        next.setAttribute("class", clazz + " multifind-keyword");

        var X = next.getBoundingClientRect().left + document.documentElement.scrollLeft;
        var Y = next.getBoundingClientRect().top + document.documentElement.scrollTop;

        window.scrollTo(X, Y);
      }
      else {
        // alert("Document bottom reached!");
      }

      current[keyword] = next;

      return 0;
  }

  function do_reverse_find_once(n, keyword) {
    if (key_index[keyword] == undefined)
      if (do_find(n, keyword) == -1)
        return -1;

      FILTER = new Object();

      FILTER.acceptNode = function(node)

      {
        return (node.tagName == "SPAN" && node.getAttribute("class") != null && node.getAttribute("class").indexOf("multifind-highlight" + key_index[keyword]) != -1) ? NodeFilter.FILTER_ACCEPT: NodeFilter.FILTER_REJECT;
      }

      var iterator;
      if (iterators[keyword] == undefined) {
        iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT, FILTER, false);
        iterators[keyword] = iterator;
      }
      else {
        iterator = iterators[keyword];
      }

      var cur = current[keyword];
      var pre;
      pre = iterator.previousNode();
      if (pre.getAttribute("class").indexOf("multifind-keyword") != -1)
        pre = iterator.previousNode();

      if (pre != null) {
        var clazz = pre.getAttribute("class");

        if (cur != undefined) {
          cur.setAttribute("class", clazz);
        }

        pre.setAttribute("class", clazz + " multifind-keyword");

        var X = pre.getBoundingClientRect().left + document.documentElement.scrollLeft;
        var Y = pre.getBoundingClientRect().top + document.documentElement.scrollTop;

        window.scrollTo(X, Y);
      }
      else {
        // alert("Document bottom reached!");
      }

      current[keyword] = pre;

      return 0;
  }

  function do_highlight(n) {
    var css = '.multifind-highlight' + n + ' { background-color: ' + color[n] + '; color : white;}';
    head = document.getElementsByTagName('head')[0];
    style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }

  function undo_highlight(n) {
    var styles = document.getElementsByTagName("style");
    for (var i = 0; i < styles.length; i++) {
      if (styles[i].childNodes[0].nodeValue.indexOf(".multifind-highlight" + n) != -1) {
        styles[i].parentNode.removeChild(styles[i]);
        i--;
      }
    }
  }

  function cleanup() {
    for (var keyword in key_index) {
      undo_find(keyword);
    }
  }

  function focus() {
    var css = '.multifind-keyword { display: inline-block; border:1px solid #CCC; box-shadow: 5px 5px 5px #CCC;}';
    head = document.getElementsByTagName('head')[0];
    style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }

  focus();

  window.do_find = do_find;
  window.do_find_once = do_find_once;
  window.do_reverse_find_once = do_reverse_find_once;
  window.undo_find = undo_find;
  window.cleanup = cleanup;
})();

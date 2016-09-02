(function() {
  var active_keywords = new Object();
  var id_map_table = new Object();
  var new_id = 0;

  var findPanel = document.getElementById("multifind-panel");
  var findBoxes = document.getElementById("multifind-find-boxes");
  var add = document.getElementById("multifind-add");
  var close = document.getElementById("multifind-close");

  var n = 0;
  addFindBox(n);

  function containsKeyword(obj, keyword) {
    for (var key in obj) {
      if (key.indexOf(keyword) != -1 && !(key == keyword)) {
        return true;
      }
    }

    return false;
  }

  function createFindBox(i, new_id) {
    var findbox_id = "multifind-findbox" + i;
    var remover_id = "multifind-remover" + i;
    var separator_id = "multifind-separator" + i;
    var inputbox_id = "multifind-inputbox" + i;
    var prev_id = "multifind-prev" + i;
    var next_id = "multifind-next" + i;

    var findbox = document.createElement("div");
    findbox.setAttribute("id", findbox_id);
    findbox.setAttribute("class", "multifind-findbox");

    var inputbox = document.createElement("input");
    inputbox.setAttribute("type", "text");
    inputbox.setAttribute("id", inputbox_id);

    var old_value;
    inputbox.addEventListener("keypress", function(e) {
      if (e.keyCode == 13) {
        if (active_keywords[old_value] != undefined && old_value != inputbox.value) {
          window.undo_find(old_value);
          delete active_keywords[old_value];
        }

        if (active_keywords[inputbox.value] == undefined || active_keywords[inputbox.value] == id_map_table[new_id]) {
          if (containsKeyword(active_keywords, inputbox.value) && inputbox.value.length != 0) {
            // alert("The same keyword part already exists!");
          }
          else {
            if (window.do_find_once(id_map_table[new_id], inputbox.value) != -1) {
              active_keywords[inputbox.value] = id_map_table[new_id];
              old_value = inputbox.value;
            }
          }
        }
        else {
          // alert("The same keyword already exists!");
        }
      }
    });

    var cpLock = false;
    inputbox.addEventListener('compositionstart', function(){
      cpLock = true;
    });
    inputbox.addEventListener('compositionend', function(){
      cpLock = false;
    });

    inputbox.addEventListener("input", function(e) {
      if (!cpLock) {
        if (active_keywords[old_value] != undefined && old_value != this.value) {
          window.undo_find(old_value);
          delete active_keywords[old_value];
        }

        if (active_keywords[this.value] == undefined || active_keywords[this.value] == id_map_table[new_id]) {
          if (containsKeyword(active_keywords, this.value) && this.value.length != 0) {
            // alert("The same keyword part already exists!");
          }
          else {
            if (window.do_find_once(id_map_table[new_id], this.value) != -1) {
              active_keywords[this.value] = id_map_table[new_id];
              old_value = this.value;
            }
          }
        }
        else {
          // alert("The same keyword already exists!");
        }
      }

    });

    var prev = document.createElement("i");
    prev.setAttribute("class", "fa fa-angle-up");
    prev.setAttribute("id", prev_id);

    var next = document.createElement("i");
    next.setAttribute("class", "fa fa-angle-down");
    next.setAttribute("id", next_id);

    prev.addEventListener("click", function(e) {
      if (active_keywords[old_value] != undefined && old_value != inputbox.value) {
        window.undo_find(old_value);
        delete active_keywords[old_value];
      }

      if (active_keywords[inputbox.value] == undefined || active_keywords[inputbox.value] == id_map_table[new_id]) {
        if (containsKeyword(active_keywords, inputbox.value) && inputbox.value.length != 0) {
          // alert("The same keyword part already exists!");
        }
        else {
          if (window.do_reverse_find_once(id_map_table[new_id], inputbox.value) != -1) {
            active_keywords[inputbox.value] = id_map_table[new_id];
            old_value = inputbox.value;
          }
        }
      }
      else {
        // alert("The same keyword already exists!");
      }
    });

    next.addEventListener("click", function(e) {
      if (active_keywords[old_value] != undefined && old_value != inputbox.value) {
        window.undo_find(old_value);
        delete active_keywords[old_value];
      }

      if (active_keywords[inputbox.value] == undefined || active_keywords[inputbox.value] == id_map_table[new_id]) {
        if (containsKeyword(active_keywords, inputbox.value) && inputbox.value.length != 0) {
          // alert("The same keyword part already exists!");
        }
        else {
          if (window.do_find_once(id_map_table[new_id], inputbox.value) != -1) {
            active_keywords[inputbox.value] = id_map_table[new_id];
            old_value = inputbox.value;
          }
        }
      }
      else {
        // alert("The same keyword already exists!");
      }
    });

    var remover = document.createElement("i");
    remover.setAttribute("class", "fa fa-minus-square-o");
    remover.setAttribute("id", remover_id);

    findbox.appendChild(inputbox);
    findbox.appendChild(prev);
    findbox.appendChild(next);
    findbox.appendChild(remover);

    var separator = document.createElement("div");
    separator.setAttribute("class", "multifind-separator");
    separator.setAttribute("id", separator_id);

    var split = document.createTextNode("|");
    separator.appendChild(split);

    findBoxes.appendChild(findbox);
    findBoxes.appendChild(separator);
  }

  function addFindBox(i) {
    id_map_table[new_id] = i;
    createFindBox(i, new_id);
    new_id++;

    var remover = document.getElementById("multifind-remover" + i);
    remover.addEventListener("click", onRemove);

    function onRemove() {
      removeFindBox(i);

      for (var k = i + 1; k <= n; k++) {
        const max_k = n;
        const j = k;

        var findbox = document.getElementById("multifind-findbox" + j);
        var separator = document.getElementById("multifind-separator" + j);
        var remover = document.getElementById("multifind-remover" + j);
        var inputbox = document.getElementById("multifind-inputbox" + j);
        var prev = document.getElementById("multifind-prev" + j);
        var next = document.getElementById("multifind-next" + j);

        findbox.style.left = findbox.offsetLeft - 300 + "px";
        separator.style.left = separator.offsetLeft - 300 + "px";

        findbox.setAttribute("id", "multifind-findbox" + (j - 1));
        separator.setAttribute("id", "multifind-separator" + (j - 1));
        remover.setAttribute("id", "multifind-remover" + (j - 1));
        inputbox.setAttribute("id", "multifind-inputbox" + (j - 1));
        prev.setAttribute("id", "multifind-prev" + (j - 1));
        next.setAttribute("id", "multifind-next" + (j - 1));

        var new_remover = remover.cloneNode(true);
        remover.parentNode.replaceChild(new_remover, remover);
        new_remover.addEventListener("click", onRemove);

        undo_find(inputbox.value);
        do_find_once(j - 1, inputbox.value);
        id_map_table[new_id - max_k + j - 1] = j - 1;

        if (active_keywords[inputbox.value] != undefined) {
          active_keywords[inputbox.value] = j - 1;
        }
      }

      add.style.left = add.offsetLeft - 300 + "px";
    }

    add.style.left = add.offsetLeft + 300 + "px";

    n++;
  }

  function removeFindBox(i) {
    var findbox;
    var separator;

    var inputbox = document.getElementById("multifind-inputbox" + i);
    window.undo_find(inputbox.value);
    delete active_keywords[inputbox.value];

    for (var k = 0; k < findBoxes.childNodes.length; k++) {
      var node = findBoxes.childNodes[k];

      if (node.nodeType == document.ELEMENT_NODE) {
        if (node.getAttribute("id") == "multifind-findbox" + i)
          findbox = node;

        if (node.getAttribute("id") == "multifind-separator" + i)
          separator = node;
      }
    }

    findBoxes.removeChild(findbox);
    findBoxes.removeChild(separator);

    n--;
  }

  add.addEventListener("click", function() {
    if (n < 4) {
      addFindBox(n);
    }
  });

  close.addEventListener("click", function() {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].getAttribute("src") == "resource://multifinder/data/js/find.js" ||
      scripts[i].getAttribute("src") == "resource://multifinder/data/js/panel.js") {
        scripts[i].parentNode.removeChild(scripts[i]);
        i--;
      }
    }

    var links = document.getElementsByTagName("link");
    for(var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("href") == "resource://multifinder/data/css/panel.css") {
        links[i].parentNode.removeChild(links[i]);
        i--;
      }
    }

    var styles = document.getElementsByTagName("style");
    for (var i = 0; i < styles.length; i++) {
      if (styles[i].childNodes[0].nodeValue.indexOf("multifind-keyword") != -1 ||
      styles[i].childNodes[0].nodeValue.indexOf("multifind-highlight") != -1) {
        styles[i].parentNode.removeChild(styles[i]);
        i--;
      }
    }

    findPanel.parentNode.removeChild(findPanel);

    window.cleanup();
  });

})();

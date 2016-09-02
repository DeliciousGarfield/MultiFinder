var { ToggleButton } = require('sdk/ui/button/toggle');
var tabs = require('sdk/tabs');
var self = require('sdk/self');
var data = self.data;

var button = ToggleButton({
  id: 'toggle-button',
  label: 'Multi Finder',
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: function() {
    this.state('window', null);

    let { checked } = this.state('tab');
    this.state('tab', { checked: !checked });

    if (this.state(tabs.activeTab).checked) {
      var worker = tabs.activeTab.attach({
        contentScriptFile: data.url("js/set_up.js")
      });

      worker.port.on("close_panel", function() {
        button.state('tab', { checked: false });
      });
    }
    else {
      tabs.activeTab.attach({
        contentScriptFile: data.url("js/tear_down.js")
      });
    }

    tabs.activeTab.on("ready", function() {
      button.state('tab', { checked: false });
    });
  }
});

(function() {
    var panels = null;
    var toggleButton = null;
    var monoLib = require("./monoLib.js");
    monoLib.flags.enableLocalScope = true;
    try {
        toggleButton = require('sdk/ui/button/toggle').ToggleButton;
        panels = require("sdk/panel");
    } catch (e) {}

    var self = require("sdk/self");
    var pageMod = require("sdk/page-mod");

    var onPageModAttach = function(tab) {
        monoLib.addPage(tab);
    };

    pageMod.PageMod({
        include: [
            self.data.url('options.html')
        ],
        contentScript: '('+monoLib.virtualPort.toString()+')()',
        contentScriptWhen: 'start',
        onAttach: onPageModAttach
    });

    var sp = require("sdk/simple-prefs");
    sp.on("settingsBtn", function() {
        var self = require("sdk/self");
        var tabs = require("sdk/tabs");
        tabs.open( self.data.url('options.html') );
    });
    sp = null;

    pageMod.PageMod({
        include: [
            'http://ya.ru/*',
            'https://ya.ru/*'
        ],
        contentScriptFile: [
          self.data.url("js/mono.js"),
          self.data.url("js/base.js"),
          self.data.url("includes/inject.js")
        ],
        contentScriptWhen: 'start',
        onAttach: onPageModAttach
    });

    var button = null;
    var popup = null;
    if (toggleButton && panels) {
        button = toggleButton({
            id: "monoTestBtn",
            label: "Mono test!",
            icon: {
                "16": "./icons/icon-16.png"
            },
            onChange: function(state) {
                if (!state.checked) {
                    return;
                }
                if (state.show) {
                    return state.show();
                }
                popup && popup.show({
                    position: button
                });
            }
        });
        popup = {
            show: function() {
                var menuPanel = panels.Panel({
                    width: 400,
                    height: 250,
                    contentURL: self.data.url("popup.html"),
                    onHide: function() {
                        button.state('window', {checked: false});
                        mController.detach();
                        menuPanel.destroy();
                        menuPanel = null;
                    },
                    onMessage: function(msg) {
                        if (msg === 'hidePopup') {
                            menuPanel.hide();
                        }
                    }
                });

                var mController = monoLib.addPage(menuPanel);

                return menuPanel.show.apply(menuPanel, arguments);
            }
        };
    }

    var bgAddon = monoLib.virtualAddon();
    monoLib.addPage(bgAddon);

    var bg = require("./bg.js");
    bg.init(bgAddon, button, monoLib);

    onPageModAttach = null;

    bgAddon = null;
    bg = null;
    pageMod = null;
})();
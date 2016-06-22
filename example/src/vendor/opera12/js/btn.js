(function() {
  var var_cache = {};
  var updateButton = function() {
    if (var_cache.button) {
      opera.contexts.toolbar.removeItem(var_cache.button);
    }
    var ToolbarUIItemProperties = {
      disabled: false,
      title: "Mono test",
      icon: "icons/icon-18.png"
    };
    ToolbarUIItemProperties.popup = {
      href: 'popup.html',
      width: 400,
      height: 250
    };
    var_cache.button = opera.contexts.toolbar.createItem(ToolbarUIItemProperties);
    opera.contexts.toolbar.addItem(var_cache.button);
  };
  window.addEventListener('DOMContentLoaded', function() {
    updateButton();
  });
})();
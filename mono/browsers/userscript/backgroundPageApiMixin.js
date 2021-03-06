import UserscriptApiMixin from "./apiMixin";

const UserscriptBackgroundPageApiMixin = Parent => class extends UserscriptApiMixin(Parent) {
  openTab(url, active) {
    active = (active === undefined) ? true : !!active;
    if (typeof GM_openInTab === 'function') {
      GM_openInTab(url, {
        active: active,
        insert: true
      });
    } else {
      GM.openInTab(url, active);
    }
  }
};

export default UserscriptBackgroundPageApiMixin;
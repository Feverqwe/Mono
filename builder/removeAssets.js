class RemoveAssets {
  constructor(assets) {
    this.assets = assets;

    this.apply = this.apply.bind(this);
  }
  apply(compiler) {
    compiler.hooks.emit.tap('removeAssets', compilation => {
      this.assets.forEach(name => {
        delete compilation.assets[name];
      });
    });
  }
}

module.exports = RemoveAssets;
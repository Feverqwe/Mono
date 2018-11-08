module.exports = function (babel) {
  const {types: t} = babel;

  return {
    visitor: {
      Identifier: function( path, state ) {
        if ( state.opts.hasOwnProperty( path.node.name ) ) {
          const definition = state.opts[ path.node.name ];
          const ast = babel.transformSync(`result=${definition}`, {ast: true}).ast;
          const expressionStatement = ast.program.body[0];
          if (!t.isExpressionStatement(expressionStatement)) {
            throw new Error('Parse error');
          }
          path.replaceWith(expressionStatement.expression.right);
        }
      }
    }
  };
};
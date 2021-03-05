import * as typescript from 'typescript';

export default function (program: typescript.Program) {
  return function (transformationContext: typescript.TransformationContext) {
    return function (sourceFile: typescript.SourceFile) {
      function visitNode(node: typescript.Node): typescript.VisitResult<typescript.Node> {
        const newModuleSpecifier = getNewModuleSpecifier(node);
        if (typescript.isImportDeclaration(node) && newModuleSpecifier) {
          return transformationContext.factory.updateImportDeclaration(node, node.decorators, node.modifiers, node.importClause, newModuleSpecifier);
        }

        return typescript.visitEachChild(node, visitNode, transformationContext);
      }

      function getNewModuleSpecifier(node: typescript.Node) {
        // Affect only ESM import nodes
        if (!typescript.isImportDeclaration(node)) {
          return;
        }

        // Guard that module specifier is a string literal (anything else is a syntax error)
        if (!typescript.isStringLiteral(node.moduleSpecifier)) {
          return;
        }

        // Affect only relative path imports
        const match = node.moduleSpecifier.text.match(/^(\.\.?\/.*?)(\?.*)?(#.*?)?$/);
        if (!match) {
          return;
        }

        return transformationContext.factory.createStringLiteral(match[1], true);
      }

      return typescript.visitNode(sourceFile, visitNode)
    }
  }
}

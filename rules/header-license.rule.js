const fs = require('fs');

const jsExtensions = ['js', 'ts', 'jsx', 'tsx'];
const htmlExtensions = ['html'];
const stylesExtensions = ['css'];

const template = 'template';
const js = 'js';
const styles = 'styles';

const commentsMap = {
  [template]: {
    start: '<!--',
    prefix: '--',
    end: '-->',
  },
  [js]: {
    start: '/*',
    prefix: '*',
    end: '*/',
  },
  [styles]: {
    start: '/*',
    prefix: '*',
    end: '*/',
  },
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce license header template',
      category: 'Stylistic Issues',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          file: {
            type: 'string'
          }
        },
        additionalProperties: false
      }
    ]
  },
  create: context => {
    const options = context.options[0] || {};
    const licenseFilePath = options.file;
    
    if (!licenseFilePath) {
      throw new Error('License file path is required');
    }

    const filename = context.getFilename();
    const extension = filename.split('.').pop();

    const isJsExtension = jsExtensions.includes(extension);
    const isHtmlExtension = htmlExtensions.includes(extension);
    const isStylesExtension = stylesExtensions.includes(extension);

    const getCommentsInfo = () => {
      let commentsKey = '';

      if (isJsExtension || isStylesExtension) {
        commentsKey = js;
      } else if (isHtmlExtension) {
        commentsKey = template;
      }

      if (!(commentsKey in commentsMap)) return { start: '', end: '', prefix: '' };

      return commentsMap[commentsKey];
    }

    const getMappedLines = (licenseContent) => {
      const licenseLines = licenseContent.split('\n').filter(line => line.trim());
      const { start, prefix, end } = getCommentsInfo();
      const formattedLines = licenseLines.map(line => ` ${prefix} ${line}`).join('\n');

      return `${start}\n${formattedLines}\n${end}\n`;
    }

    const getLicenseHeader = () => {
      try {
        const licenseContent = fs.readFileSync(licenseFilePath, 'utf8');
        return getMappedLines(licenseContent);
      } catch (error) {
        context.report({
          message: `Failed to read license file: ${error.message}`,
          node: null
        });
        return '';
      }
    };

    const processNode = (node) => {
      const sourceCode = context.getSourceCode();
      const text = sourceCode.getText();
      const licenseHeader = getLicenseHeader();

      const { start, end } = getCommentsInfo();
      const sourceLines = text.split('\n');
      const startLineIndex = sourceLines.findIndex(line => line.trim().startsWith(start));
      const endLineIndex = sourceLines.findIndex(line => line.trim().startsWith(end));

      if (startLineIndex !== 0) {
        context.report({
          message: "Missed license header",
          node,
          fix: fixer => fixer.insertTextBeforeRange([0, 0], licenseHeader),
        });

        return;
      }

      const existingHeader = sourceLines.slice(startLineIndex, endLineIndex + 1).join('\n');
      const normalizeHeader = (header) => {
        return header
          .split('\n')
          .map(line => line.trim())
          .filter(line => line)
          .join('\n');
      };

      const normalizedExisting = normalizeHeader(existingHeader);
      const normalizedRequired = normalizeHeader(licenseHeader);

      if (normalizedExisting !== normalizedRequired) {
        context.report({
          message: "License header is incorrect",
          node,
          fix: fixer => {
            if (startLineIndex === 0) {
              const range = [
                sourceCode.getIndexFromLoc({ line: 1, column: 0 }),
                sourceCode.getIndexFromLoc({ line: endLineIndex + 2, column: 0 })
              ];
              return fixer.replaceTextRange(range, licenseHeader);
            } else {
              return fixer.insertTextBeforeRange([0, 0], licenseHeader);
            }
          }
        });
      }
    }

    return {
      'Program': processNode,
    };
  },
};

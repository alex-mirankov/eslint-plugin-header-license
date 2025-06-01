An ESLint plugin that enforces the presence of a license header in your source files. This plugin automatically adds and maintains license headers in your codebase, supporting various file types and comment styles.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Examples](#examples)
  - [JavaScript/TypeScript Files](#javascripttypescript-files)
  - [HTML Files](#html-files)
  - [CSS Files](#css-files)
- [Auto-fix](#auto-fix)
- [Adding more file types](#adding-more-file-types)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🔍 Automatically checks for license headers in your files
- 🛠️ Auto-fixes missing license headers
- 📝 Supports multiple file types:
  - JavaScript/TypeScript (`.js`, `.ts`, `.jsx`, `.tsx`)
  - HTML (`.html`)
  - Styles (`.css`)

## Installation

```bash
npm install --save-dev eslint-plugin-header-license
```

## Usage

1. Create a license template file (e.g., `license.txt`) with your license header content.

2. Add the plugin to your ESLint configuration:

```json
{
  "plugins": [
    "header-license"
  ],
  "rules": {
    "header-license/header-license": [2, {
      "file": "path/to/file/license.txt"
    }]
  }
}
```

## Configuration

The plugin accepts the following configuration options:

| Option | Type   | Required | Description                       |
|--------|--------|----------|-----------------------------------|
| `file` | string | Yes      | Path to the license template file |


## Examples

```license.txt
Copyright (c) 2024 Your Name
Licensed under the MIT License.
```

### JavaScript/TypeScript Files
```javascript
/*
 * Copyright (c) 2024 Your Name
 * Licensed under the MIT License.
*/
const example = 'This is my code';
```

### HTML Files
```html
<!--
 -- Copyright (c) 2024 Your Name
 -- Licensed under the MIT License.
-->
<!DOCTYPE html>
<html>
  <!-- Your HTML content -->
</html>
```

### CSS Files
```css
/*
 * Copyright (c) 2024 Your Name
 * Licensed under the MIT License.
*/
.example {
  color: blue;
}
```

## Auto-fix

The plugin supports ESLint's auto-fix feature. When enabled, it will automatically add the license header to files that are missing it.

```bash
eslint --fix your-file.js
```

Or for all files

```bash
eslint . --fix
```

## Adding more file types
Feel free to create an [issue](https://github.com/alex-mirankov/eslint-plugin-header-license/issues) on the GitHub page with a suggestion to add support for a new parser for the plugin.

## Error Handling

The plugin reports the following errors:

### Configuration Errors

- `License file path is required`
  - Occurs when the `file` option is not provided in the ESLint configuration
  - Fix: Add the `file` option to your ESLint config:
  ```json
  {
    "rules": {
      "header-license/header-license": ["error", {
        "file": "./LICENSE"  // Required
      }]
    }
  }
  ```

### Validation Errors

- `Failed to read license file: [error message]`
  - Occurs when the plugin cannot read the specified license file
  - Common causes:
    - File doesn't exist
    - Insufficient permissions
    - Invalid file path
  - Fix: Ensure the license file exists and is accessible

- `Missed license header`
  - Occurs when the file doesn't have a license header at the beginning
  - The plugin will automatically fix this by adding the header
  - Run `eslint --fix` to apply the fix

- `License header is incorrect`
  - Occurs when the file has a license header but it doesn't match the required format
  - The plugin will automatically fix this by replacing the incorrect header
  - Run `eslint --fix` to apply the fix

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

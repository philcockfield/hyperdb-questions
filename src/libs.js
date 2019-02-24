const fs = require('fs-extra');
const { resolve, join } = require('path');

module.exports = {
  fs: { ...fs, resolve, join },
  inquirer: require('inquirer'),
};

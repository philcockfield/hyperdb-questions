const hyperdb = require('hyperdb');

/**
 * Construct a new instance of a [hyperdb].
 * See:
 * - https://github.com/mafintosh/hyperdb
 */
function create(args = {}) {
  const reduce = (a, b) => a;
  const map = node => node;
  return new Promise(resolve => {
    const { dir, dbKey } = args;
    const options = { valueEncoding: 'utf-8', reduce, map };
    const db = args.dbKey ? hyperdb(dir, dbKey, options) : hyperdb(dir, options);
    db.on('ready', () => resolve(db));
  });
}

/**
 * Module API.
 */
module.exports = { create };

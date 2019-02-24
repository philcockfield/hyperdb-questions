const { interval, Subject } = require('rxjs');
const { fs, inquirer } = require('./libs');

const database = require('./database');
const ROOT = fs.resolve('./.db');
const PRIMARY = 'db-1';

/**
 * Prompts the user for which DB key to use.
 */
async function promptForDatabase() {
  await fs.ensureDir(ROOT);
  const dirs = (await fs.readdir(ROOT)).filter(p => p.startsWith('db-'));
  if (dirs.length === 0) {
    return { dir: fs.join(ROOT, PRIMARY) };
  }
  const answer = await inquirer.prompt({
    name: 'db',
    type: 'list',
    choices: [...dirs, '<new database>'],
  });
  const dir = answer.db.includes('new') ? `db-${dirs.length + 1}` : answer.db;
  return { dir: fs.join(ROOT, dir) };
}

/**
 * Creates a database instance.
 */
async function getDatabase() {
  // Read the key of the initial database if it exists.
  const keyFile = fs.resolve(`.db/KEY.${PRIMARY}`);
  const dbKey = (await fs.pathExists(keyFile)) ? await fs.readFile(keyFile, 'utf-8') : undefined;

  // Create the database.
  const { dir } = await promptForDatabase();
  const db = await database.create({ dir, dbKey });

  // Store the KEY of the main database (for sharing).
  if (dir.endsWith(PRIMARY)) {
    await fs.writeFile(keyFile, db.key.toString('hex'));
  }

  return { dir, dbKey, db };
}

/**
 * Handle GET/PUT callbacks
 */
function logResult(err, result) {
  if (err) {
    console.error(`ERROR: ${error.message}`);
  } else {
    console.log(` • ${result.key}=${result.value}`);
  }
}

/**
 * [Start]
 * Demo junk in this module (console interaction etc).
 * The isolated code for questions is in:
 *
 *   - database.js
 *   - swarm.js
 *
 */
(async () => {
  const { dir, dbKey, db } = await getDatabase();
  const isPrimary = dir.endsWith(PRIMARY);

  console.log('\nHyperDB');
  console.log(' ‣ dir (storage) ', dir.substr(fs.resolve('.').length + 1));
  console.log(' ‣ key           ', dbKey);
  console.log(' ‣ local.key     ', db.local.key.toString('hex'));
  console.log(' ‣ discoveryKey  ', db.discoveryKey.toString('hex'));
  console.log();

  // Watch for all changes, and pipe the result through an observable.
  const watch$ = new Subject();
  db.watch('', () => watch$.next());

  // DEMO: If on the primary database, write arbitrary values to the DB on a loop.
  if (isPrimary) {
    interval(800).subscribe(i => db.put('foo', i));
  }

  // Listen for changes in the database.
  watch$.subscribe(e => db.get('foo', logResult));
})();

const { interval, Subject } = require('rxjs');
const { fs, inquirer } = require('./libs');

const example = {
  db: require('./database'),
  swarm: require('./swarm'),
};

const ROOT = fs.resolve('./.db');
const INITIAL_DB = 'db-1';

/**
 * Prompts the user for which DB key to use.
 */
async function promptForDatabase() {
  await fs.ensureDir(ROOT);
  const dirs = (await fs.readdir(ROOT)).filter(p => p.startsWith('db-'));
  if (dirs.length === 0) {
    return { dir: fs.join(ROOT, INITIAL_DB) };
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
  const keyFile = fs.resolve(`.db/KEY.${INITIAL_DB}`);
  const dbKey = (await fs.pathExists(keyFile)) ? await fs.readFile(keyFile, 'utf-8') : undefined;

  // Create the database.
  const { dir } = await promptForDatabase();
  const db = await example.db.create({ dir, dbKey });

  // Store the KEY of the main database (for sharing).
  if (dir.endsWith(INITIAL_DB)) {
    await fs.writeFile(keyFile, db.key.toString('hex'));
  }

  return { dir, dbKey, db };
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
  const isPrimary = dir.endsWith(INITIAL_DB);
  const shortDir = dir.substr(fs.resolve('.').length + 1);

  const consoleList = (list, indent = 0) => {
    const prefix = Array.from({ length: indent })
      .map(() => ' ')
      .join('');
    list.forEach(msg => console.log(prefix, msg));
  };
  console.log('\nHyperdb');
  console.log(' ‣ dir (storage) ', shortDir, isPrimary ? '(PRIMARY)' : '');
  console.log(' ‣ key           ', dbKey || '<empty>');
  console.log(' ‣ local.key     ', db.local.key.toString('hex'));
  console.log(' ‣ discoveryKey  ', db.discoveryKey.toString('hex'));

  // Connect to the network.
  console.log('\n...connecting to swarm...');
  const swarm = await example.swarm.join({ db });

  console.log('\nSwarm');
  console.log(' ‣ id            ', swarm.config.id);
  console.log(' ‣ dns.domain    ', swarm.config.dns.domain);
  console.log(' ‣ dns.server');
  consoleList(swarm.config.dns.server, 17);
  console.log(' ‣ dht.bootstrap ');
  consoleList(swarm.config.dht.bootstrap, 17);
  console.log('\n-----------------------------------------------------------\n');

  // Watch for all changes, and pipe the result through an observable.
  const watch$ = new Subject();
  db.watch('', () => watch$.next());

  // DEMO: If on the primary database, write arbitrary values to the DB on a loop.
  if (isPrimary) {
    interval(800).subscribe(i => db.put('foo', i));
  } else {
    interval(000).subscribe(() => true); // Hack: keep the console alive and waiting.
  }

  // Listen for changes in the database.
  watch$.subscribe(e => db.get('foo', logResult));
})();

/**
 * Handle GET/PUT callbacks
 */
function logResult(err, result) {
  if (err) {
    console.error(`ERROR: ${error.message}`);
  } else {
    const text = ` • ${result.key}=${result.value}  `;
    process.stdout.cursorTo(0);
    process.stdout.write(text); // end the line
  }
}

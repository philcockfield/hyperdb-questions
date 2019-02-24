const discovery = require('discovery-swarm');
const datDefaults = require('./swarm.config');

/**
 * Connect a HyperDB to a swarm.
 */
function join(args) {
  return new Promise((resolve, reject) => {
    const { db } = args;
    const dbKey = db.key.toString('hex');

    // Create the discovery-swarm.
    const config = datDefaults({
      id: dbKey,
      stream: peer => {
        return db.replicate({
          live: true,
          userData: db.local.key,
        });
      },
    });
    const swarm = discovery(config);
    let authorizedPeers = [];

    // Listen for connection events.
    swarm.on('connection', async peer => {
      // console.log('conn', peer);

      /**
       * Passing the peer key discussed here:
       *
       *    https://github.com/karissa/hyperdiscovery/pull/12#pullrequestreview-95597621
       *     - mafintosh
       *     - JimmyBoh
       *     - karissa
       *     - substack
       *
       * `peerKey` was set as `userData` in `db.replicate` call above.
       *
       */

      const peerKey = peer.remoteUserData ? Buffer.from(peer.remoteUserData) : undefined;
      if (peerKey) {
        const { isAuthorized } = await authorize({ db, peerKey });
        const hex = peerKey.toString('hex');
        if (isAuthorized && !authorizedPeers.includes(hex)) {
          authorizedPeers = [...authorizedPeers, hex];
          console.log('authorized peer:', hex);
        }
      }
    });

    // Join the swarm.
    swarm.join(dbKey, undefined, () => {
      resolve({ config });
    });
  });
}

/**
 * Determine if a peer is authorized with the DB.
 */
function authorized(args) {
  return new Promise((resolve, reject) => {
    const { db, peerKey } = args;
    if (!(peerKey instanceof Buffer)) {
      resolve(false);
    }
    db.authorized(peerKey, (err, result) => {
      return err ? reject(err) : resolve(result);
    });
  });
}

/**
 * Authorize a peer with the DB.
 */
async function authorize(args) {
  const { db, peerKey } = args;
  try {
    const isAuthorized = await authorized({ db, peerKey });
    if (!isAuthorized) {
      await db.authorize(peerKey);
    }
    return { isAuthorized };
  } catch (err) {
    const key = peerKey ? peerKey.toString('hex') : 'NO_KEY';
    const error = new Error(`Failed to authorize peer '${key}'. ${err.message}`);
    console.log('error.message', error.message);
    return { isAuthorized: false, error };
  }
}

/**
 * Module API.
 */
module.exports = { join };

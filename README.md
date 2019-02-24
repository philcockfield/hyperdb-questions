# hyperdb-questions

Sample repo connecting the [hyperdb](https://github.com/mafintosh/hyperdb) to a [discovery-swarm](https://github.com/mafintosh/discovery-swarm) for the purpose of asking a few questions.  
Derived from [@cblgh's](https://github.com/cblgh) super helpful [example](https://github.com/cblgh/hyperdb-examples).

---

Also, HUGE gratitude and thanks to @mafintosh (and everyone else contributing) for creating these building blocks. What a treasure trove of extraordinary work.

## Example

```bash
npm install # yada yada yada
```

Open `1..n` consoles running:

    npm start

Each console creates a new hyperdb, using the initial database's `dbKey`.

The demo simply writes arbitray values to the primary database on a loop (`db-1`). Subsequence windows (`db-2`...etc) listen and log the changes.

To delete the databases and start again:

    npm run reset

## Questions

I have a few orienting questions as I get my hands dirty with some code. I've posted each question as an [issue](https://github.com/philcockfield/hyperdb-questions/issues) to allow comments/discussion there.

- [ ] DiscoveryKey

- [ ] Swarm (latest approach?) and “Hole Punching”? (firewalls etc)

- [ ] Map/Reduce (when are these invoked, and how are they used by a consuming app?)

## Refs

- https://github.com/mafintosh/hyperdb
- https://github.com/mafintosh/discovery-swarm
- https://github.com/karissa/hyperdiscovery/pull/12#pullrequestreview-95597621
- https://github.com/cblgh/hyperdb-examples (original example code I based this off)
- http://chat.datproject.org (dat project chat)

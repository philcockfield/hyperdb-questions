# hyperdb-questions

Sample repo connecting the [hyperdb](https://github.com/mafintosh/hyperdb) to a [discovery-swarm](https://github.com/mafintosh/discovery-swarm) for the purpose of asking a few questions.  
Derived from [@cblgh's](https://github.com/cblgh) super helpful [example](https://github.com/cblgh/hyperdb-examples).

---

Also, HUGE gratitude and thanks to [@mafintosh](https://github.com/mafintosh) (and everyone else contributing) for creating these building blocks. What a treasure trove of extraordinary work.

## Questions

I have a few orienting questions as I star getting my hands dirty with some code. I've posted each question as an [issue](https://github.com/philcockfield/hyperdb-questions/issues) to allow comments/discussion there.

- [ ] [Question #1](https://github.com/philcockfield/hyperdb-questions/issues/1): Using the Discovery Key
- [ ] [Question #2](https://github.com/philcockfield/hyperdb-questions/issues/2): Swarm Setup (latest approach?)
- [ ] [Question #3](https://github.com/philcockfield/hyperdb-questions/issues/3): Map and Reduce usage in HyperDB options

## Example Code

```bash
npm install # yada yada yada
```

Open `1..n` consoles running:

    npm start

Each console creates a new [hyperdb](https://github.com/mafintosh/hyperdb), using the initial database's `dbKey`.

The demo simply writes arbitray values to the primary database on a loop (`db-1`). Subsequence windows (`db-2`...etc) listen and log the changes.

![demo](https://user-images.githubusercontent.com/185555/53307347-69d52080-38fc-11e9-9881-40cba99ed0c5.gif)

To delete the databases and start again:

    npm run reset

## Refs

- https://github.com/mafintosh/hyperdb
- https://github.com/mafintosh/discovery-swarm
- https://github.com/karissa/hyperdiscovery/pull/12#pullrequestreview-95597621
- https://github.com/cblgh/hyperdb-examples (original example code I based this off)
- http://chat.datproject.org (dat project chat)

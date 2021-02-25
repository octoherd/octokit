# `@octoherd/octokit`

> Customized Octokit for Octoherd

## Usage

<table>
<tbody valign=top align=left>
<tr><th>
Browsers
</th><td width=100%>

Load <code>@octoherd/octokit</code> directly from <a href="https://www.skypack.dev">cdn.skypack.dev</a>

```html
<script type="module">
  import { Octokit } from "https://cdn.skypack.dev/@octoherd/octokit";
</script>
```

</td></tr>
<tr><th>
Node (12+)
</th><td>

Install with <code>npm install @octoherd/octokit</code>

```js
import { Octokit } from "@octoherd/octokit";
```

</td></tr>
<tr><th>
Deno
</th><td>

Load <code>@octoherd/octokit</code> directly from <a href="https://www.skypack.dev">cdn.skypack.dev</a> with the `?dts` query

```js
import { Octokit } from "https://cdn.skypack.dev/@octoherd/octokit?dts";
```

</td></tr>
</tbody>
</table>

```js
import { Octokit } from "@octoherd/octokit";

const octokit = new Octokit({
  auth: /* token here, create one at https://github.com/settings/tokens/new */,
});

const { data: me } = await octokit.request("GET /user")
console.log(me)
```

By default you authenticate using a token, but you can use any [authentication strategy](https://github.com/octokit/core.js#authentication).

### REST API requests and GraphQL queries

`@ocotkit/octokit` is built on [`@octokit/core`](https://github.com/octokit/core.js#readme). You can send requests to GitHub's REST API using [`octokit.request`](https://github.com/octokit/core.js#rest-api-example) and GraphQL queries [`octokit.graphql`](https://github.com/octokit/core.js#graphql-example).

### Logging

The logging methods `octokit.log.{debug,info,warn,error}()` use [`pino`](https://getpino.io/#/). Log lines are newline delimited JSON ([NDJSON](https://en.wikipedia.org/wiki/JSON_streaming#Line-delimited_JSON)) by default.

You can log simple messages

```js
octokit.log.info("Checking repository %s", repository.full_name);
```

You can pass extra meta information as the first argument

```js
octokit.log.info(
  { id: repository.id },
  "Checking repository %s",
  repository.full_name
);
```

You can also just log meta information for reporting later

```js
octokit.log.info({
  id: repository.id,
  owner: repositor.owner.login,
  repo: repository.name,
  private: repository.private,
});
```

You can pass a custom `pino` instance as construction option:

```js
const octokit = new Octokit({
  logger: pino({ level: "debug" }),
});
```

### Built-in plugins

`@octoherd/octokit` comes with a few plugins out of the box:

- [`@octokit/plugin-paginate-rest`](https://github.com/octokit/plugin-paginate-rest.js#readme)
- [`@octokit/plugin-retry`](https://github.com/octokit/plugin-retry.js#readme)
- [`@octokit/plugin-throttling`](https://github.com/octokit/plugin-throttling.js#readme)

You can use [`octokit.paginate()`](https://github.com/octokit/plugin-paginate-rest.js#octokitpaginate) or [`octokit.paginate.iterator()`](https://github.com/octokit/plugin-paginate-rest.js#octokitpaginateiterator) for paginating REST API requests.

The retry & throttling plugins hook into the request lifecycle, retries requests in case of unrelated server errors, and throttles requests to avoid hitting rate or abuse limits.

### Extending

You can extend `@octoherd/octokit` with [hooks](https://github.com/octokit/core.js#hooks) and [plugins](https://github.com/octokit/core.js#plugins)

## License

[ISC](LICENSE.md)

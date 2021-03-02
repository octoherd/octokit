import { strict as assert } from "assert";
import { Octokit } from "./index.js";

const logMessageCalls = [];
const logDataCalls = [];

const octokit = new Octokit({
  octoherd: {
    onLogMessage: (...args) => logMessageCalls.push(args),
    onLogData: (...args) => logDataCalls.push(args),
  },
});

octokit.hook.wrap("request", (request, { url }) => {
  if (url === "/") return { ok: true };

  return { data: [{ id: 123 }], headers: {} };
});

const result = await octokit.request("GET /");

assert.equal(result.ok, true);

const issues = await octokit.paginate("GET /repos/{owner}/{repo}/issues", {
  owner: "octoherd",
  repo: "octokit",
});

assert.equal(issues[0].id, 123);

octokit.log.debug("debug message");
octokit.log.info("info message");
octokit.log.info("info message with %s", "interpolation");
octokit.log.info({ meta: "data" }, "info message");
octokit.log.info({ meta: "data" }, "info message with %s", "interpolation");

octokit.log.setContext({ foo: "bar" });
octokit.log.warn("warn message");

assert.deepEqual(logMessageCalls, [
  ["info", "info message", {}],
  ["info", "info message with interpolation", {}],
  ["info", "info message", { meta: "data" }],
  ["info", "info message with interpolation", { meta: "data" }],
  ["warn", "warn message", {}],
]);
assert.deepEqual(
  logDataCalls.map(([data]) => [{ ...data, time: 0 }]),
  [
    [{ msg: "debug message", level: "debug", time: 0 }],
    [{ msg: "info message", level: "info", time: 0 }],
    [
      {
        msg: "info message with interpolation",
        level: "info",
        time: 0,
      },
    ],
    [{ meta: "data", msg: "info message", level: "info", time: 0 }],
    [
      {
        meta: "data",
        msg: "info message with interpolation",
        level: "info",
        time: 0,
      },
    ],
    [{ foo: "bar", msg: "warn message", level: "warn", time: 0 }],
  ]
);

console.log("All tests passed.");

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

octokit.log.debug("debug");
octokit.log.info("info");
octokit.log.info("info with %s", "interpolation");
octokit.log.info({ meta: "data" }, "info");
octokit.log.info({ meta: "data" }, "info with %s", "interpolation");

assert.deepEqual(logMessageCalls, [
  ["info", "info", {}],
  ["info", "info with interpolation", {}],
  ["info", "info", { meta: "data" }],
  ["info", "info with interpolation", { meta: "data" }],
]);
assert.deepEqual(
  logDataCalls.map(([data]) => [{ ...data, time: 0 }]),
  [
    [{ msg: "info", level: "info", time: 0 }],
    [
      {
        msg: "info with interpolation",
        level: "info",
        time: 0,
      },
    ],
    [{ meta: "data", msg: "info", level: "info", time: 0 }],
    [
      {
        meta: "data",
        msg: "info with interpolation",
        level: "info",
        time: 0,
      },
    ],
  ]
);

console.log("All tests passed.");

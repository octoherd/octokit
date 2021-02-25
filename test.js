import { strict as assert } from "assert";
import { Octokit } from "./index.js";

const octokit = new Octokit();

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

console.log("All tests passed.");

import { Octokit as OctokitCore } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { throttling } from "@octokit/plugin-throttling";
import { retry } from "@octokit/plugin-retry";
import pino from "pino";

import { VERSION } from "./version.js";

const logger = pino();
export const Octokit = OctokitCore.plugin(
  paginateRest,
  throttling,
  retry
).defaults({
  log: {
    debug: logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
  },
  userAgent: `octoherd-cli/${VERSION}`,
  throttle: {
    onAbuseLimit: (error, options, octokit) => {
      octokit.log.error("onAbuseLimit", error, options);
    },
    onRateLimit: (error, options, octokit) => {
      octokit.log.error("onRateLimit", error, options);
    },
  },
});

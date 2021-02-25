import { Octokit as OctokitCore } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { throttling } from "@octokit/plugin-throttling";
import { retry } from "@octokit/plugin-retry";

import { logger } from "./octokit-plugins/logger.js";
import { VERSION } from "./version.js";

export const Octokit = OctokitCore.plugin(
  logger,
  paginateRest,
  throttling,
  retry
).defaults({
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

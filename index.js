import { Octokit as OctokitCore } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { throttling } from "@octokit/plugin-throttling";
import { retry } from "@octokit/plugin-retry";

import { logger } from "./octokit-plugins/logger.js";
import { VERSION } from "./version.js";
export { VERSION } from "./version.js";

export const Octokit = OctokitCore.plugin(
  logger,
  paginateRest,
  throttling,
  retry
).defaults({
  userAgent: `octoherd-cli/${VERSION}`,
  throttle: {
    onSecondaryRateLimit: (error, options, octokit, retryCount) => {
      octokit.log.error("onSecondaryRateLimit", error, options);

      return retryCount < 3;
    },
    onRateLimit: (error, options, octokit, retryCount) => {
      octokit.log.error("onRateLimit", error, options);

      return retryCount < 3;
    },
  },
});

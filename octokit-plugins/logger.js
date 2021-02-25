export function loggerPlugin(octokit, options) {
  if (options.logger) {
    octokit.log = options.logger;
  }
}

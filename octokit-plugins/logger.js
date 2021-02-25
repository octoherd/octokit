import format from "quick-format-unescaped";

function onLogData(obj) {}
function onLogMessage(level, msg, data) {
  console[level](msg, data);
}

function log(level, callbacks, ...args) {
  const obj = typeof args[0] === "object" ? args.shift() : {};
  const msg = args.length >= 2 ? format(args.shift(), args) : args[0];

  if (typeof msg !== "undefined") {
    obj.msg = msg;
  }

  if (obj.msg) {
    const { msg: message, ...data } = obj;
    callbacks.onLogMessage(level, message, data);
  }

  callbacks.onLogData({ ...obj, level, time: Date.now() });
}

export function logger(octokit, { octoherd = {} }) {
  const callbacks = {
    onLogData: octoherd.onLogData || onLogData,
    onLogMessage: octoherd.onLogMessage || onLogMessage,
  };

  octokit.log = {
    debug: octoherd.debug ? log.bind(null, "debug", callbacks) : () => {},
    info: log.bind(null, "info", callbacks),
    warn: log.bind(null, "warn", callbacks),
    error: log.bind(null, "error", callbacks),
  };
}

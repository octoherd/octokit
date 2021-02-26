import format from "quick-format-unescaped";

function onLogData(obj) {}
function onLogMessage(level, msg, data) {
  console[level](msg, data);
}

function log(options, level, callbacks, ...args) {
  const obj = typeof args[0] === "object" ? args.shift() : {};
  const msg = args.length >= 2 ? format(args.shift(), args) : args[0];

  if (typeof msg !== "undefined") {
    obj.msg = msg;
  }

  // handle errors
  if (obj.message && !obj.msg) {
    obj.msg = obj.message;
    delete obj.message;
  }

  if (obj.msg && (level !== "debug" || options.debug)) {
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
    debug: log.bind(null, octoherd, "debug", callbacks),
    info: log.bind(null, octoherd, "info", callbacks),
    warn: log.bind(null, octoherd, "warn", callbacks),
    error: log.bind(null, octoherd, "error", callbacks),
  };
}

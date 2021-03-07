import format from "quick-format-unescaped";

function onLogData(obj) {}
function onLogMessage(level, msg, data) {
  console[level](msg, data);
}

function log(state, level, ...args) {
  let obj = typeof args[0] === "object" ? args.shift() : {};
  const msg = args.length >= 2 ? format(args.shift(), args) : args[0];

  if (typeof msg !== "undefined") {
    obj.msg = msg;
  }

  // handle errors
  if (obj instanceof Error) {
    obj = {
      msg: obj.stack,
      ...Object.entries(obj).reduce((result, [key, value]) => {
        return { ...result, [key]: value };
      }, {}),
    };
  }

  if (obj.msg && (level !== "debug" || state.options.debug)) {
    const { msg: message, ...data } = obj;
    state.onLogMessage(level, message, data);
  }

  state.onLogData({ ...state.context, ...obj, level, time: Date.now() });
}

export function logger(octokit, { octoherd = {} }) {
  const state = {
    options: octoherd,
    onLogData: octoherd.onLogData || onLogData,
    onLogMessage: octoherd.onLogMessage || onLogMessage,
    context: {},
  };

  return {
    log: {
      debug: log.bind(null, state, "debug"),
      info: log.bind(null, state, "info"),
      warn: log.bind(null, state, "warn"),
      error: log.bind(null, state, "error"),
      // Adds extra info ONLY to log files but not to stdout
      setContext(context) {
        state.context = context;
      },
    },
  };
}

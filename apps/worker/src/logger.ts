type Level = 'debug' | 'info' | 'warn' | 'error';

function ts() {
  return new Date().toISOString();
}

function emit(level: Level, scope: string, message: string, extra?: unknown) {
  const line = `${ts()} [${level.toUpperCase()}] [${scope}] ${message}`;
  if (extra !== undefined) {
    console.log(line, typeof extra === 'string' ? extra : JSON.stringify(extra));
  } else {
    console.log(line);
  }
}

export function createLogger(scope: string) {
  return {
    debug: (message: string, extra?: unknown) => emit('debug', scope, message, extra),
    info: (message: string, extra?: unknown) => emit('info', scope, message, extra),
    warn: (message: string, extra?: unknown) => emit('warn', scope, message, extra),
    error: (message: string, extra?: unknown) => emit('error', scope, message, extra),
    child: (childScope: string) => createLogger(`${scope}:${childScope}`),
  };
}

export type Logger = ReturnType<typeof createLogger>;

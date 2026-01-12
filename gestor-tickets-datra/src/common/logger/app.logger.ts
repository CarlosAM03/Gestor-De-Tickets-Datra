export class AppLogger {
  static log(message: string, meta?: Record<string, unknown>) {
    console.log(
      JSON.stringify({
        level: 'info',
        message,
        ...meta,
      }),
    );
  }

  static error(message: string, meta?: Record<string, unknown>) {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        ...meta,
      }),
    );
  }
}

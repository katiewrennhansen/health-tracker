import type { ErrorRequestHandler, RequestHandler } from "express";

/** Unknown routes get a JSON 404 instead of Express's default HTML page. */
export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.path}` });
};

/** Errors that carry their own 4xx status, such as malformed JSON bodies from express.json(). */
function clientErrorStatus(err: unknown): number | undefined {
  if (typeof err !== "object" || err === null || !("status" in err))
    return undefined;
  const { status } = err;
  return typeof status === "number" && status >= 400 && status < 500
    ? status
    : undefined;
}

/**
 * Last middleware in the chain. Express 5 also routes rejected promises from async handlers here.
 * Unexpected errors are logged on the server and return a generic 500, so no internals reach the client.
 */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const status = clientErrorStatus(err);
  if (status !== undefined) {
    res
      .status(status)
      .json({ error: err instanceof Error ? err.message : "Bad request" });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};

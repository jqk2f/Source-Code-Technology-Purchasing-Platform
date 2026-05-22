export function getErrorMessage(error: unknown, fallback = "操作失败") {
  return error instanceof Error ? error.message : fallback;
}

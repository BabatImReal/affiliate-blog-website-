// Re-export of the admin-path matcher so middleware.ts and tests share one source.
export function isAdminPath(pathname: string): boolean {
  return /^\/(vi|en)\/(dashboard|posts|links|media)(\/|$)/.test(pathname)
}

export function asset(url:string):string {
  const map=(globalThis as typeof globalThis & { __PORTFOLIO_ASSETS__?: Record<string,string> }).__PORTFOLIO_ASSETS__;
  return map?.[url] || url;
}

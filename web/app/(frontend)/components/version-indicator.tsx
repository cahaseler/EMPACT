export function VersionIndicator() {
  let version = { version: "1.3.4" };
  return <div>{"v" + version.version}</div>;
}

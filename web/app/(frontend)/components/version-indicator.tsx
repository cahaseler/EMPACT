export function VersionIndicator() {
  let version = { version: "1.1.4" };
  return <div>{"v" + version.version}</div>;
}

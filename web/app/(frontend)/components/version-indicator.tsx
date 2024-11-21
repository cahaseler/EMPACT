export function VersionIndicator() {
  let version = { version: "1.2.4" };
  return <div>{"v" + version.version}</div>;
}

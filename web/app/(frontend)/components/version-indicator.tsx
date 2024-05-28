export function VersionIndicator() {
  let version = { version: "1.0.4" };
  return <div>{"v" + version.version}</div>;
}

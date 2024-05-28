export function VersionIndicator() {
  let version = { version: "1.0.3" };
  return <div>{"v" + version.version}</div>;
}

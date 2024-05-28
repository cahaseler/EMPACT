export function VersionIndicator() {
  let version = { version: "1.0.2" };
  return <div>{"v" + version.version}</div>;
}

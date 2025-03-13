export function VersionIndicator() {
  let version = { version: "1.3.0" };
  return <div>{"v" + version.version}</div>;
}

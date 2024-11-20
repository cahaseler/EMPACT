export function VersionIndicator() {
  let version = { version: "1.2.0" };
  return <div>{"v" + version.version}</div>;
}

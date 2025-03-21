export function VersionIndicator() {
  let version = { version: "1.4.0" };
  return <div>{"v" + version.version}</div>;
}

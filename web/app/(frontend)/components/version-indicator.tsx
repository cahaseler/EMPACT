export function VersionIndicator() {
  let version = { version: "0.1.0" };
  return <div>{"v" + version.version}</div>;
}

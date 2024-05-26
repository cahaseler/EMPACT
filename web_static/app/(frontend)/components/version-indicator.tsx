export function VersionIndicator() {
  let version = { version: "1.0.0" };
  return <div>{"v" + version.version}</div>;
}

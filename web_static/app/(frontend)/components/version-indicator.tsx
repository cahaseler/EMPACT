export function VersionIndicator() {
  let version = { version: "1.0.5" };
  return <div>{"v" + version.version}</div>;
}

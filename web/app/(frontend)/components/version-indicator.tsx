export function VersionIndicator() {
  let version = { version: "1.3.2" };
  return <div>{"v" + version.version}</div>;
}

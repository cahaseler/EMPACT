export function VersionIndicator() {
  let version = { version: "1.2.3" };
  return <div>{"v" + version.version}</div>;
}

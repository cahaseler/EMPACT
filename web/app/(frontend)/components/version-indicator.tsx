export function VersionIndicator() {
  let version = { version: "1.2.11" };
  return <div>{"v" + version.version}</div>;
}

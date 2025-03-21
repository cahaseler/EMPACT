export function VersionIndicator() {
  let version = { version: "1.4.2" };
  return <div>{"v" + version.version}</div>;
}

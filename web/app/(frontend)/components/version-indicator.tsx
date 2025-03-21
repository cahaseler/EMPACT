export function VersionIndicator() {
  let version = { version: "1.4.1" };
  return <div>{"v" + version.version}</div>;
}

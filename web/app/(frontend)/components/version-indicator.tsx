export function VersionIndicator() {
  let version = { version: "1.2.1" };
  return <div>{"v" + version.version}</div>;
}

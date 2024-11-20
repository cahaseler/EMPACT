export function VersionIndicator() {
  let version = { version: "1.2.2" };
  return <div>{"v" + version.version}</div>;
}

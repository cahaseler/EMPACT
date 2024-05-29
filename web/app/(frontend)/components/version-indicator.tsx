export function VersionIndicator() {
  let version = { version: "1.1.1" };
  return <div>{"v" + version.version}</div>;
}

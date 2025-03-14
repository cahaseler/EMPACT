export function VersionIndicator() {
  let version = { version: "1.3.7" };
  return <div>{"v" + version.version}</div>;
}

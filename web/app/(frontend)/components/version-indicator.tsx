export function VersionIndicator() {
  let version = { version: "1.2.7" };
  return <div>{"v" + version.version}</div>;
}

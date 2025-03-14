export function VersionIndicator() {
  let version = { version: "1.3.5" };
  return <div>{"v" + version.version}</div>;
}

export function VersionIndicator() {
  let version = { version: "1.2.5" };
  return <div>{"v" + version.version}</div>;
}

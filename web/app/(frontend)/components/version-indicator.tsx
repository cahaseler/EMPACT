export function VersionIndicator() {
  let version = { version: "1.3.6" };
  return <div>{"v" + version.version}</div>;
}

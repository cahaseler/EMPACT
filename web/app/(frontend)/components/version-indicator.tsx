export function VersionIndicator() {
  let version = { version: "1.2.6" };
  return <div>{"v" + version.version}</div>;
}

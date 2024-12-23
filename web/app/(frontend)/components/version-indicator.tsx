export function VersionIndicator() {
  let version = { version: "1.2.10" };
  return <div>{"v" + version.version}</div>;
}

export function VersionIndicator() {
  let version = { version: "1.2.9" };
  return <div>{"v" + version.version}</div>;
}

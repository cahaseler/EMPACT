export function VersionIndicator() {
  let version = { version: "1.3.8" };
  return <div>{"v" + version.version}</div>;
}

export function VersionIndicator() {
  let version = { version: "1.2.8" };
  return <div>{"v" + version.version}</div>;
}

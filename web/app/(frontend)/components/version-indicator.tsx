export function VersionIndicator() {
  const version = { version: "1.10.0" };
  return <div>{"v" + version.version}</div>;
}

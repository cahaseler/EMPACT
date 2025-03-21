export function VersionIndicator() {
  const version = { version: "1.4.0" };
  return <div>{"v" + version.version}</div>;
}

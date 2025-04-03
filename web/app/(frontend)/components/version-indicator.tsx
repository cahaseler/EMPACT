export function VersionIndicator() {
  const version = { version: "1.6.0" };
  return <div>{"v" + version.version}</div>;
}

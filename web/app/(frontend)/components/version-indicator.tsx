export function VersionIndicator() {
  const version = { version: "1.8.0" };
  return <div>{"v" + version.version}</div>;
}

export function VersionIndicator() {
  const version = { version: "1.7.0" };
  return <div>{"v" + version.version}</div>;
}

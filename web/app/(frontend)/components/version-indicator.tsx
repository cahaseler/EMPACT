export function VersionIndicator() {
  const version = { version: "1.9.0" };
  return <div>{"v" + version.version}</div>;
}

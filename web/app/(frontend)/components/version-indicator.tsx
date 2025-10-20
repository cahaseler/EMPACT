export function VersionIndicator() {
  const version = { version: "1.11.0" };
  return <div>{"v" + version.version}</div>;
}

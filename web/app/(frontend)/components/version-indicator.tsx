export function VersionIndicator() {
  const version = { version: "1.5.0" };
  return <div>{"v" + version.version}</div>;
}

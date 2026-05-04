export function VersionIndicator() {
  const version = { version: "1.13.0" };
  return <div>{"v" + version.version}</div>;
}

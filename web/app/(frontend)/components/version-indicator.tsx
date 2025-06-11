export function VersionIndicator() {
  const version = { version: "1.10.4" };
  return <div>{"v" + version.version}</div>;
}

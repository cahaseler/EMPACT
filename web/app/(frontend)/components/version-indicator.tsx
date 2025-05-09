export function VersionIndicator() {
  const version = { version: "1.10.2" };
  return <div>{"v" + version.version}</div>;
}

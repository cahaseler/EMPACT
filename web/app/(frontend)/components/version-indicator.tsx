export function VersionIndicator() {
  const version = { version: "1.10.3" };
  return <div>{"v" + version.version}</div>;
}

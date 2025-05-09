export function VersionIndicator() {
  const version = { version: "1.10.1" };
  return <div>{"v" + version.version}</div>;
}

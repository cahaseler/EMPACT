export function VersionIndicator() {
  const version = { version: "1.6.1" };
  return <div>{"v" + version.version}</div>;
}

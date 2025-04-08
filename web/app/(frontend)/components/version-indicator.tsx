export function VersionIndicator() {
  const version = { version: "1.6.2" };
  return <div>{"v" + version.version}</div>;
}

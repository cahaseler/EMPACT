export function VersionIndicator() {
  const version = { version: "1.8.2" };
  return <div>{"v" + version.version}</div>;
}

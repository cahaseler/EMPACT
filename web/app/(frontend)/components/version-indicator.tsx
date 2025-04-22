export function VersionIndicator() {
  const version = { version: "1.8.1" };
  return <div>{"v" + version.version}</div>;
}

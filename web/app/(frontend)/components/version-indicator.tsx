export function VersionIndicator() {
  const version = { version: "1.9.2" };
  return <div>{"v" + version.version}</div>;
}

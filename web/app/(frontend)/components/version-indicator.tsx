export function VersionIndicator() {
  const version = { version: "1.9.1" };
  return <div>{"v" + version.version}</div>;
}

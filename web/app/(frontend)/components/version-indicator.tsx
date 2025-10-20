export function VersionIndicator() {
  const version = { version: "1.11.1" };
  return <div>{"v" + version.version}</div>;
}

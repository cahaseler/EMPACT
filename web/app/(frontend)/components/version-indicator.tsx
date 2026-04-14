export function VersionIndicator() {
  const version = { version: "1.12.1" };
  return <div>{"v" + version.version}</div>;
}

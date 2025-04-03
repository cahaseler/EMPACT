export function VersionIndicator() {
  const version = { version: "1.5.1" };
  return <div>{"v" + version.version}</div>;
}

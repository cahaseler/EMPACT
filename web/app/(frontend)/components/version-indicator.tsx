export function VersionIndicator() {
  const version = { version: "1.6.4" };
  return <div>{"v" + version.version}</div>;
}

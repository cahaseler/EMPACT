export function VersionIndicator() {
  const version = { version: "1.4.4" };
  return <div>{"v" + version.version}</div>;
}

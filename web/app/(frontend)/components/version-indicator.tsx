export function VersionIndicator() {
  const version = { version: "1.5.2" };
  return <div>{"v" + version.version}</div>;
}

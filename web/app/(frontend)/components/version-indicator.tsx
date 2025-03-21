export function VersionIndicator() {
  const version = { version: "1.4.6" };
  return <div>{"v" + version.version}</div>;
}

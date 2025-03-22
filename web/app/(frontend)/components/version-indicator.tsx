export function VersionIndicator() {
  const version = { version: "1.4.9" };
  return <div>{"v" + version.version}</div>;
}

// Exported mock handler for testing
export async function handleWithDependencies(payload, dependencies) {
  const { MockService } = dependencies;
  await MockService();
  return `handled: ${payload.testPayload}`;
}

// Exported mock handler for testing
export async function handleWithDependencies(payload, services) {
  const { MockService } = services;
  await MockService();
  return `handled: ${payload.testPayload}`;
}

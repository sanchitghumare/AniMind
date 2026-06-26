export default function responder(executionResult) {
  if (!executionResult) {
    return "Something went wrong.";
  }

  if (executionResult.result?.message) {
    return executionResult.result.message;
  }

  if (executionResult.message) {
    return executionResult.message;
  }

  return "Done.";
}
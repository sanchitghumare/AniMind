import { tools } from "../tools";

export default async function executor(userId, plan) {
  const { tool, arguments: args } = plan;

  if (tool === "none") {
    return {
      success: true,
      usedTool: false,
      message: null,
    };
  }

  const fn = tools[tool];

  if (!fn) {
    return {
      success: false,
      usedTool: false,
      message: `Unknown tool: ${tool}`,
    };
  }

  try {
    const result = await fn(userId, ...Object.values(args));
    console.log(`Tool ${tool} executed successfully:`, result);
    return {
      success: true,
      usedTool: true,
      result,
    };
  } catch (error) {
    return {
      success: false,
      usedTool: true,
      message: error.message,
    };
  }
}
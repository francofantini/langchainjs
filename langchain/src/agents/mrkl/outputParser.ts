import { AgentActionOutputParser } from "../../agents/types.js";

import { FORMAT_INSTRUCTIONS } from "./prompt.js";

export const FINAL_ANSWER_ACTION = "Final Answer:";
export class ZeroShotAgentOutputParser extends AgentActionOutputParser {
  async parse(text: string) {
    if (text.includes(FINAL_ANSWER_ACTION)) {
      const parts = text.split(FINAL_ANSWER_ACTION);
      const output = parts[parts.length - 1].trim();
      return {
        returnValues: { output },
        log: text,
      };
    }

    const match = /Action: (.*)\nAction Input: (.*)/s.exec(text);
    if (!match) {
      throw new Error(`Could not parse LLM output: ${text}`);
    }

    return {
      tool: match[1].trim(),
      toolInput: match[2].trim().replace(/^"+|"+$/g, "") ?? "",
      log: text,
    };
  }

  getFormatInstructions(): string {
    return FORMAT_INSTRUCTIONS;
  }
}

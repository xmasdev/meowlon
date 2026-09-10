import type { Program } from "../types";
import { unicornProgram } from "./unicorn";

export function createProgramRegistry(): Map<string, Program> {
  return new Map([[unicornProgram.name, unicornProgram]]);
}

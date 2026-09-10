import type { Command } from "../types";
import { pwdCommand } from "./pwd";
import { cdCommand } from "./cd";
import { lsCommand } from "./ls";
import { catCommand } from "./cat";
import { fileCommand } from "./file";
import { stringsCommand } from "./strings";
import { cpCommand } from "./cp";
import { whoamiCommand } from "./whoami";
import { historyCommand } from "./history";
import { envCommand, exportCommand } from "./env";
import { psCommand } from "./ps";
import { readlinkCommand } from "./readlink";
import { echoCommand } from "./echo";
import { clearCommand } from "./clear";
import { helpCommand } from "./help";

export const COMMAND_LIST: Command[] = [
  pwdCommand,
  cdCommand,
  lsCommand,
  catCommand,
  fileCommand,
  stringsCommand,
  cpCommand,
  whoamiCommand,
  historyCommand,
  envCommand,
  exportCommand,
  psCommand,
  readlinkCommand,
  echoCommand,
  clearCommand,
  helpCommand,
];

export function createCommandRegistry(): Map<string, Command> {
  const registry = new Map<string, Command>();
  for (const command of COMMAND_LIST) registry.set(command.name, command);
  return registry;
}

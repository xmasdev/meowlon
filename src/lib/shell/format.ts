import type { NodeKind } from "./types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function permissionBits(bits: number): string {
  return `${bits & 4 ? "r" : "-"}${bits & 2 ? "w" : "-"}${bits & 1 ? "x" : "-"}`;
}

export function formatMode(mode: number, kind: NodeKind): string {
  const type = kind === "dir" ? "d" : kind === "symlink" ? "l" : "-";
  return `${type}${permissionBits((mode >> 6) & 7)}${permissionBits(
    (mode >> 3) & 7,
  )}${permissionBits(mode & 7)}`;
}

export function formatDate(date: Date): string {
  const month = MONTHS[date.getMonth()];
  const day = String(date.getDate()).padStart(2, " ");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month} ${day} ${hours}:${minutes}`;
}

type TimelineUnit = "hour" | "day";

/**
 * Create bucket string keys for a given timestamp.
 * @param unit - `day` or `hour`.
 * @param timestamp - The timestamp as `number`.
 * @returns A bucket key, e.g. `2024-08-06` or `2024-08-06 22:00:00`
 */
function bucketFor(unit: TimelineUnit, timestamp: number): string {
  // TODO: use a real date library instead of handling date manipulation manually

  if (unit === "hour") {
    const date = new Date(timestamp);
    date.setUTCMilliseconds(0);
    date.setUTCSeconds(0);
    date.setUTCMinutes(0);
    const result = date.toISOString();
    return result.substring(0, result.lastIndexOf(".")).replace("T", " ");
  } else if (unit === "day") {
    const date = new Date(timestamp);
    date.setUTCMilliseconds(0);
    date.setUTCSeconds(0);
    date.setUTCMinutes(0);
    date.setUTCHours(0);
    const result = date.toISOString();
    return result.substring(0, result.indexOf("T"));
  } else {
    throw new Error(`Unsupported unit: ${unit}`);
  }
}

export { bucketFor };
export type { TimelineUnit };

type TimelineUnit = "hour" | "day";

function bucketFor(unit: TimelineUnit, timestamp: number): string {
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

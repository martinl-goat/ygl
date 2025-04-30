import { useMemo, useState } from "react";
import classes from "./Timeline.module.css";
import { MessageRecord } from "./types";

interface TimelineProps {
  messages: MessageRecord[];
}

type TimelineUnit = "hour" | "day";

const bucketFor = (unit: TimelineUnit, timestamp: number): string => {
  if (unit === "hour") {
    const date = new Date(timestamp);
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    return date.toISOString();
  } else if (unit === "day") {
    const date = new Date(timestamp);
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    const result = date.toISOString();
    return result.substring(0, result.indexOf("T"));
  } else {
    throw new Error(`Unsupported unit: ${unit}`);
  }
};

function Timeline({ messages }: TimelineProps) {
  const [unit, _] = useState<TimelineUnit>("day");

  const buckets = useMemo(() => {
    console.log("computing timeline data", unit, "messages", messages.length);

    const buckets: Record<string, number> = {};
    messages
      .filter((msg) => typeof msg._time === "number")
      .forEach(({ _time: timestamp }) => {
        const bucket = bucketFor(unit, timestamp as number); // TODO: look into typing
        buckets[bucket] = (buckets[bucket] ?? 0) + 1;
      });

    const max = Object.values(buckets).reduce(
      (max, current) => Math.max(max, current),
      0,
    );

    const results = Object.keys(buckets)
      .sort()
      .map((bucket) => [
        bucket,
        buckets[bucket],
        (buckets[bucket] / max) * 100,
      ]);

    return results;
  }, [messages, unit]);

  console.log("Timeline: rendering, buckets:", buckets);

  return (
    <div className={classes.timeline}>
      {buckets.map(([bucket, count, percentage]) => {
        return (
          <div className={classes.bucket}>
            <div className={classes.bar}>
              <div
                className={classes.fill}
                style={{ height: `${percentage}%` }}
              />
              <div className={classes.label}>{count}</div>
            </div>
            <div className={classes.label}>
              <div>{bucket}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { Timeline };

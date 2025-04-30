import { useMemo, useState } from "react";
import { MessageRecord } from "../types";
import classes from "./Timeline.module.css";
import { bucketFor, TimelineUnit } from "./utils";

interface TimelineProps {
  messages: MessageRecord[];
}

/**
 * A basic timeline that buckets messages and displays bucket counts and
 * relative bucket sizes. Only "day" is supported as bucket unit.
 * @param messages - An array of objects. Objects should contain `_time`.
 */
function Timeline({ messages }: TimelineProps) {
  const [unit] = useState<TimelineUnit>("day"); // TODO: add support for other units

  // calculate bucket keys, memoized since it can be expensive for a large number of messages
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

    return Object.keys(buckets)
      .sort()
      .map((bucket) => [
        bucket,
        buckets[bucket],
        Math.round((buckets[bucket] / max) * 100),
      ]);
  }, [messages, unit]);

  console.log("Timeline: rendering, bucket count:", buckets.length);

  return (
    <div className={classes.timeline}>
      {buckets.map(([bucket, count, percentage]) => {
        return (
          <div className={classes.bucket} key={bucket}>
            <div className={classes.bar}>
              <div
                className={classes.fill}
                style={{ height: `${percentage}%` }}
                data-testid="fill"
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

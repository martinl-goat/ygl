import { useState } from "react";
import { Timeline } from "../timeline/Timeline";
import { MessageRecord } from "../types";
import { Message } from "./Message";
import classes from "./Messages.module.css";
import { Paginator } from "./Paginator";

interface MessagesProps {
  messages: MessageRecord[];
}

/**
 * A table of messages with a paginator and timeline. Renders two columns, Time and Event.
 * @param messages - An array of objects. Objects should contain `_time`.
 */
function Messages({ messages }: MessagesProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;
  const offset = currentPage * pageSize;
  const havePages = messages.length > 0;
  const pagedMessages = messages.slice(offset, offset + pageSize);

  console.log("Messages: rendering", messages.length, pagedMessages.length);

  const messageRows = pagedMessages.map((msg, idx) => (
    // by including the current page in the key, new Message instances are
    // forced, which is needed to close expanded entries on page change.
    // TODO: it's a somewhat ugly bugfix – instead, move expansion state from Message to here
    <Message key={`${currentPage}${idx}`} message={msg} />
  ));

  return (
    <>
      {havePages && <Timeline messages={messages} />}
      {!havePages && <div>No messages yet. Press Go!</div>}
      {havePages && (
        <Paginator
          pageSize={pageSize}
          messagesCount={messages.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
      {havePages && (
        <table className={classes.msgtable}>
          <thead>
            <tr>
              <th></th>
              <th>Time</th>
              <th>Event</th>
            </tr>
          </thead>
          <tbody>{messageRows}</tbody>
        </table>
      )}
    </>
  );
}

export { Messages };

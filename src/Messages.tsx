import { useState } from "react";
import { Message } from "./Message";
import classes from "./Messages.module.css";
import { Paginator } from "./Paginator";
import { Timeline } from "./Timeline";
import { MessageRecord } from "./types";

interface MessagesProps {
  messages: MessageRecord[];
}

function Messages({ messages }: MessagesProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;
  const offset = currentPage * pageSize;
  const havePages = messages.length > 0;
  const pagedMessages = messages.slice(offset, offset + pageSize);

  console.log("Messages: rendering", messages.length, pagedMessages.length);

  const messageRows = pagedMessages.map((msg, idx) => (
    <Message key={idx} message={msg} />
  ));

  return (
    <div className="card">
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
    </div>
  );
}

export { Messages };

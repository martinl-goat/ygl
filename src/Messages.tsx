import { Message } from "./Message";
import classes from "./Messages.module.css";
import { MessageRecord } from "./types";

interface MessagesProps {
  messages: MessageRecord[];
}

function Messages({ messages }: MessagesProps) {
  const offset = 0;
  const pageSize = 20;
  const pagedMessages = messages.slice(offset, pageSize);

  console.log("Messages: rendering", messages.length, pagedMessages.length);

  // TODO: think about performance here
  const messageRows = pagedMessages.map((msg, idx) => (
    <Message key={idx} message={msg} />
  ));

  return (
    <div className="card">
      Total messages: {messages.length}, rendering: {pagedMessages.length}
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
    </div>
  );
}

export { Messages };

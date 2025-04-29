type MessageRecord = Record<string, unknown>;
type NewMessageCallback = (msg: MessageRecord) => void;

export type { MessageRecord, NewMessageCallback };

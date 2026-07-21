"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import type { Message } from "@/types";

export default function MessagePane({ messages }: { messages: Message[] }) {
  const [active, setActive] = useState(messages[0]);

  return (
    <div className="message-pane">
      <div className="message-list">
        {messages.map((message) => (
          <button className={!message.read ? "unread" : ""} key={message.id} onClick={() => setActive(message)} type="button">
            <strong>{message.subject}</strong>
            <span>{message.name}</span>
          </button>
        ))}
      </div>
      <div className="message-detail">
        <h2>{active?.subject}</h2>
        <p>{active?.message}</p>
        <Textarea rows={4} placeholder="Write a reply" />
        <Button>Send Reply</Button>
      </div>
    </div>
  );
}

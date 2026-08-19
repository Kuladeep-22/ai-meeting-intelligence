import { Grid } from "@mui/material";
import ChatThread from "../components/chat/ChatThread";
import { useEffect, useState } from "react";

import ConversationList from "../components/chat/ConversationList";
import type { ChatContact, ChatMessageItem } from "../types/chat";

const contacts: ChatContact[] = [
  { id: "1", name: "Rahul Sharma", role: "Product Manager", online: true, phone: "+91-9876543210" },
  { id: "2", name: "Anjali Verma", role: "Backend Developer", online: true, phone: "+91-9876501234" },
  { id: "3", name: "Kiran Rao", role: "UX Designer", online: true, phone: "+91-9811112233" },
  { id: "4", name: "Suresh Iyer", role: "QA Engineer", online: false, phone: "+91-9822223344" },
  { id: "5", name: "Priya Nair", role: "Data Scientist", online: false, phone: "+91-9833334455" },
];

const initialMessages: ChatMessageItem[] = [
  {
    id: "m1",
    contactId: "1",
    sender: "them",
    text: "Hey, did you review the meeting notes?",
    timestamp: Date.now() - 1000 * 60 * 30,
  },
  {
    id: "m2",
    contactId: "1",
    sender: "me",
    text: "Yes, looks good. I'll add my comments today.",
    timestamp: Date.now() - 1000 * 60 * 28,
  },
  {
    id: "m3",
    contactId: "2",
    sender: "them",
    text: "Can we finalize the API contract before 4 PM?",
    timestamp: Date.now() - 1000 * 60 * 24,
  },
  {
    id: "m4",
    contactId: "2",
    sender: "me",
    text: "Yes, I will review and confirm shortly.",
    timestamp: Date.now() - 1000 * 60 * 21,
  },
  {
    id: "m5",
    contactId: "3",
    sender: "them",
    text: "I uploaded the new UI wireframes for review.",
    timestamp: Date.now() - 1000 * 60 * 18,
  },
  {
    id: "m6",
    contactId: "4",
    sender: "them",
    text: "Regression tests are 70% complete so far.",
    timestamp: Date.now() - 1000 * 60 * 14,
  },
  {
    id: "m7",
    contactId: "5",
    sender: "them",
    text: "The data pipeline is running smoothly after the last update.",
    timestamp: Date.now() - 1000 * 60 * 10,
  }
];

const UNREAD_STORAGE_KEY = "chat_unread_counts";

const defaultUnreadCounts: Record<string, number> = {
  "2": 2,
};

const Chats = () => {
  const [activeId, setActiveId] = useState(contacts[0].id);
  const [messages, setMessages] = useState<ChatMessageItem[]>(initialMessages);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(UNREAD_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultUnreadCounts;
    } catch {
      return defaultUnreadCounts;
    }
  });

  useEffect(() => {
    localStorage.setItem(UNREAD_STORAGE_KEY, JSON.stringify(unreadCounts));
  }, [unreadCounts]);

  const activeContact = contacts.find((c) => c.id === activeId)!;
  const activeMessages = messages.filter((m) => m.contactId === activeId);

  const handleSelect = (id: string) => {
    setActiveId(id);
    setUnreadCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleSend = async (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        contactId: activeId,
        sender: "me",
        text,
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <Grid container spacing={2} sx={{ height: "80vh" }}>
      <Grid size={{ xs: 12, md: 4 }} sx={{ height: "100%" }}>
        <ConversationList
          contacts={contacts}
          activeId={activeId}
          unreadCounts={unreadCounts}
          onSelect={handleSelect}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 8 }} sx={{ height: "100%" }}>
        <ChatThread
          contact={activeContact}
          messages={activeMessages}
          onSend={handleSend}
        />
      </Grid>
    </Grid>
  );
};

export default Chats;

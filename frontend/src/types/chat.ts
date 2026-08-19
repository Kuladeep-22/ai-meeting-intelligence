export interface ChatContact {
  id: string;
  name: string;
  role?: string;
  online?: boolean;
  phone?: string;
}

export interface ChatMessageItem {
  id: string;
  contactId: string;
  sender: "me" | "them";
  text: string;
  timestamp: number;
}

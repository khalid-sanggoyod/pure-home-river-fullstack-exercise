export interface Note {
  id: string;
  title: string;
  content: string | null;
  agentId: string;
  propertyId: string | null;
  dueDate: string | null;
  isReminder: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  content?: string | null;
  agentId: string;
  propertyId?: string | null;
  dueDate?: string | null;
  isReminder?: boolean;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string | null;
  propertyId?: string | null;
  dueDate?: string | null;
  isReminder?: boolean;
}

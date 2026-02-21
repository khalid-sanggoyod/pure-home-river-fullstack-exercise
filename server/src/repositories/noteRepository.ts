import { v4 as uuidv4 } from 'uuid';
import { Note, CreateNoteInput, UpdateNoteInput } from '../models/note';

class NoteRepository {
  private notes: Map<string, Note> = new Map();

  getAll(): Note[] {
    return Array.from(this.notes.values());
  }

  getById(id: string): Note | undefined {
    return this.notes.get(id);
  }

  getByAgentId(agentId: string): Note[] {
    return Array.from(this.notes.values()).filter(n => n.agentId === agentId);
  }

  getByPropertyId(propertyId: string): Note[] {
    return Array.from(this.notes.values()).filter(n => n.propertyId === propertyId);
  }

  create(input: CreateNoteInput): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: uuidv4(),
      title: input.title,
      content: input.content ?? null,
      agentId: input.agentId,
      propertyId: input.propertyId ?? null,
      dueDate: input.dueDate ?? null,
      isReminder: input.isReminder ?? false,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.set(note.id, note);
    return note;
  }

  update(id: string, input: UpdateNoteInput): Note | undefined {
    const existing = this.notes.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: Note = {
      ...existing,
      ...(input.title !== undefined && { title: input.title }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.propertyId !== undefined && { propertyId: input.propertyId }),
      ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
      ...(input.isReminder !== undefined && { isReminder: input.isReminder }),
      updatedAt: new Date().toISOString(),
    };

    this.notes.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.notes.delete(id);
  }

  deleteByPropertyId(propertyId: string): number {
    const toDelete = this.getByPropertyId(propertyId);
    toDelete.forEach(n => this.notes.delete(n.id));
    return toDelete.length;
  }
}

export const noteRepository = new NoteRepository();

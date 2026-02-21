import { v4 as uuidv4 } from 'uuid';
import { Family, CreateFamilyInput, UpdateFamilyInput } from '../models/family';

class FamilyRepository {
  private families: Map<string, Family> = new Map();

  getAll(): Family[] {
    return Array.from(this.families.values());
  }

  getById(id: string): Family | undefined {
    return this.families.get(id);
  }

  getByPropertyId(propertyId: string): Family | undefined {
    return Array.from(this.families.values()).find(f => f.propertyId === propertyId);
  }

  isPropertyOccupied(propertyId: string, excludeFamilyId?: string): boolean {
    return Array.from(this.families.values()).some(
      f => f.propertyId === propertyId && f.id !== excludeFamilyId
    );
  }

  create(input: CreateFamilyInput): Family {
    const now = new Date().toISOString();
    const family: Family = {
      id: uuidv4(),
      name: input.name,
      propertyId: input.propertyId,
      createdAt: now,
      updatedAt: now,
    };
    this.families.set(family.id, family);
    return family;
  }

  update(id: string, input: UpdateFamilyInput): Family | undefined {
    const existing = this.families.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: Family = {
      ...existing,
      ...(input.name !== undefined && { name: input.name }),
      ...(input.propertyId !== undefined && { propertyId: input.propertyId }),
      updatedAt: new Date().toISOString(),
    };

    this.families.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.families.delete(id);
  }
}

export const familyRepository = new FamilyRepository();

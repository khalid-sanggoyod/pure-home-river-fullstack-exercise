import { v4 as uuidv4 } from 'uuid';
import { Property, CreatePropertyInput, UpdatePropertyInput } from '../models/property';

class PropertyRepository {
  private properties: Map<string, Property> = new Map();

  getAll(): Property[] {
    return Array.from(this.properties.values());
  }

  getById(id: string): Property | undefined {
    return this.properties.get(id);
  }

  getByAgentId(agentId: string): Property[] {
    return Array.from(this.properties.values()).filter(p => p.agentId === agentId);
  }

  create(input: CreatePropertyInput): Property {
    const now = new Date().toISOString();
    const property: Property = {
      id: uuidv4(),
      address: input.address,
      agentId: input.agentId,
      createdAt: now,
      updatedAt: now,
    };
    this.properties.set(property.id, property);
    return property;
  }

  update(id: string, input: UpdatePropertyInput): Property | undefined {
    const existing = this.properties.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: Property = {
      ...existing,
      ...(input.address !== undefined && { address: input.address }),
      ...(input.agentId !== undefined && { agentId: input.agentId }),
      updatedAt: new Date().toISOString(),
    };

    this.properties.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.properties.delete(id);
  }
}

export const propertyRepository = new PropertyRepository();

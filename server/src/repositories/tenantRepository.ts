import { v4 as uuidv4 } from 'uuid';
import { Tenant, CreateTenantInput, UpdateTenantInput } from '../models/tenant';

class TenantRepository {
  private tenants: Map<string, Tenant> = new Map();

  getAll(): Tenant[] {
    return Array.from(this.tenants.values());
  }

  getById(id: string): Tenant | undefined {
    return this.tenants.get(id);
  }

  getByFamilyId(familyId: string): Tenant[] {
    return Array.from(this.tenants.values()).filter(t => t.familyId === familyId);
  }

  create(input: CreateTenantInput): Tenant {
    const now = new Date().toISOString();
    const tenant: Tenant = {
      id: uuidv4(),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email ?? null,
      phone: input.phone ?? null,
      familyId: input.familyId,
      createdAt: now,
      updatedAt: now,
    };
    this.tenants.set(tenant.id, tenant);
    return tenant;
  }

  update(id: string, input: UpdateTenantInput): Tenant | undefined {
    const existing = this.tenants.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: Tenant = {
      ...existing,
      ...(input.firstName !== undefined && { firstName: input.firstName }),
      ...(input.lastName !== undefined && { lastName: input.lastName }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.familyId !== undefined && { familyId: input.familyId }),
      updatedAt: new Date().toISOString(),
    };

    this.tenants.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.tenants.delete(id);
  }

  deleteByFamilyId(familyId: string): number {
    const toDelete = this.getByFamilyId(familyId);
    toDelete.forEach(t => this.tenants.delete(t.id));
    return toDelete.length;
  }
}

export const tenantRepository = new TenantRepository();

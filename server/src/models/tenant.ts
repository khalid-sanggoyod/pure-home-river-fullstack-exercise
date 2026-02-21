export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  familyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantInput {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  familyId: string;
}

export interface UpdateTenantInput {
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
  familyId?: string;
}

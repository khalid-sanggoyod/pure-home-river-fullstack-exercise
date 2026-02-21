export interface Family {
  id: string;
  name: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFamilyInput {
  name: string;
  propertyId: string;
}

export interface UpdateFamilyInput {
  name?: string;
  propertyId?: string;
}

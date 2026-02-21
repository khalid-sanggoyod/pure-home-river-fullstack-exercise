import request from 'supertest';
import app from '../app';
import { agentRepository } from '../repositories/agentRepository';

describe('Agent API', () => {
  beforeEach(() => {
    agentRepository.reset();
  });

  describe('AgentRepository', () => {
    it('getAll should return all agents', async () => {
      expect(agentRepository.getAll()).toEqual([]);

      await request(app).post('/api/agents').send({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        mobileNumber: '+1-555-123-4567',
      });

      const agents = agentRepository.getAll();
      expect(agents).toHaveLength(1);
      expect(agents[0].firstName).toBe('John');
    });
  });

  const validAgent = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    mobileNumber: '+1-555-123-4567',
  };

  describe('POST /api/agents', () => {
    it('should create a new agent', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send(validAgent)
        .expect(201);

      expect(res.body).toMatchObject({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        mobileNumber: '+1-555-123-4567',
      });
      expect(res.body.id).toBeDefined();
      expect(res.body.createdAt).toBeDefined();
      expect(res.body.updatedAt).toBeDefined();
    });

    it('should return 400 for missing firstName', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({ ...validAgent, firstName: '' })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'firstName' })
      );
    });

    it('should return 400 for missing lastName', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({ ...validAgent, lastName: '' })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'lastName' })
      );
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({ ...validAgent, email: 'invalid-email' })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'email' })
      );
    });

    it('should return 400 for invalid phone number', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({ ...validAgent, mobileNumber: '123' })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'mobileNumber' })
      );
    });

    it('should return 400 for missing email', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({ ...validAgent, email: '' })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'email' })
      );
    });

    it('should return 400 for missing mobileNumber', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({ ...validAgent, mobileNumber: '' })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'mobileNumber' })
      );
    });

    it('should return multiple validation errors', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({})
        .expect(400);

      expect(res.body.errors.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('GET /api/agents', () => {
    it('should return empty paginated result when no agents exist', async () => {
      const res = await request(app)
        .get('/api/agents')
        .expect(200);

      expect(res.body.data).toEqual([]);
      expect(res.body.pagination).toEqual({
        page: 1,
        limit: 2,
        total: 0,
        totalPages: 0,
      });
    });

    it('should return paginated agents', async () => {
      // Create 3 agents
      await request(app).post('/api/agents').send(validAgent);
      await request(app).post('/api/agents').send({ ...validAgent, email: 'jane@example.com' });
      await request(app).post('/api/agents').send({ ...validAgent, email: 'bob@example.com' });

      const res = await request(app)
        .get('/api/agents')
        .expect(200);

      expect(res.body.data).toHaveLength(2); // Default limit is 2
      expect(res.body.pagination.total).toBe(3);
      expect(res.body.pagination.totalPages).toBe(2);
    });

    it('should support pagination parameters', async () => {
      // Create 3 agents
      await request(app).post('/api/agents').send(validAgent);
      await request(app).post('/api/agents').send({ ...validAgent, email: 'jane@example.com' });
      await request(app).post('/api/agents').send({ ...validAgent, email: 'bob@example.com' });

      const res = await request(app)
        .get('/api/agents?page=2&limit=2')
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination.page).toBe(2);
    });

    it('should support search parameter', async () => {
      await request(app).post('/api/agents').send({ ...validAgent, firstName: 'John' });
      await request(app).post('/api/agents').send({ ...validAgent, firstName: 'Jane', email: 'jane@example.com' });

      const res = await request(app)
        .get('/api/agents?search=john')
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].firstName).toBe('John');
    });

    it('should support createdFrom date filter', async () => {
      await request(app).post('/api/agents').send(validAgent);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const res = await request(app)
        .get(`/api/agents?createdFrom=${tomorrowStr}`)
        .expect(200);

      expect(res.body.data).toHaveLength(0);
    });

    it('should support createdTo date filter', async () => {
      await request(app).post('/api/agents').send(validAgent);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const res = await request(app)
        .get(`/api/agents?createdTo=${yesterdayStr}`)
        .expect(200);

      expect(res.body.data).toHaveLength(0);
    });

    it('should return agents within date range', async () => {
      await request(app).post('/api/agents').send(validAgent);

      const today = new Date().toISOString().split('T')[0];

      const res = await request(app)
        .get(`/api/agents?createdFrom=${today}&createdTo=${today}`)
        .expect(200);

      expect(res.body.data).toHaveLength(1);
    });

    it('should handle invalid page parameter gracefully', async () => {
      await request(app).post('/api/agents').send(validAgent);

      const res = await request(app)
        .get('/api/agents?page=-1')
        .expect(200);

      expect(res.body.pagination.page).toBe(1);
    });

    it('should handle invalid limit parameter gracefully', async () => {
      await request(app).post('/api/agents').send(validAgent);

      const res = await request(app)
        .get('/api/agents?limit=-1')
        .expect(200);

      expect(res.body.pagination.limit).toBe(2);
    });
  });

  describe('GET /api/agents/:id', () => {
    it('should return an agent by id', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .get(`/api/agents/${createRes.body.id}`)
        .expect(200);

      expect(res.body.id).toBe(createRes.body.id);
      expect(res.body.firstName).toBe('John');
    });

    it('should return 404 for non-existent agent', async () => {
      const res = await request(app)
        .get('/api/agents/non-existent-id')
        .expect(404);

      expect(res.body.error).toBe('Agent not found');
    });
  });

  describe('PUT /api/agents/:id', () => {
    it('should update an agent', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.id}`)
        .send({ firstName: 'Jane' })
        .expect(200);

      expect(res.body.firstName).toBe('Jane');
      expect(res.body.lastName).toBe('Smith'); // Unchanged
    });

    it('should return 404 for non-existent agent', async () => {
      const res = await request(app)
        .put('/api/agents/non-existent-id')
        .send({ firstName: 'Jane' })
        .expect(404);

      expect(res.body.error).toBe('Agent not found');
    });

    it('should return 400 for invalid email on update', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.id}`)
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'email' })
      );
    });

    it('should return 400 for empty firstName on update', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.id}`)
        .send({ firstName: '' })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'firstName' })
      );
    });

    it('should return 400 for empty lastName on update', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.id}`)
        .send({ lastName: '' })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'lastName' })
      );
    });

    it('should return 400 for empty email on update', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.id}`)
        .send({ email: '' })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'email' })
      );
    });

    it('should return 400 for empty mobileNumber on update', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.id}`)
        .send({ mobileNumber: '' })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'mobileNumber' })
      );
    });

    it('should return 400 for invalid mobileNumber on update', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.id}`)
        .send({ mobileNumber: '123' })
        .expect(400);

      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'mobileNumber' })
      );
    });

    it('should update lastName only', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.id}`)
        .send({ lastName: 'Doe' })
        .expect(200);

      expect(res.body.lastName).toBe('Doe');
      expect(res.body.firstName).toBe('John');
    });

    it('should update email only', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.id}`)
        .send({ email: 'newemail@example.com' })
        .expect(200);

      expect(res.body.email).toBe('newemail@example.com');
    });

    it('should update mobileNumber only', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.id}`)
        .send({ mobileNumber: '+1-555-999-8888' })
        .expect(200);

      expect(res.body.mobileNumber).toBe('+1-555-999-8888');
    });
  });

  describe('DELETE /api/agents/:id', () => {
    it('should delete an agent', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      await request(app)
        .delete(`/api/agents/${createRes.body.id}`)
        .expect(204);

      // Verify agent is deleted
      await request(app)
        .get(`/api/agents/${createRes.body.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent agent', async () => {
      const res = await request(app)
        .delete('/api/agents/non-existent-id')
        .expect(404);

      expect(res.body.error).toBe('Agent not found');
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect(200);

      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
    });
  });
});

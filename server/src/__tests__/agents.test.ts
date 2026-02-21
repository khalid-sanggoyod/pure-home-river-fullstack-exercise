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

      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        mobileNumber: '+1-555-123-4567',
      });
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.createdAt).toBeDefined();
      expect(res.body.data.updatedAt).toBeDefined();
      expect(res.body.message).toBe('Property Agent successfully created');
    });

    it('should return 400 for missing firstName', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({ ...validAgent, firstName: '' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('First name');
    });

    it('should return 400 for missing lastName', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({ ...validAgent, lastName: '' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('Last name');
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({ ...validAgent, email: 'invalid-email' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('Email');
    });

    it('should return 400 for invalid phone number', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({ ...validAgent, mobileNumber: '123' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('Mobile number');
    });

    it('should return 400 for missing email', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({ ...validAgent, email: '' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for missing mobileNumber', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({ ...validAgent, mobileNumber: '' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return validation error for empty request body', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({})
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/agents', () => {
    it('should return empty paginated result when no agents exist', async () => {
      const res = await request(app)
        .get('/api/agents')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toEqual([]);
      expect(res.body.data.pagination).toEqual({
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

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(2); // Default limit is 2
      expect(res.body.data.pagination.total).toBe(3);
      expect(res.body.data.pagination.totalPages).toBe(2);
    });

    it('should support pagination parameters', async () => {
      // Create 3 agents
      await request(app).post('/api/agents').send(validAgent);
      await request(app).post('/api/agents').send({ ...validAgent, email: 'jane@example.com' });
      await request(app).post('/api/agents').send({ ...validAgent, email: 'bob@example.com' });

      const res = await request(app)
        .get('/api/agents?page=2&limit=2')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(1);
      expect(res.body.data.pagination.page).toBe(2);
    });

    it('should support search parameter', async () => {
      await request(app).post('/api/agents').send({ ...validAgent, firstName: 'John' });
      await request(app).post('/api/agents').send({ ...validAgent, firstName: 'Jane', email: 'jane@example.com' });

      const res = await request(app)
        .get('/api/agents?search=john')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(1);
      expect(res.body.data.data[0].firstName).toBe('John');
    });

    it('should support createdFrom date filter', async () => {
      await request(app).post('/api/agents').send(validAgent);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const res = await request(app)
        .get(`/api/agents?createdFrom=${tomorrowStr}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(0);
    });

    it('should support createdTo date filter', async () => {
      await request(app).post('/api/agents').send(validAgent);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const res = await request(app)
        .get(`/api/agents?createdTo=${yesterdayStr}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(0);
    });

    it('should return agents within date range', async () => {
      await request(app).post('/api/agents').send(validAgent);

      const today = new Date().toISOString().split('T')[0];

      const res = await request(app)
        .get(`/api/agents?createdFrom=${today}&createdTo=${today}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(1);
    });

    it('should handle invalid page parameter gracefully', async () => {
      await request(app).post('/api/agents').send(validAgent);

      const res = await request(app)
        .get('/api/agents?page=-1')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.pagination.page).toBe(1);
    });

    it('should handle invalid limit parameter gracefully', async () => {
      await request(app).post('/api/agents').send(validAgent);

      const res = await request(app)
        .get('/api/agents?limit=-1')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.pagination.limit).toBe(2);
    });
  });

  describe('GET /api/agents/:id', () => {
    it('should return an agent by id', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .get(`/api/agents/${createRes.body.data.id}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createRes.body.data.id);
      expect(res.body.data.firstName).toBe('John');
    });

    it('should return 404 for non-existent agent', async () => {
      const res = await request(app)
        .get('/api/agents/non-existent-id')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('AGENT_NOT_FOUND');
      expect(res.body.error.message).toContain('does not exist');
    });
  });

  describe('PUT /api/agents/:id', () => {
    it('should update an agent', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.data.id}`)
        .send({ firstName: 'Jane' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.firstName).toBe('Jane');
      expect(res.body.data.lastName).toBe('Smith'); // Unchanged
      expect(res.body.message).toBe('Property Agent successfully updated');
    });

    it('should return 404 for non-existent agent', async () => {
      const res = await request(app)
        .put('/api/agents/non-existent-id')
        .send({ firstName: 'Jane' })
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('AGENT_NOT_FOUND');
    });

    it('should return 400 for invalid email on update', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.data.id}`)
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('Email');
    });

    it('should return 400 for empty firstName on update', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.data.id}`)
        .send({ firstName: '' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for empty lastName on update', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.data.id}`)
        .send({ lastName: '' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for empty email on update', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.data.id}`)
        .send({ email: '' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for empty mobileNumber on update', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.data.id}`)
        .send({ mobileNumber: '' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid mobileNumber on update', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.data.id}`)
        .send({ mobileNumber: '123' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should update lastName only', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.data.id}`)
        .send({ lastName: 'Doe' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.lastName).toBe('Doe');
      expect(res.body.data.firstName).toBe('John');
    });

    it('should update email only', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.data.id}`)
        .send({ email: 'newemail@example.com' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('newemail@example.com');
    });

    it('should update mobileNumber only', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const res = await request(app)
        .put(`/api/agents/${createRes.body.data.id}`)
        .send({ mobileNumber: '+1-555-999-8888' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.mobileNumber).toBe('+1-555-999-8888');
    });
  });

  describe('DELETE /api/agents/:id', () => {
    it('should delete an agent', async () => {
      const createRes = await request(app)
        .post('/api/agents')
        .send(validAgent);

      const deleteRes = await request(app)
        .delete(`/api/agents/${createRes.body.data.id}`)
        .expect(200);

      expect(deleteRes.body.success).toBe(true);
      expect(deleteRes.body.message).toBe('Property Agent successfully deleted');

      // Verify agent is deleted
      await request(app)
        .get(`/api/agents/${createRes.body.data.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent agent', async () => {
      const res = await request(app)
        .delete('/api/agents/non-existent-id')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('AGENT_NOT_FOUND');
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

  describe('Rate Limiting', () => {
    it('should have rate limiting middleware configured', async () => {
      // In test environment, rate limiting is skipped
      // This test verifies the middleware is properly loaded
      const { apiLimiter, mutationLimiter } = require('../middleware/rateLimiter');

      expect(apiLimiter).toBeDefined();
      expect(mutationLimiter).toBeDefined();
      expect(typeof apiLimiter).toBe('function');
      expect(typeof mutationLimiter).toBe('function');
    });
  });
});

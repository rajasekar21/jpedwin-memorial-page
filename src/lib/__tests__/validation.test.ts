import { memorySubmissionSchema } from '../validation';

describe('memorySubmissionSchema', () => {
  const valid = {
    name: 'Jane Doe',
    relationship: 'Daughter',
    message: 'He was a wonderful father who always had time for us.'
  };

  it('accepts a valid submission', () => {
    const result = memorySubmissionSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  describe('name field', () => {
    it('rejects names shorter than 2 characters', () => {
      const result = memorySubmissionSchema.safeParse({ ...valid, name: 'A' });
      expect(result.success).toBe(false);
    });

    it('rejects names longer than 80 characters', () => {
      const result = memorySubmissionSchema.safeParse({ ...valid, name: 'A'.repeat(81) });
      expect(result.success).toBe(false);
    });

    it('strips HTML tags from name', () => {
      const result = memorySubmissionSchema.safeParse({ ...valid, name: '<b>Jane</b>' });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.name).toBe('Jane');
    });

    it('collapses extra whitespace in name', () => {
      const result = memorySubmissionSchema.safeParse({ ...valid, name: '  Jane   Doe  ' });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.name).toBe('Jane Doe');
    });
  });

  describe('relationship field', () => {
    it('rejects relationship shorter than 2 characters', () => {
      const result = memorySubmissionSchema.safeParse({ ...valid, relationship: 'D' });
      expect(result.success).toBe(false);
    });

    it('accepts a normal relationship value', () => {
      const result = memorySubmissionSchema.safeParse({ ...valid, relationship: 'Son' });
      expect(result.success).toBe(true);
    });
  });

  describe('message field', () => {
    it('rejects messages shorter than 20 characters', () => {
      const result = memorySubmissionSchema.safeParse({ ...valid, message: 'Too short.' });
      expect(result.success).toBe(false);
    });

    it('rejects messages longer than 2000 characters', () => {
      const result = memorySubmissionSchema.safeParse({ ...valid, message: 'A'.repeat(2001) });
      expect(result.success).toBe(false);
    });

    it('strips HTML tags from message', () => {
      const result = memorySubmissionSchema.safeParse({
        ...valid,
        message: '<script>alert("xss")</script>He was kind and generous.'
      });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.message).not.toContain('<script>');
    });

    it('accepts a message at exactly 20 characters', () => {
      const result = memorySubmissionSchema.safeParse({ ...valid, message: 'A'.repeat(20) });
      expect(result.success).toBe(true);
    });
  });

  it('rejects missing fields', () => {
    expect(memorySubmissionSchema.safeParse({}).success).toBe(false);
    expect(memorySubmissionSchema.safeParse({ name: 'Jane' }).success).toBe(false);
  });
});

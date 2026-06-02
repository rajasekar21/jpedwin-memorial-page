import { memorySubmissionSchema, memoryPhotoSchema } from '../validation';

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

describe('memoryPhotoSchema', () => {
  it('accepts undefined (photo is optional)', () => {
    expect(memoryPhotoSchema.safeParse(undefined).success).toBe(true);
  });

  it('accepts a valid JPEG file under 5 MB', () => {
    const file = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });
    expect(memoryPhotoSchema.safeParse(file).success).toBe(true);
  });

  it('accepts a valid PNG file', () => {
    const file = new File(['photo'], 'photo.png', { type: 'image/png' });
    expect(memoryPhotoSchema.safeParse(file).success).toBe(true);
  });

  it('accepts a valid WebP file', () => {
    const file = new File(['photo'], 'photo.webp', { type: 'image/webp' });
    expect(memoryPhotoSchema.safeParse(file).success).toBe(true);
  });

  it('rejects a file larger than 5 MB', () => {
    const largeContent = new Uint8Array(5 * 1024 * 1024 + 1);
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
    expect(memoryPhotoSchema.safeParse(file).success).toBe(false);
  });

  it('rejects a file at exactly 5 MB boundary (allowed)', () => {
    const content = new Uint8Array(5 * 1024 * 1024);
    const file = new File([content], 'exact.jpg', { type: 'image/jpeg' });
    expect(memoryPhotoSchema.safeParse(file).success).toBe(true);
  });

  it('rejects an unsupported MIME type (PDF)', () => {
    const file = new File(['data'], 'doc.pdf', { type: 'application/pdf' });
    expect(memoryPhotoSchema.safeParse(file).success).toBe(false);
  });

  it('rejects a GIF file', () => {
    const file = new File(['data'], 'anim.gif', { type: 'image/gif' });
    expect(memoryPhotoSchema.safeParse(file).success).toBe(false);
  });

  it('rejects a non-File value', () => {
    expect(memoryPhotoSchema.safeParse('not-a-file').success).toBe(false);
    expect(memoryPhotoSchema.safeParse(42).success).toBe(false);
  });
});

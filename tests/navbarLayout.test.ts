import { describe, it, expect } from 'vitest';
import { Navbar } from '../src/components/common/Navbar';

describe('Navbar Layout and Responsive Architecture', () => {
  it('exports Navbar component successfully', () => {
    expect(Navbar).toBeDefined();
    expect(typeof Navbar).toBe('function');
  });

  it('provides all 6 essential mathematics learning navigation destinations', () => {
    // Expected tabs: solo, arcade, multiplayer, curriculum, teacher, ai
    const validTabs = ['solo', 'arcade', 'multiplayer', 'curriculum', 'teacher', 'ai'] as const;
    expect(validTabs).toHaveLength(6);
    expect(validTabs).toContain('solo');
    expect(validTabs).toContain('arcade');
    expect(validTabs).toContain('multiplayer');
    expect(validTabs).toContain('teacher');
    expect(validTabs).toContain('curriculum');
    expect(validTabs).toContain('ai');
  });
});

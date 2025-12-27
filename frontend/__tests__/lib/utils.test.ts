import { formatCurrency, formatDate, formatDateTime, cn } from '@/lib/utils';

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('formats number to BRL currency', () => {
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
    });

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('R$ 0,00');
    });

    it('handles large numbers', () => {
      expect(formatCurrency(1234567.89)).toBe('R$ 1.234.567,89');
    });
  });

  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const date = '2024-12-26';
      const formatted = formatDate(date);
      expect(formatted).toBe('26/12/2024');
    });
  });

  describe('formatDateTime', () => {
    it('formats datetime string correctly', () => {
      const datetime = '2024-12-26T15:30:00';
      const formatted = formatDateTime(datetime);
      expect(formatted).toContain('26/12/2024');
      expect(formatted).toContain('15:30');
    });
  });

  describe('cn (classNames utility)', () => {
    it('merges class names', () => {
      const result = cn('class1', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('handles conditional classes', () => {
      const result = cn('base', false && 'hidden', true && 'visible');
      expect(result).toContain('base');
      expect(result).toContain('visible');
      expect(result).not.toContain('hidden');
    });

    it('handles undefined and null', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });
  });
});

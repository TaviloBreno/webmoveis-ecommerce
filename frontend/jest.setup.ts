import '@testing-library/jest-dom';
import React from 'react';

// Mock do next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
}));

// Mock do next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @typescript-eslint/no-unsafe-assignment
    return React.createElement('img', props);
  },
}));

// Mock do framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
    a: ({ children, ...props }: any) => React.createElement('a', props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
  useScroll: () => ({
    scrollYProgress: { get: () => 0 },
  }),
  useTransform: () => 0,
}));

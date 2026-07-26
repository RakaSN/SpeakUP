import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './index';

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles isLoading state correctly', () => {
    render(<Button isLoading>Submitting</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
  });
});

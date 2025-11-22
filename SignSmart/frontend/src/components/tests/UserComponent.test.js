import { render, screen, fireEvent } from '@testing-library/react';
import UserComponent from '../UserComponent';

test('renders user component', () => {
  render(<UserComponent />);
  const heading = screen.getByText(/users/i);
  expect(heading).toBeInTheDocument();
});

test('handles user input', () => {
  render(<UserComponent />);
  const input = screen.getByLabelText(/name/i);
  fireEvent.change(input, { target: { value: 'John Doe' } });
  expect(input.value).toBe('John Doe');
});
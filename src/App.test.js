import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login portal', () => {
  render(<App />);
  expect(screen.getByRole('main', { name: /berylbytes login/i })).toBeInTheDocument();
  expect(screen.getByText(/select account/i)).toBeInTheDocument();
});

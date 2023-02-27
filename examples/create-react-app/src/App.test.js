import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Lighthouse Viewer/i);
  const loading = screen.getByText(/no data loaded/i);
  expect(linkElement).toBeInTheDocument();
  expect(loading).toBeInTheDocument();
});

import React from 'react';
import { render } from '@testing-library/react';
import MyEventCard from '../MyEventCard';

describe('MyEventCard', () => {
  const mockEvent = {
    id: '1',
    name: 'Test Event',
    location: 'Test City',
    date: '2024-05-20',
    categories: ['Tech'],
    imageUrl: null,
  };

  const noop = () => {};

  it('renders correctly', () => {
    const { asFragment } = render(
      <MyEventCard event={mockEvent} onEdit={noop} onDelete={noop} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

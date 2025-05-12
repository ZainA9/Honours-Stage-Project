import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import EventCard from '../EventCard';

describe('EventCard Snapshot', () => {
  it('matches the snapshot', () => {
    const mockEvent = {
      id: '123',
      name: 'Tech Meetup',
      location: 'City Center',
      date: '2024-05-10',
      categories: ['tech'],
      imageUrl: '',
    };

    const tree = renderer
      .create(
        <MemoryRouter>
          <EventCard event={mockEvent} />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});

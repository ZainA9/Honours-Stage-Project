import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders correctly when user is not logged in', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ token: null }}>
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly when user is logged in', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ token: 'fakeToken' }}>
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

import { getUsers, createUser } from '../userService';

// Mock API calls
global.fetch = jest.fn();

test('fetches users successfully', async () => {
  const mockUsers = [{ id: 1, name: 'John Doe' }];
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockUsers,
  });

  const users = await getUsers();
  expect(users).toEqual(mockUsers);
});
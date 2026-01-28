export function fetchLoggedInUserOrders() {
  return new Promise(async (resolve) => {
    const response = await fetch('/api/orders/own/', {
      credentials: 'include', // ✅ Essential for "own" routes
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchLoggedInUser() {
  return new Promise(async (resolve) => {
    const response = await fetch('/api/users/own/', {
      credentials: 'include', // ✅ Essential for "own" routes
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function updateUser(update) {
  return new Promise(async (resolve) => {
    const response = await fetch('/api/users/' + update.id, {
      method: 'PATCH',
      body: JSON.stringify(update),
      headers: { 'content-type': 'application/json' },
      credentials: 'include', // ✅ Essential for permission checks
    });
    const data = await response.json();
    resolve({ data });
  });
}
export function fetchLoggedInUserOrders() {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8080/orders/own/', {
      credentials: 'include', // ✅ Essential for "own" routes
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchLoggedInUser() {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8080/users/own/', {
      credentials: 'include', // ✅ Essential for "own" routes
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function updateUser(update) {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8080/users/' + update.id, {
      method: 'PATCH',
      body: JSON.stringify(update),
      headers: { 'content-type': 'application/json' },
      credentials: 'include', // ✅ Essential for permission checks
    });
    const data = await response.json();
    resolve({ data });
  });
}
export function createOrder(order) {
    return new Promise(async (resolve) => {
      const response = await fetch('https://shopease-api.vercel.app/orders', {
        method: 'POST',
        body: JSON.stringify(order),
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      // TODO: on server it will only return some info of user (not password)
      resolve({ data });
    });
  }
  export function updateOrder(order) {
  return new Promise(async (resolve) => {
    const response = await fetch('https://shopease-api.vercel.app/orders/'+order.id, {
      method: 'PATCH',
      body: JSON.stringify(order),
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchAllOrders({ sort, pagination }) { // Assuming Redux passes one object {sort, pagination}
let queryString = '';

// 1. Build Query String
for (let key in sort) {
   queryString += `${key}=${sort[key]}&`;
}
for (let key in pagination) {
  queryString += `${key}=${pagination[key]}&`;
}

// Remove trailing '&' if it exists
if (queryString.endsWith('&')) {
  queryString = queryString.slice(0, -1);
}

return new Promise(async (resolve) => {
  const response = await fetch(
   '/orders?' + queryString
  ,{credentials: 'include',});

 // CRITICAL FIX: response.headers.get() is synchronous, remove 'await'
  const totalOrders = response.headers.get('X-Total-Count');
  
  const data = await response.json();

  // Ensure totalOrders defaults to 0 if header is missing/null (due to CORS/server config)
  resolve({ data: { orders: data, totalOrders: +(totalOrders || 0) } });
});
}
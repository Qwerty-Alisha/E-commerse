// features/auth/authAPI.js

export function createUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch('https://shopease-api.vercel.app/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'content-type': 'application/json' },
      credentials: 'include', // ✅ Correct
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function loginUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('https://shopease-api.vercel.app/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginInfo),
        headers: { 'content-type': 'application/json' },
        credentials: 'include', // ✅ Correct
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function checkAuth() {
  return new Promise(async (resolve, reject) => {
    try {
      // ❌ REMOVED: const response = await fetch('https://shopease-api.vercel.app/auth/check');
      
      // ✅ FIX: Use absolute URL + credentials to ensure Cookie is sent to Port 8080
      const response = await fetch('https://shopease-api.vercel.app/auth/check', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function signOut(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      // ✅ FIX: Actually call the server to destroy the session/cookie
      const response = await fetch('https://shopease-api.vercel.app/auth/logout', {
        credentials: 'include',
      });
      
      if (response.ok) {
        resolve({ data: 'success' });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}
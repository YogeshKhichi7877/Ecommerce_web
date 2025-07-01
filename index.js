document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

   // Show loading and disable button
  document.getElementById('loading').classList.remove('hidden');
  document.getElementsByClassName('submit').disabled = true;
  document.getElementById('message').classList.add('hidden');

  // your fetch code here
  const ownername = document.querySelector("#ownername").value;
const password = document.querySelector("#password").value;

    // Store token in localStorage
    function setToken(token) {
      localStorage.setItem('token', token);
    }

    function getToken() {
      return localStorage.getItem('token');
    }

    function clearToken() {
      localStorage.removeItem('token');
    }

if (ownername === "" || password === "") {
      document.getElementById('message').textContent = "Please enter your name and password";
    document.getElementById('message').className = "message error";
    document.getElementById('message').classList.remove('hidden');
    document.getElementById('loading').classList.add('hidden');
    document.querySelector('.submit').disabled = false;
    return;
} else {

  try {
    const response = await fetch('https://ecommerce-bomr.onrender.com/Login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ownername : ownername,
      password: password
    })
  });
  const data = await response.json(); // If the response is JSON
  if (response.ok && data.token) {
    //  setToken(data.token);
    // Store the JWT token in localStorage
      localStorage.setItem('token', data.token);
      

      // Show success message
      const message = document.getElementById('message');
      message.textContent = "Login successfull :)";
      message.className = 'message success';
      message.classList.remove('hidden');

      // Show the token in the console for debugging
      console.log("JWT Token generated:", data.token);
      // Optionally, show the token on the page (for debug only, remove in production)
      let tokenMsg = document.getElementById('token-message');
      if (!tokenMsg) {
        tokenMsg = document.createElement('div');
        tokenMsg.id = 'token-message';
        tokenMsg.style.wordBreak = 'break-all';
        tokenMsg.style.marginTop = '10px';
        document.body.appendChild(tokenMsg);
      }
      tokenMsg.textContent = 'JWT Token: ' + data.token;

      // Redirect to main site after a short delay
      setTimeout(() => {
        window.location.href = "ecommerce.html"; // Change to your main site URL if needed
      }, 2000);
      console.log("login completed");
      document.querySelector('form').reset(); // <-- CHANGE to your main site URL
} else {
    // Show error message
      const message = document.getElementById('message');
      message.textContent = data.error || "Error occured , please try again later ";
      message.className = 'message error';
      message.classList.remove('hidden');
    alert(data.error);
}
  }
  catch (error) {
    // Show error message
    const message = document.getElementById('message');
    message.textContent = "An error occurred. Please try again.";
    message.className = 'message error';
    message.classList.remove('hidden');
    console.log(error);
  } finally {
    // Hide loading and re-enable button
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('sub').disabled = false;
    // Hide message after 3 seconds
    setTimeout(() => {
      document.getElementById('message').classList.add('hidden');
    }, 3000);
  }
}
});

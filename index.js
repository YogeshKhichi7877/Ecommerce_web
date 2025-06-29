document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

   // Show loading and disable button
  document.getElementById('loading').classList.remove('hidden');
  document.getElementsByClassName('submit').disabled = true;
  document.getElementById('message').classList.add('hidden');

  // your fetch code here
  const ownername = document.querySelector("#ownername").value;
const password = document.querySelector("#password").value;

if (ownername === "" || password === "") {
  alert("Please enter your name and password");
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
  if (response.ok) {
      // Show success message
      const message = document.getElementById('message');
      message.textContent = "Login successfull :)";
      message.className = 'message success';
      message.classList.remove('hidden');
  // Login successful, redirect to your main site
    window.location.href = "ecommerce.html";
    console.log("login completed");
    document.querySelector('form').reset(); // <-- CHANGE to your main site URL
} else {
    // Show error message
      const message = document.getElementById('message');
      message.textContent = data.error || "Error occured , please try again later ";
      message.className = 'message error';
      message.classList.remove('hidden');

}
  }
  catch (error) {
    // Show error message
    const message = document.getElementById('message');
    message.textContent = "An error occurred. Please try again.";
    message.className = 'message error';
    message.classList.remove('hidden');
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

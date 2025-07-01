document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

   // Show loading and disable button
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('message').classList.add('hidden');

  // your fetch code here
  const ownername = document.querySelector("#ownername").value;
const password = document.querySelector("#password").value;

    // Store token in localStorage
    function setToken(token) {
      localStorage.setItem('token', token);
    }


if (ownername === "" || password === "") {
alert("please fill all details");
  
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
 
    // Store the JWT token in localStorage
      localStorage.setItem('token', data.token);
      

      // Show success message
      const message = document.getElementById('message');
      message.textContent = "Login successfull :)";
      message.className = 'message success';
      message.classList.remove('hidden');

     // Redirect to main site after a short delay
      setTimeout(() => {
        window.location.href = "ecommerce.html"; // Change to your main site URL if needed
      }, 1000);
    console.log("login completed");
    document.querySelector('form').reset(); // <-- CHANGE to your main site URL
} else {
    // Show error message
      const message = document.getElementById('message');
      message.textContent = data.error || "Error occured , please try again later ";
      message.className = 'message error';
      message.classList.remove('hidden');
      // alert(data.error || data.message );
      alert(data.token);
}
  }
  catch (error) {
    // Show error message
    console.log("error is :" , error);
    const message = document.getElementById('message');
    message.textContent = "An error occurred. Please try again.";
    message.className = 'message error';
    message.classList.remove('hidden');
  } finally {
    // Hide loading and re-enable button
    document.getElementById('loading').classList.add('hidden');
    // document.getElementById('sub').disabled = false;
    // Hide message after 3 seconds
    setTimeout(() => {
      document.getElementById('message').classList.add('hidden');
    }, 3000);
  }
}
});

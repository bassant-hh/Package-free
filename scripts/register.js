async function register() {
	const fullname = document.getElementById('name').value.trim();
	const username = document.getElementById('username').value.trim();
	const email = document.getElementById('email').value.trim();
	const phone = document.getElementById('phone').value.trim();
	const password = document.getElementById('password').value.trim();
	const repeatPwd = document.getElementById('repeat-password').value.trim();

	if( password != repeatPwd ) {
		alert('Please Match Your Passwords');
		return;
	}

  if (!username || !password || !email || !fullname || !phone) {
    alert("⚠️ Please enter all fields");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password,name: fullname,email,phone }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Server error:", text);
      alert("❌ Server error");
      return;
    }

    if (response.status == 201) {
      localStorage.setItem("username", username);
      window.location.href = "../index.html";
    }else {
    	const data = await response.json();
    	if( data['status'] == 'EXISTS' ) {
    		alert("❌ User already exists");
    		return;
    	}
    }

  } catch (error) {
    console.error("Network error:", error);
    alert("❌ Cannot connect to server");
  }
}
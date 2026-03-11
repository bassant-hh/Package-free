async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("⚠️ Please enter username and password");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    console.log(response);
    if (!response.ok) {
      const text = await response.text();
      console.error("Server error:", text);
      alert("❌ Server error");
      return;
    }

    const data = await response.json();

    if (data.status === "SUCCESS") {
      localStorage.setItem("username", username);
      window.location.href = "../index.html";
    } else {
      alert("❌ Username or Password is incorrect!");
    }

  } catch (error) {
    console.error("Network error:", error);
    alert("❌ Cannot connect to server");
  }
}

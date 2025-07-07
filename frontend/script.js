const loginBtn = document.getElementById('loginBtn');
 const signupBtn = document.getElementById('signupBtn');
 const loginForm = document.getElementById('loginForm');
 const signupForm = document.getElementById('signupForm');

 loginBtn.addEventListener('click', () => {
 loginForm.style.display = 'block';
 signupForm.style.display = 'none';
 loginBtn.classList.add('active');
 signupBtn.classList.remove('active');
 });

 signupBtn.addEventListener('click', () => {
 loginForm.style.display = 'none';
 signupForm.style.display = 'block';
 signupBtn.classList.add('active');
 loginBtn.classList.remove('active');
 });
 

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: document.getElementById('name').value,
                    email: document.getElementById('signupEmail').value,
                    password: document.getElementById('signupPassword').value
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('  ✅ Signup successful!');
            } else {
                alert('Signup failed: ${data.message}');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred during signup.');
        }
    });
});

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("🔹 Sending Login Data:", { email, password });  

    try {
        const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("🔹 Server Response:", data);

        if (!response.ok) {
            throw new Error(data.message || "Invalid credentials");
        }

        alert("Login successful!");
        console.log("✅ Login successful:", data);

    } catch (error) {
        console.error("🔥 Error during login:", error);
        alert(error.message);
    }
});
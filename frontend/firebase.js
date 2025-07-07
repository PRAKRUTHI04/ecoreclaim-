import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile, 
    onAuthStateChanged,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCPtO-CSuNsHJKKKXW-4oKGIJBsuqW5Irs",
    authDomain: "login-signup-74365.firebaseapp.com",
    projectId: "login-signup-74365",
    storageBucket: "login-signup-74365.appspot.com",
    messagingSenderId: "654961972681",
    appId: "1:654961972681:web:2c8d8d6f069cdcbf074418"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Save user data in Firestore
async function saveUserData(user) {
    if (!user) return;
  
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        firstName: user.displayName ? user.displayName.split(" ")[0] : "",
        lastName: user.displayName ? user.displayName.split(" ")[1] || "" : "",
        email: user.email,
        phone: "",
        country: "",
        state: "",
        city: ""
    }, { merge: true });
}

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await updateProfile(user, { displayName: name });

                await saveUserData(user); // ✅ Fixed: storeUserData replaced with saveUserData

                alert("✅ Sign-up successful! Redirecting to login...");
                window.location.href = "ls.html"; 

            } catch (error) {
                console.error("❌ Signup error:", error.message);
                alert("❌ Signup failed: " + error.message);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("✅ Login successful", userCredential.user);
                alert("✅ Login successful!");
                window.location.href = "dashboard.html"; 

            } catch (error) {
                console.error("❌ Login error:", error.message);
                alert("❌ Login failed: " + error.message);
            }
        });
    }

    const fp = document.querySelector(".forgot-password a");
    if (fp) {
        fp.addEventListener("click", async function (event) {
            event.preventDefault();
            const email = prompt("📧 Enter your valid email id to receive a password reset link:");

            if (email) {
                try {
                    await sendPasswordResetEmail(auth, email);
                    alert("✅ Password reset email sent. Check your inbox.");
                } catch (error) {
                    console.error("❌ Error:", error.message);
                    alert("❌ Error: " + error.message);
                }
            }
        });
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("✅ User logged in:", user);
            console.log("📝 Display Name:", user.displayName);
        } else {
            console.log("❌ No user found.");
        }
    });
});

// ✅ Export at the end to avoid ReferenceErrors
export { app, db, auth };
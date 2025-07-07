import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCPtO-CSuNsHJKKKXW-4oKGIJBsuqW5Irs",
    authDomain: "login-signup-74365.firebaseapp.com",
    projectId: "login-signup-74365",
    storageBucket: "login-signup-74365.appspot.com",
    messagingSenderId: "654961972681",
    appId: "1:654961972681:web:2c8d8d6f069cdcbf074418"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function fetchUserProfile(userId) {
    const userRef = doc(db, "users", userId); 
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const userData = userSnap.data();
        document.getElementById("userName").textContent = userData.name || "Not Available";
        document.getElementById("userEmail").textContent = userData.email || "Not Available";
        document.getElementById("userPhone").textContent = userData.phone || "Not Available";
        document.getElementById("state").textContent = userData.state || "Not Available";
        document.getElementById("city").textContent = userData.city || "Not Available";
        document.getElementById("profilePic").src = userData.profilePic || "C:\Users\DELL\Desktop\e-waste\Screenshot 2025-03-08 133046.png";
    } else {
        console.log("No user data found!");
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchUserProfile(user.uid); 
    } else {
        alert("No user is signed in.");
        window.location.href = "ls.html"; 
    }
});

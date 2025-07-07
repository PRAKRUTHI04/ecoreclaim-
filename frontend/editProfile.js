import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
    const backToProfileBtn = document.getElementById("backToProfile");

    if (backToProfileBtn) {
        backToProfileBtn.addEventListener("click", function () {
            window.location.href = "profile.html";
        });
    }
});

const emailField = document.getElementById("email");
const firstNameField = document.getElementById("firstName");
const lastNameField = document.getElementById("lastName");
const phoneInput = document.getElementById("phone");
const countryInput = document.getElementById("country");
const stateSelect = document.getElementById("state");
const citySelect = document.getElementById("city");
const saveButton = document.getElementById("saveProfile");

const countryMapping = {
    "in": "India",
    "us": "United States",
    "gb": "United Kingdom",
    "ca": "Canada",
    "au": "Australia",
    "de": "Germany",
    "fr": "France",
    "jp": "Japan",
    "cn": "China"
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("✅ User logged in:", user);
        emailField.value = user.email;

        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                firstNameField.value = userData.firstName || (user.displayName ? user.displayName.split(" ")[0] : "");
                lastNameField.value = userData.lastName || "";
                phoneInput.value = userData.phone || "";
                if (userData.country) {
                    countryInput.value = userData.country;
                    loadStates(userData.country);
                }

                if (userData.state) {
                    setTimeout(() => {
                        stateSelect.value = userData.state;
                        loadCities();
                    }, 1000);
                }
                if (userData.city) {
                    setTimeout(() => {
                        citySelect.value = userData.city;
                    }, 1500);
                }
            } else {
                console.log("⚠️ No user data found in Firestore.");
            }
        } catch (error) {
            console.error("❌ Error fetching user data:", error);
        }
    } else {
        console.log("❌ No user found. Redirecting to login.");
        window.location.href = "ls.html";
    }
});

const iti = window.intlTelInput(phoneInput, {
    initialCountry: "in",
    preferredCountries: ["in", "us", "gb", "ca"],
    separateDialCode: true,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
});


phoneInput.addEventListener("countrychange", function () {
    let countryCode = iti.getSelectedCountryData().iso2;
    let countryName = countryMapping[countryCode];

    if (countryName) {
        countryInput.value = countryName;
        loadStates(countryName);
    }
});


async function loadStates(countryName) {
    stateSelect.innerHTML = `<option value="">Select State</option>`;
    citySelect.innerHTML = `<option value="">Select City</option>`;
    stateSelect.disabled = true;
    citySelect.disabled = true;

    if (countryName) {
        try {
            const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country: countryName })
            });

            const data = await response.json();
            if (data.data.states.length > 0) {
                stateSelect.disabled = false;
                data.data.states.forEach(state => {
                    let option = document.createElement("option");
                    option.value = state.name;
                    option.textContent = state.name;
                    stateSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error("❌ Error loading states:", error);
        }
    }
}

async function loadCities() {
    let selectedState = stateSelect.value;
    let countryName = countryInput.value;
    citySelect.innerHTML = `<option value="">Select City</option>`;
    citySelect.disabled = true;

    if (selectedState) {
        try {
            const response = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country: countryName, state: selectedState })
            });

            const data = await response.json();
            if (data.data.length > 0) {
                citySelect.disabled = false;
                data.data.forEach(city => {
                    let option = document.createElement("option");
                    option.value = city;
                    option.textContent = city;
                    citySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error("❌ Error loading cities:", error);
        }
    }
}

stateSelect.addEventListener("change", loadCities);

saveButton.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
        alert("No user is logged in.");
        return;
    }

    const updatedData = {
        firstName: firstNameField.value.trim(),
        lastName: lastNameField.value.trim(),
        phone: phoneInput.value.trim(),
        country: countryInput.value.trim(),
        state: stateSelect.value.trim(),
        city: citySelect.value.trim(),
        updatedAt: new Date() 
    };

    try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, updatedData);
        alert("Profile updated successfully!");
        window.location.href = "profile.html"; 
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
    }
});
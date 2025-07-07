const recommendationMap = {
    "Mobile": {
        name: "Zolopik E-Waste Recycling",
        phone: "8884449985"
    },
    "Microwave": {
        name: "Saahas Zero Waste",
        phone: "08041689889"
    },
    "Keyboard": {
        name: "Ash Recyclers",
        phone: "08026789012"
    },
    "Printer": {
        name: "Eco-Ewaste Recyclers India Pvt Ltd",
        phone: "08029012345"
    },
    "PCB": {
        name: "E-Parisara Pvt Ltd",
        phone: "08027839999"
    },
    "Television": {
        name: "E-Parisara Pvt Ltd",
        phone: "08027839999"
    },
    "Washing Machine": {
        name: "Earth Sense Recycle",
        phone: "08041234567"
    },
    "Mouse": {
        name: "Ash Recyclers",
        phone: "08026789012"
    },
    "Battery": {
        name: "Gravity E-Waste Management",
        phone: "08023456789"
    },
    "Player": {
        name: "Zolopik E-Waste Recycling",
        phone: "8884449985"
    }
};

async function fetchNews() {
    const apiUrl = "https://newsapi.org/v2/everything?q=e-waste&apiKey=7e24de79415049bb8e4f77ed421da9ed"; 
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const newsList = document.getElementById("news-list");
        newsList.innerHTML = ""; 

        data.articles.forEach(article => {
            const listItem = document.createElement("li");
            listItem.classList.add("news-item");

              const newsLink = document.createElement("a");
            newsLink.href = article.url; 
            newsLink.target = "_blank"; 
            newsLink.style.textDecoration = "none";
            newsLink.style.color = "black";

            const image = document.createElement("img");
            image.src =article.urlToImage ? article.urlToImage : "th.jpeg"; 
            image.alt = "News Image";
            image.classList.add("news-image");

            
            const text = document.createElement("p");
            text.textContent = article.title;

            
           newsLink.appendChild(image);
            newsLink.appendChild(text);
            listItem.appendChild(newsLink);
            newsList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}


fetchNews();


document.addEventListener("DOMContentLoaded", function () {
    const referEarnBtn = document.getElementById("referEarnBtn");
    const shareModal = document.getElementById("shareModal");
    const closeModal = document.getElementById("closeModal");
    const totalPointsDisplay = document.getElementById("totalPoints");

    let totalPoints = parseInt(localStorage.getItem("userPoints")) || 30;
    totalPointsDisplay.textContent = totalPoints;
    let sharedContacts = JSON.parse(localStorage.getItem("sharedContacts")) || [];

    referEarnBtn.addEventListener("click", function () {
        shareModal.style.display = "block";
    });

    closeModal.addEventListener("click", function () {
        shareModal.style.display = "none";
    });

    function handleSharing(platform, contact) {
        if (sharedContacts.includes(contact)) {
            alert(`You've already shared with this contact on ${platform}. Try sharing with someone else!`);
            return;
        }

        sharedContacts.push(contact);
        localStorage.setItem("sharedContacts", JSON.stringify(sharedContacts));

        totalPoints += 10;
        totalPointsDisplay.textContent = totalPoints;
        localStorage.setItem("userPoints", totalPoints);

        alert(`Shared via ${platform}! 🎉 You earned 10 points!`);
    }

    document.getElementById("shareWhatsapp").addEventListener("click", function () {
        const message = encodeURIComponent("Join me on EcoReclaim! 🌱 Start recycling and earn rewards! Visit: https://yourwebsite.com");
        window.open(`https://wa.me/?text=${message}`, "_blank");
        handleSharing("WhatsApp", "whatsapp_user");
    });

    document.getElementById("shareInstagram").addEventListener("click", function () {
        const websiteURL = "https://yourwebsite.com";

        // Copy link to clipboard
        const tempInput = document.createElement("input");
        tempInput.value = websiteURL;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        alert("Instagram does not support direct link sharing. The referral link has been copied! Paste it in your bio or messages on Instagram.");
        handleSharing("Instagram", "instagram_user");
    });

    document.getElementById("shareEmail").addEventListener("click", function () {
        const subject = encodeURIComponent("Join EcoReclaim and Earn Rewards!");
        const body = encodeURIComponent("Hey, check out EcoReclaim! 🌱 Start recycling and earn rewards. Visit: https://yourwebsite.com");
        window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
        handleSharing("Email", "email_user");
    });

    document.getElementById("shareLinkedIn").addEventListener("click", function () {
        const url = encodeURIComponent("https://yourwebsite.com");
        const title = encodeURIComponent("Join EcoReclaim and Earn Rewards!");
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, "_blank");
        handleSharing("LinkedIn", "linkedin_user");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let totalPoints = 50; 

    document.getElementById("giftVoucherBtn").addEventListener("click", function () {
        if (totalPoints >= 50) {
            totalPoints -= 50; 
            document.getElementById("voucherMessage").innerHTML = 
                "✅ You have successfully redeemed 50 points for a Gift Voucher!<br>💰 You got ₹50 off!";
            document.getElementById("voucherMessage").style.display = "block";
        } else {
            alert("❌ Not enough points to redeem a gift voucher!");
        }
    });
});




function triggerUpload() {
    document.getElementById("autoImageInput").click();
}

document.getElementById("autoImageInput").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    // Optional: visual feedback
    alert("⏳ Uploading and classifying...");

    fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        const predictedLabel = data.label;
const center = recommendationMap[predictedLabel];

let message = `✅ Predicted: ${predictedLabel}`;

if (center) {
    message += `\n📍 Recommended Center: ${center.name}\n📞 Phone: ${center.phone}`;
}

alert(message);

// Then redirect after showing alert
setTimeout(() => {
    window.location.href = `centers.html?type=${encodeURIComponent(predictedLabel)}`;
}, 1000);

        // Optionally redirect to centers page:
        window.location.href = `centers.html?type=${encodeURIComponent(data.label)}`;
    })
    .catch(err => {
        console.error(err);
        alert("❌ Failed to classify image.");
    });
});


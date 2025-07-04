document.addEventListener("DOMContentLoaded", function () {
    const editProfileBtn = document.getElementById("editProfile");

    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", function () {
            window.location.href = "editProfile.html"; 
        });
    }
});

document.getElementById("backToDashboard").addEventListener("click", function () {
    window.location.href = "dashboard.html";
});


document.getElementById("viewProfile").addEventListener("click", function() {
    window.location.href = "viewProfile.html";
});

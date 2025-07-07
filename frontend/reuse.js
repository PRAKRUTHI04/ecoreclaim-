document.addEventListener("DOMContentLoaded", function () {
    function toggleDescription(button) {
        const websiteDiv = button.closest(".website"); 
        const description = websiteDiv.querySelector(".description"); 

        if (description) {
            description.classList.toggle("hidden");
            button.textContent = description.classList.contains("hidden") ? "See More" : "See Less";
        }
    }

    
    document.querySelectorAll(".toggle-btn").forEach(button => {
        const description = button.closest(".website").querySelector(".description");
        if (description) {
            description.classList.add("hidden"); 
            button.textContent = "See More"; 
        }

        // Attach event listener to each button
        button.addEventListener("click", function () {
            toggleDescription(this);
        });
    });

    console.log("Script loaded and initialized!");
});

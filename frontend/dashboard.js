// Function to show sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Set user details from localStorage
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("userName").innerText = localStorage.getItem("userName") || "Guest";
    document.getElementById("userEmail").innerText = localStorage.getItem("userEmail") || "Not Available";
    document.getElementById("userPhone").innerText = localStorage.getItem("userphone") || "Not Available";
});
//



// Logout function
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    alert("Logged out successfully!");
    window.location.href = "index.html";
});


document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://localhost:5000/api/user-dashboard", {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch data");


        // if (!data.policies || data.policies.length === 0) {
        //     console.warn("No policies found for user.");
        // }
        // Display user info
        document.getElementById("userName").innerText = data.user.name;
        document.getElementById("userEmail").innerText = data.user.email;
        document.getElementById("userPhone").innerText = data.user.phone;
        
        // Display policies
        const policiesSection = document.getElementById("policies");
        policiesSection.innerHTML = "<h2>Your Insurance Plans</h2>";

        data.insurances.forEach(policy => {
//             const policyCard = `
//                <div class="card">
//               <h3 class = "card1" >${policy.policy_type}</h3>  <!-- Policy Type (e.g., Comprehensive) -->
//               <p class = "card1">Premium: $${policy.premium}</p>  <!-- Premium Amount -->
//               <p class = "card1">Expiry: ${new Date(policy.end_date).toLocaleDateString()}</p>  <!-- Format Expiry Date -->
//               <button>Renew Plan</button>
// </div>

//             `;
       const isExpired = new Date(policy.endDate) < new Date();
       const status = isExpired ? "Expired" : "Active";
          const policyCard = `
               
                <div class="card">
                <h3>Policy - ${policy._id}<h3>
                <h3 class = "card1" >${policy.coverage}</h3>  <!-- Policy Type (e.g., Comprehensive) -->
                <p class = "card1">Premium: $${policy.finalQuote}</p>  <!-- Premium Amount -->
                <p class = "card1">Expiry: ${new Date(policy.endDate).toLocaleDateString()}</p>  <!-- Format Expiry Date -->
              
               <p class="card1"><strong>Status:</strong> <span style="color: ${isExpired ? 'red' : 'green'};">${status}</span></p>
               <button onclick="renewPolicy('${policy._id}',${policy.finalQuote})">Renew Plan</button>
               <button class="download-pdf-btn" data-id="${policy._id}">Download PDF</button>

         </div>

            `;
            policiesSection.innerHTML += policyCard;
        });
        document.addEventListener("click", async (e) => {
            if (e.target.classList.contains("download-pdf-btn")) {
                e.stopPropagation();
        
                // Disable button to prevent multiple downloads
                e.target.disabled = true;
                e.target.innerText = "Generating...";
        
                const policyCard = e.target.closest(".card");
                if (!policyCard) {
                    console.error("❌ Policy card not found!");
                    e.target.disabled = false;
                    e.target.innerText = "Download PDF";
                    return;
                }
        
                const policyId = e.target.dataset.id;
                generatePolicyPDF(policyId, policyCard);
        
                // Re-enable button after PDF is created
                e.target.disabled = false;
                e.target.innerText = "Download PDF";
            }
        });
        
        // ✅ Function to Generate PDF
        function generatePolicyPDF(policyId, policyCard) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
        
            doc.setFontSize(16);
            doc.text("Policy Details", 80, 20);
        
            const policyData = [
                ["Policy ID", policyId],
                ["Coverage", getText(policyCard, "Coverage")],
                ["Premium", getText(policyCard, "Premium")],
                ["Expiry", getText(policyCard, "Expiry")],
                ["Status", getText(policyCard, "Status")]
            ];
        
            // Add table to PDF
            doc.autoTable({
                startY: 30,
                head: [["Field", "Value"]],
                body: policyData,
                styles: { fontSize: 12 },
                headStyles: { fillColor: [0, 123, 255] },
            });
        
            // Save the PDF
            doc.save(`Policy_${policyId}.pdf`);
        }
        
        // ✅ Helper Function to Extract Text from Policy Card
function getText(policyCard, label) {
    const elements = Array.from(policyCard.querySelectorAll(".card1"));
    
    for (let el of elements) {
        if (el.innerText.includes(label)) {
            return el.innerText.split(": ").pop().trim();
        }
    }
    
    return "N/A"; // If no match is found
}
        

        const vehiclesSection = document.getElementById("vehicles");
        vehiclesSection.innerHTML = "<h2>Your Vehicles</h2>";
        
        data.vehicles.forEach(vehicle => {
            const vehicleCard = document.createElement("div");
            vehicleCard.classList.add("card");
            vehicleCard.innerHTML = `
                <h3 class="card1">Model: ${vehicle.model}</h3>
                <p class="card1">License Plate: ${vehicle.plateNumber}</p>
                <p class="card1">Year: ${vehicle.year}</p>
                <button class="delete-btn" data-id="${vehicle._id}">Delete</button>
            `;
        
            vehiclesSection.appendChild(vehicleCard);
        });
        
        
        // Add event listener for delete buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async (event) => {
                const vehicleId = event.target.dataset.id;
                const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
                try {
                    const response = await fetch(`http://localhost:5000/api/vehicles/${vehicleId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`, // Send token for authentication
                            "Content-Type": "application/json",
                        }

                    });
        
                    if (response.ok) {
                        event.target.parentElement.remove(); // Remove vehicle from UI
                        alert("Vehicle deleted successfully!");
                    } else {
                        alert("Failed to delete vehicle.");
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            });
        });
        

       const quotesSection = document.getElementById("quotes");
quotesSection.innerHTML = "<h2>Your Quotes</h2>";

console.log("Loaded data:", data); // Debugging line
if (!data || !data.quotes) {
    console.error("Quotes data is missing or undefined.");
    quotesSection.innerHTML = "<p>No quotes available.</p>";
    return;
}


data.quotes.forEach(quote => {
    const quoteCard = document.createElement("div");
    quoteCard.classList.add("card");
    quoteCard.innerHTML = `
        <h3 class="card1">Quote ID: ${quote._id}</h3>
        <p class="card1">Vehicle: ${quote.vehicleType}</p>
        <p class="card1">Premium: $${quote.finalQuote}</p>
        <p class="card1">Coverage: ${quote.coverageType}</p>
        <p class="card1">Vehicle Age: ${quote.vehicleAge}</p>
        <p class="card1">Plate: ${quote.plate}</p>
        <p class="card1">Plan: ${quote.planid}</p>
        <button class="delete-btn" data-id="${quote._id}">Delete</button>
        <button class="create-insurance-btn" data-id="${quote._id}">Create Insurance</button>
            <button class="download-pdf-btn" data-id="${quote._id}">Download PDF</button>
    `;

    quotesSection.appendChild(quoteCard);
});
    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("download-pdf-btn")) {
            const quoteId = e.target.dataset.id;
            const quoteCard = e.target.closest(".card"); // Get the parent div
    
            if (quoteCard) {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
    
                // 🖼️ Replace this with your actual Base64 logo
                const logoImg = "data:image/jpeg;base64,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"; // Paste Base64 here
    
                // 🏢 Add Logo
                doc.addImage(logoImg, "PNG", 10, 10, 40, 20); // x, y, width, height
    
                // 📝 Add Title
                doc.setFontSize(16);
                doc.text("Insurance Quote", 80, 20);
    
                // 🗂️ Extract Quote Data
                const quoteData = [
                    ["Quote ID", quoteId],
                    ["Vehicle", quoteCard.querySelector(".card1:nth-child(2)").innerText.split(": ")[1]],
                    ["Premium", quoteCard.querySelector(".card1:nth-child(3)").innerText.split(": ")[1]],
                    ["Coverage", quoteCard.querySelector(".card1:nth-child(4)").innerText.split(": ")[1]],
                    ["Vehicle Age", quoteCard.querySelector(".card1:nth-child(5)").innerText.split(": ")[1]],
                    ["Plate", quoteCard.querySelector(".card1:nth-child(6)").innerText.split(": ")[1]],
                    ["Plan", quoteCard.querySelector(".card1:nth-child(7)").innerText.split(": ")[1]],
                ];
    
                // 📊 Add Table with AutoTable Plugin
                doc.autoTable({
                    startY: 40,
                    head: [["Field", "Value"]],
                    body: quoteData,
                    styles: { fontSize: 12 },
                    headStyles: { fillColor: [0, 123, 255] }, // Blue header
                });
    
                // 📥 Save PDF
                doc.save(`Quote_${quoteId}.pdf`);
            }
        }
    });
    


// Add event listener for "Create Insurance" buttons
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("create-insurance-btn")) {
        const quoteId = event.target.getAttribute("data-id");
        window.location.href = `newoption.html?quoteId=${quoteId}`; // Redirect with ID in URL
    }
});

document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", async (event) => {
        const quoteId = event.target.dataset.id;
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        try {
            const response = await fetch(`http://localhost:5000/api/quote/${quoteId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`, // Send token for authentication
                    "Content-Type": "application/json",
                }

            });

            if (response.ok) {
                event.target.parentElement.remove(); // Remove vehicle from UI
                alert("Vehicle deleted successfully!");
            } else {
                alert("Failed to delete vehicle.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});


        // Display claims
        const claimsSection = document.getElementById("claims");
        claimsSection.innerHTML = "<h2>Your Claims</h2>";

        if (!data.claims || data.claims.length === 0) {
            claimsSection.innerHTML += "<p>No claims found.</p>";
        } else {
            data.claims.forEach(claim => {
                console.log("Claim Data:", claim);
                const claimCard = `
                    <div class="card">
                    <h3>Claim for Policy ID: ${claim.policy_id}</h3>
                        <p class = "card1" >Reason: ${claim.claim_reason}</p>
                        <p class = "card1">Amount: $${claim.claim_amount}</p>
                        <p class = "card1">Status: ${claim.claim_status}</p>
                        <p class = "card1">Filed On: ${new Date(claim.createdAt).toLocaleDateString()}</p>
                        <h3 class = "card1">Claim for ${claim.policy_id ? claim.policy_id.policy_type : "Unknown Policy"}</h3>
                        <p class = "card1">Status: ${claim.claim_status || "Pending"}</p>
                        <p class = "card1">Amount: $${claim.amount || "N/A"}</p>
                        <p class = "card1">Date Filed: ${claim.date_filed ? new Date(claim.date_filed).toLocaleDateString() : "N/A"}</p>
                        <a href="${claim.documents}" target="_blank">View Documents</a>
                    </div>
                `;
                claimsSection.innerHTML += claimCard;
            });
        }

    } catch (error) {
        alert("Error loading dashboard: " + error.message);
    }
});


const modal = document.getElementById("editProfileModal");
// Show Edit Form
document.getElementById("editProfileBtn").addEventListener("click", function () {
    document.getElementById("editName").value = document.getElementById("userName").innerText;
    document.getElementById("editEmail").value = document.getElementById("userEmail").innerText;
    document.getElementById("editPhone").value = document.getElementById("userPhone").innerText;
    document.getElementById("editProfileModal").style.display = "block";
});


window.onclick = function (event) {
    const modal = document.getElementById("editProfileModal");
    if (event.target === modal) {
        modal.style.display = "none"; // Hide modal when clicking outside
    }
};

// Save Profile Updates
document.getElementById("saveProfileBtn").addEventListener("click", async () => {
    const updatedName = document.getElementById("editName").value;
    const updatedEmail = document.getElementById("editEmail").value;
    const updatedPhone = document.getElementById("editPhone").value;

    try {
        const response = await fetch("http://localhost:5000/api/update-profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
               // credentials: "include",
            },
            body: JSON.stringify({ name: updatedName, email: updatedEmail, phone : updatedPhone })
        });

        const text = await response.text();
        console.log("Raw response:", text);

        if (text) {
            const result = JSON.parse(text);
            if (!response.ok) throw new Error(result.message || "Failed to update profile");
        }

        // Update UI
        document.getElementById("userName").innerText = updatedName;
        document.getElementById("userEmail").innerText = updatedEmail;
        document.getElementById("userPhone").innerText = updatedPhone;

        // Update local storage
        localStorage.setItem("userName", updatedName);
        localStorage.setItem("userEmail", updatedEmail);
        localStorage.setItem("userPhone", updatedPhone);

        // Hide modal
        document.getElementById("editProfileModal").style.display = "none";
        alert("Profile updated successfully!");
    } catch (error) {
        alert("Error updating profile: " + error.message);
    }
});

// async function renewPolicy(policyId) {
//     const token = localStorage.getItem("token");
//     if (!policyId) {
//         alert("Error: Invalid insurance ID");
//         return;
//     }
//     try {
//         const response = await fetch(`http://localhost:5000/api/insurance/renew/${policyId}`, {
//             method: "PUT",
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json"
//             }
//         });

//         const data = await response.json();
//         console.log("Renewal response:", data);

//         if (!response.ok) {
//             throw new Error(data.message || "Failed to renew policy");
//         }

//         alert("Policy renewed successfully!");
//         location.reload();
//     } catch (error) {
//         console.error("Error renewing policy:", error);
//         alert(`Error renewing policy: ${error.message}`);
//     }
// }
async function renewPolicy(policyId, amount) {
    const token = localStorage.getItem("token");
    if (!policyId) {
        alert("Error: Invalid insurance ID");
        return;
    }

    // Redirect to payment page with policyId and amount
    window.location.href = `payment1.html?policyId=${(policyId)}&amount=${(amount)}`;
}

// document.addEventListener("DOMContentLoaded", async function () {
    
//     try {
//         const planTableBody = document.getElementById("planTableBody");
//         if (!planTableBody) {
//             console.error("Error: Element with ID 'planTableBody' not found.");
//             return; // Stop execution if the table is missing
//         }
//         const response = await fetch("http://localhost:5000/api/plan/plans", {
//             method: "GET",
//             headers: { "Content-Type": "application/json" }
//         });

//         if (!response.ok) throw new Error("Failed to fetch plans");

//         const plans = await response.json();
//         displayPlans(plans);
//     } catch (error) {
//         console.error("Error fetching plans:", error);
//         alert("Error fetching plans: " + error.message);
//     }
// });

// function displayPlans(plans) {
//     const planTableBody = document.getElementById("planTableBody");
//     planTableBody.innerHTML = "";

//     plans.forEach(plan => {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td>${plan._id}</td>
//             <td>${plan.name}</td>
//             <td>${plan.coverage}</td>
//             <td>₹${plan.premium}</td>
//             <td>${plan.duration} Year(s)</td>
//             <td>${plan.details}</td>
//         `;
//         planTableBody.appendChild(row);
//     });
// }
// function openModal(plan) {
//     // Get modal elements
//     document.getElementById("modalPlanName").innerText = plan.name;
//     document.getElementById("modalCoverage").innerText = plan.coverage;
//     document.getElementById("modalPremium").innerText = plan.premium;
//     document.getElementById("modalDuration").innerText = plan.duration + " Year(s)";
//     document.getElementById("modalDetails").innerText = plan.details;

//     // Show modal
//     document.getElementById("planModal").style.display = "block";
// }

// function closeModal() {
//     document.getElementById("planModal").style.display = "none";
// }

// // Close the modal when clicking outside the content
// window.onclick = function (event) {
//     const modal = document.getElementById("planModal");
//     if (event.target === modal) {
//         closeModal();
//     }
// };


// document.addEventListener("DOMContentLoaded", async function () {
//     const planTableBody = document.getElementById("planTableBody"); // Corrected ID
//     if (!planTableBody) {
//         console.error("Error: Element with ID 'planTableBody' not found.");
//         return;
//     }

//     try {
//         const response = await fetch("http://localhost:5000/api/plan/plans", {
//             method: "GET",
//             headers: { "Content-Type": "application/json" }
//         });

//         if (!response.ok) throw new Error("Failed to fetch plans");

//         const plans = await response.json();
//         displayPlans(plans);
//     } catch (error) {
//         console.error("Error fetching plans:", error);
//         alert("Error fetching plans: " + error.message);
//     }
// });

// function displayPlans(plans) {
//     const planTableBody = document.getElementById("planTableBody"); // Use correct ID
//     if (!planTableBody) return;

//     planTableBody.innerHTML = ""; // Clear previous content

//     plans.forEach(plan => {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td>${plan._id}</td>
//             <td>${plan.name}</td>
//             <td>${plan.coverage}</td>
//             <td>₹${plan.premium}</td>
//             <td>${plan.duration} Year(s)</td>
//             <td>
//                 <button onclick='openModal(${JSON.stringify(plan)})'>View Details</button>
//             </td>
//         `;
//         planTableBody.appendChild(row);
//     });
// }

// function openModal(plan) {
//     document.getElementById("modal_id").innerText = plan._id;
//     document.getElementById("modalPlanName").innerText = plan.name;
//     document.getElementById("modalCoverage").innerText = plan.coverage;
//     document.getElementById("modalPremium").innerText = plan.premium;
//     document.getElementById("modalDuration").innerText = plan.duration + " Year(s)";
//     document.getElementById("modalDetails").innerText = plan.details;

//     document.getElementById("planModal").style.display = "block";
// }

// function closeModal() {
//     document.getElementById("planModal").style.display = "none";
// }

// // Close the modal when clicking outside the content
// window.onclick = function (event) {
//     const modal = document.getElementById("planModal");
//     if (event.target === modal) {
//         closeModal();
//     }
// };

// function proceedToPayment() {
//     //window.location.herf = "payment.html";
//     alert("Redirecting to Quote...");
//     window.location.href = "get-quote.html";
// }
document.addEventListener("DOMContentLoaded", async function () {
    const planTableBody = document.getElementById("planTableBody");
    if (!planTableBody) {
        console.error("Error: Element with ID 'planTableBody' not found.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/plan/plans", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Failed to fetch plans");

        const plans = await response.json();
        displayPlans(plans);
    } catch (error) {
        console.error("Error fetching plans:", error);
        alert("Error fetching plans: " + error.message);
    }
});
    
function displayPlans(plans) {
    const planTableBody = document.getElementById("planTableBody");
    if (!planTableBody) return;

    planTableBody.innerHTML = ""; // Clear previous content

    plans.forEach(plan => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${plan._id}</td>
            <td>${plan.name}</td>
            <td>${plan.coverage}</td>
            <td>₹${plan.premium}</td>
            <td>${plan.duration} Year(s)</td>
            <td>
                <button onclick='openModal("${plan._id}")'>View Details</button>
            </td>
        `;
        planTableBody.appendChild(row);
    });
}

async function openModal(planId) {
    try {
        const response = await fetch(`http://localhost:5000/api/plan/plans/${planId}`);
        if (!response.ok) throw new Error("Failed to fetch plan details");

        const plan = await response.json();

        document.getElementById("modal_id").innerText = plan._id || "N/A";
        document.getElementById("modalPlanName").innerText = plan.name || "N/A";
        document.getElementById("modalCoverage").innerText = plan.coverage || "N/A";
        document.getElementById("modalPremium").innerText = plan.premium ? `₹${plan.premium}` : "N/A";
        document.getElementById("modalDuration").innerText = plan.duration ? `${plan.duration} Year(s)` : "N/A";
        document.getElementById("modalDetails").innerText = plan.details || "No additional details";

        document.getElementById("proceedToPayment").setAttribute("data-plan-id", plan._id);
        document.getElementById("planModal").style.display = "block";
    } catch (error) {
        console.error("Error fetching plan details:", error);
        alert("Error fetching plan details.");
    }
}

function closeModal() {
    document.getElementById("planModal").style.display = "none";
}

window.onclick = function (event) {
    const modal = document.getElementById("planModal");
    if (event.target === modal) {
        closeModal();
    }
};

function proceedToPayment() {
    const planId = document.getElementById("proceedToPayment").getAttribute("data-plan-id");
    if (!planId) {
        alert("Error: Plan ID not found.");
        return;
    }
    alert("Redirecting to Quote...");
    window.location.href = `get-quote.html?planId=${planId}`;
}

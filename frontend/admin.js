let editPolicyId = null; // To track the policy being edited

async function fetchPolicies() {
    try {
        const response = await fetch("http://localhost:5000/api/policies");
        
        const policies = await response.json();
        //console.alert("abc");
        const tableBody = document.getElementById("policyTableBody");
        tableBody.innerHTML = ""; // Clear existing data

        policies.forEach(policy => {
            const row = `
                <tr>
                    <td>${policy.fullName || "N/A"}</td>
                    <td>${policy.email || "N/A"}</td>
                    <td>${policy.phone || "N/A"}</td>
                    <td>${policy.vehicle || "N/A"}</td>
                    <td>${policy.policyNumber || "N/A"}</td>
                    <td>${policy.coverage || policy.policy_type}</td>
                    <td>${policy.finalQuote || policy.premium}</td>
                    <td>${new Date(policy.startDate || policy.start_date).toLocaleDateString()}</td>
                    <td>${new Date(policy.endDate || policy.end_date).toLocaleDateString()}</td>
                    <td>${policy.status || "Active"}</td>
                    <td>
                        <button onclick="editPolicy('${policy._id}', '${policy.fullName}','${policy.phone}','${policy.email}','${policy.coverage || policy.policy_type}', '${policy.finalQuote || policy.premium}', '${policy.startDate || policy.start_date}', '${policy.endDate || policy.end_date}', '${policy.status}')">✏️ Edit</button>
                        <button onclick="deletePolicy('${policy._id}')">🗑️ Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching policies:", error);
    }
}

window.onclick = function(event) {
    const modal = document.getElementById("editPlanModal");
    if (event.target === modal) {
        closeModal();
    }
};

function editPolicy(id,name,phone, email,type,finalQuote, startDate, endDate, status) {
    editPolicyId = id;
    document.getElementById("editname").value = name;
    document.getElementById("editPolicyType").value = type;
    document.getElementById("editmobilenumber").value = phone;
    document.getElementById("editemail").value = email;
    document.getElementById("editPremium").value = finalQuote;
    document.getElementById("editStartDate").value = startDate.split("T")[0];
    document.getElementById("editEndDate").value = endDate.split("T")[0];
    document.getElementById("editStatus").value = status;
    document.getElementById("editModal").style.display = "block";
}

async function savePolicyChanges() {
if (!editPolicyId) return;

const updatedPolicy = {
fullName: document.getElementById("editname").value,
phone: document.getElementById("editmobilenumber").value,
email: document.getElementById("editemail").value,
coverageType: document.getElementById("editPolicyType").value,
finalQuote: document.getElementById("editPremium").value,
startDate: document.getElementById("editStartDate").value,
endDate: document.getElementById("editEndDate").value,
status: document.getElementById("editStatus").value
};

try {
const response = await fetch(`http://localhost:5000/api/policies/${editPolicyId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedPolicy)
});

if (response.ok) {
    alert("Policy updated successfully!");
    document.getElementById("editModal").style.display = "none";
    closeModal();
    fetchPolicies();
} else {
    const errorData = await response.json();
    alert(`Failed to update policy: ${errorData.message}`);
}
} catch (error) {
console.error("Error updating policy:", error);
alert("An error occurred while updating the policy.");
}
}


async function deletePolicy(id) {
    if (!confirm("Are you sure you want to delete this policy?")) return;

    try {
        const response = await fetch(`http://localhost:5000/api/policies/${id}`, 
            { method: "DELETE" });

        if (response.ok) {
            alert("Policy deleted successfully!");
            fetchPolicies();
        } else {
            alert("Failed to delete policy.");
        }
    } catch (error) {
        console.error("Error deleting policy:", error);
    }
}

function closeModal() {
    document.getElementById("editModal").style.display = "none";
    editPolicyId = null;
}

document.addEventListener("DOMContentLoaded", fetchPolicies);


//Plan
// async function fetchPlans() {
//     try {
//         const response = await fetch("http://localhost:5000/api/plan/plans");
        
//         const plans = await response.json();
//         //console.alert("abc");
//         const tableBody = document.getElementById("planTableBody");
//         tableBody.innerHTML = ""; // Clear existing data

//         plans.forEach(plan => {
//             const row = `
//                 <tr>
//                     <td>${plan._id || "N/A"}</td>
//                     <td>${policy.name || "N/A"}</td>
//                     <td>${policy.premium || "N/A"}</td>
//                     <td>${policy.coverage || "N/A"}</td>
//                     <td>${policy.duration || policy.policy_type}</td>
//                     <td>${policy.finalQuote || policy.premium}</td>
//                     <td>${new Date(policy.startDate || policy.start_date).toLocaleDateString()}</td>
//                     <td>${new Date(policy.endDate || policy.end_date).toLocaleDateString()}</td>
//                     <td>${policy.status || "Active"}</td>
//                     <td>
//                         <button onclick="editPolicy('${policy._id}', '${policy.fullName}','${policy.phone}','${policy.email}','${policy.coverage || policy.policy_type}', '${policy.finalQuote || policy.premium}', '${policy.startDate || policy.start_date}', '${policy.endDate || policy.end_date}', '${policy.status}')">✏️ Edit</button>
//                         <button onclick="deletePolicy('${policy._id}')">🗑️ Delete</button>
//                     </td>
//                 </tr>
//             `;
//             tableBody.innerHTML += row;
//         });
//     } catch (error) {
//         console.error("Error fetching policies:", error);
//     }
// }

//Plan
async function fetchPlans() {
    try {
        const response = await fetch("http://localhost:5000/api/plan/plans" ,{
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        const plans = await response.json();
        
        const plansTable = document.getElementById("plansTable");
        plansTable.innerHTML = ""; // Clear previous data
        
        plans.forEach(plan => {
            const row = `<tr>
                <td>${plan._id}</td>
                <td>${plan.name}</td>
                <td>${plan.coverage}</td>
                <td>${plan.premium}</td>
                <td>${plan.duration} years</td>
                <td>
                    <button onclick=" openEditModal('${plan._id}')">Update</button>
                    <button onclick="deletePlan('${plan._id}')">Delete</button>
                </td>
            </tr>`;
            plansTable.innerHTML += row;
        });
    } catch (error) {
        console.error("Failed to fetch plans:", error);
    }
}



fetchPlans(); // Call function on page load

function editPlan(planId) {
    fetch(`http://localhost:5000/api/plan/plans/${planId}`)
        .then(res => res.json())
        .then(plan => {
            document.getElementById("planId").value = plan._id;
            document.getElementById("planName").value = plan.name;
            document.getElementById("planCoverage").value = plan.coverage;
            document.getElementById("planPremium").value = plan.premium;
            document.getElementById("planDuration").value = plan.duration;

            document.getElementById("editPlanForm").style.display = "block";
        })
        .catch(err => console.error("Error fetching plan:", err));
}

// Function to open the modal with existing plan data
function openEditModal(planId) {
    fetch(`http://localhost:5000/api/plan/plans/${planId}`)
    .then(res => res.json())
    .then(plan => {
        document.getElementById("planId").value = plan._id;
        document.getElementById("planName").value = plan.name;
        document.getElementById("planCoverage").value = plan.coverage;
        document.getElementById("planPremium").value = plan.premium;
        document.getElementById("planDuration").value = plan.duration;

        document.getElementById("editPlanModal").style.display = "block";
    })
    .catch(err => console.error("Error fetching plan:", err));
    
    
}

// Function to close the modal
function closeModall() {
    document.getElementById("editPlanModal").style.display = "none";
}

// Function to update the plan
async function updatePlan() {
    const planId = document.getElementById("planId").value;
    const updatedPlan = {
        name: document.getElementById("planName").value,
        coverage: document.getElementById("planCoverage").value,
        premium: document.getElementById("planPremium").value,
        duration: document.getElementById("planDuration").value
    };

    try {
        const response = await fetch(`http://localhost:5000/api/plan/plans/${planId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPlan)
        });

        if (!response.ok) throw new Error("Failed to update plan");

        alert("Plan updated successfully!");
        closeModall();
        fetchPlans(); // Refresh plans table

    } catch (error) {
        console.error("Error updating plan:", error);
    }
}

function updateePlan() {
    const planId = document.getElementById("planId").value;
     if (!planId) {
        console.error("Error: planId is undefined!");
        alert("Plan ID is missing. Cannot update.");
        return;
    }
    const updatedData = {
        name: document.getElementById("planName").value,
        coverage: document.getElementById("planCoverage").value,
        premium: document.getElementById("planPremium").value,
        duration: document.getElementById("planDuration").value
    };

    fetch(`http://localhost:5000/api/plan/plans/${planId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    })
    .then(res => res.json())
    .then(updatedPlan => {
        alert("Plan updated successfully!");
        document.getElementById("editPlanForm").style.display = "none";
        location.reload(); // Reload to show updated data
    })
    .catch(err => console.error("Error updating plan:", err));
}

async function updatPlan(planId, updatedData) {
    try {
        const response = await fetch(`http://localhost:5000/api/plan/plans/${planId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Plan updated successfully:", data);
        } else {
            console.error("Error updating plan:", data.message);
        }
    } catch (error) {
        console.error("Failed to update plan:", error);
    }
}

async function deletePlan(planId) {
    try {
        const response = await fetch(`http://localhost:5000/api/plan/plans/${planId}`, {
            method: "DELETE",
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Plan deleted:", data.message);
        } else {
            console.error("Error deleting plan:", data.message);
        }
    } catch (error) {
        console.error("Failed to delete plan:", error);
    }
}

async function fetchVehicles() {
    try {
        const response = await fetch("http://localhost:5000/api/vehicles", {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
            }
        });
        if (!response.ok) throw new Error("Failed to fetch vehicles");

        const data = await response.json();
        const vehiclesTable = document.getElementById("vehiclesTable");
        vehiclesTable.innerHTML = ""; // Clear table before appending

        data.forEach(vehicle => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${vehicle._id}</td>
                <td>${vehicle.model}</td>
                <td>${vehicle.plateNumber}</td>
                <td>${vehicle.year}</td>
                <td><button class="delete-btn" data-id="${vehicle._id}">Delete</button></td>
            `;

            vehiclesTable.appendChild(row);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async (event) => {
                const vehicleId = event.target.dataset.id;
                await deleteVehicle(vehicleId);
            });
        });

    } catch (error) {
        console.error("Error loading vehicles:", error);
    }
}

async function deleteVehicle(vehicleId) {
    try {
        const response = await fetch(`http://localhost:5000/api/vehicles/${vehicleId}`, {
            method: "DELETE",
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
            }
        });

        if (!response.ok) throw new Error("Failed to delete vehicle");

        alert("Vehicle deleted successfully!");
        fetchVehicles(); // Refresh the table after deletion
    } catch (error) {
        console.error("Error deleting vehicle:", error);
    }
}

    fetchVehicles();

async function deleteVehicle(vehicleId) {
    try {
        const response = await fetch(`http://localhost:5000/api/vehicles/${vehicleId}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Failed to delete vehicle");

        alert("Vehicle deleted successfully!");
        fetchVehicles(); // Refresh list after deletion
    } catch (error) {
        console.error("Error deleting vehicle:", error);
    }
}




//claim
document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Unauthorized! Please log in as Admin.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/claim", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Failed to fetch claims");

        const claims = await response.json();
        if (!Array.isArray(claims)) throw new Error("Invalid data format");

        displayClaims(claims);
    } catch (error) {
        console.error("Error fetching claims:", error);
        alert("Error fetching claims: " + error.message);
    }
});

function displayClaims(claims) {
    const tableBody = document.getElementById("claimTableBody");
    tableBody.innerHTML = "";

    claims.forEach(claim => {
        const row = document.createElement("tr");
        row.innerHTML = `
        
            <td>${claim._id}</td>
            <td>${claim.policy_id}</td>
            <td>${claim.claim_reason}</td>
            <td>₹${claim.claim_amount}</td>
            <td><a href="${claim.documents}" target="_blank">View</a></td>
            
            <td>
                <select onchange="updateClaimStatus('${claim._id}', this.value)">
                    <option value="Pending" ${claim.claim_status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Approved" ${claim.claim_status === "Approved" ? "selected" : ""}>Approved</option>
                    <option value="Rejected" ${claim.claim_status === "Rejected" ? "selected" : ""}>Rejected</option>
                </select>
            </td>
            <td>
                <button onclick="updateClaimStatus('${claim._id}', 'Approved')">Approve</button>
                <button onclick="updateClaimStatus('${claim._id}', 'Rejected')">Reject</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function updateClaimStatus(claimId, newStatus) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:5000/api/claim/admin/claims/${claimId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ claim_status: newStatus })
        });

        if (!response.ok) throw new Error("Failed to update claim status");
        alert("Claim status updated successfully!");
        location.reload();
    } catch (error) {
        console.error("Error updating claim:", error);
        alert("Error updating claim: " + error.message);
    }
}



function searchPolicies() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#policyTableBody tr");

    rows.forEach(row => {
        const name = row.querySelector("td:nth-child(1)").textContent.toLowerCase();
        const email = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
        const phone = row.querySelector("td:nth-child(3)").textContent.toLowerCase();
        const policyNumber = row.querySelector("td:nth-child(4)").textContent.toLowerCase();

        if (
            name.includes(searchValue) ||
            email.includes(searchValue) ||
            phone.includes(searchValue) ||
            policyNumber.includes(searchValue)
        ) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function filterPolicies() {
    const filterValue = document.getElementById("statusFilter").value;
    const rows = document.querySelectorAll("#policyTableBody tr");

    rows.forEach(row => {
        const status = row.querySelector("td:nth-child(9)").textContent.trim().toLowerCase();
        if (filterValue === "all" || status === filterValue) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function searchClaims() {
    const searchValue = document.getElementById("searchClaimInput").value.toLowerCase();
    const filterValue = document.getElementById("claimStatusFilter").value.toLowerCase();
    const rows = document.querySelectorAll("#claimTableBody tr");

    rows.forEach(row => {
        const claimID = row.querySelector("td:nth-child(1)").textContent.toLowerCase();
        const policyID = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
        const reason = row.querySelector("td:nth-child(3)").textContent.toLowerCase();
        const status = row.querySelector("td:nth-child(6)").textContent.toLowerCase();

        const matchesSearch =
            claimID.includes(searchValue) ||
            policyID.includes(searchValue) ||
            reason.includes(searchValue);

        const matchesFilter = filterValue === "all" || status === filterValue;

        if (matchesSearch && matchesFilter) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}


// Function to show sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}


document.getElementById("searchInputVehicle").addEventListener("keyup", function () {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll("#vehiclesTable tr");

    rows.forEach(row => {
        let text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
});
document.getElementById("searchInputplan").addEventListener("keyup", function () {
    let filter = this.value.toLowerCase();
    
    // Search in Plans Table
    document.querySelectorAll("#plansTable tr").forEach(row => {
        let text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
});

async function fetchDashboardstats() {
    try {
        const response = await fetch("http://localhost:5000/api/dashboard/stats");
        const data = await response.json();

        // Update dashboard stats
        document.getElementById("totalPolicies").textContent = data.totalPolicies;
        document.getElementById("activeClaims").textContent = data.activeClaims;
        document.getElementById("pendingPolicies").textContent = data.pendingPolicies;
        document.getElementById("totalVehicles").textContent = data.totalVehicles;
        document.getElementById("totalPlans").textContent = data.totalPlans;
        document.getElementById("totalPolicyAmount").textContent = data.totalPolicyAmount;
        document.getElementById("totalUsers").textContent = data.totalUsers;
        document.getElementById("totalAmountClaimed").textContent = data.totalAmountClaimed;

        // Initialize Chart.js
        renderChart(data);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
    }
}

// Function to Render Chart
function renderChart(data) {
    const ctx = document.getElementById("insuranceChart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Policies", "Claims", "Pending", "Vehicles", "Plans", "Users", "Claimed Amount"],
            datasets: [{
                label: "Insurance Overview",
                data: [
                    data.totalPolicies,
                    data.activeClaims,
                    data.pendingPolicies,
                    data.totalVehicles,
                    data.totalPlans,
                    data.totalUsers,
                    data.totalAmountClaimed
                ],
                backgroundColor: [
                    "blue", "red", "orange", "green", "purple", "cyan", "pink"
                ],
                borderColor: "black",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Load data on page load
fetchDashboardstats();

// document.getElementById("quoteForm").addEventListener("submit", function (e) {
//     e.preventDefault();

//     const vehicleType = document.getElementById("vehicleType").value;
//     const vehicleAge = parseInt(document.getElementById("vehicleAge").value);
//     const coverage = document.getElementById("coverage").value;

//     let basePrice = 0;

//     // Base price based on vehicle type
//     if (vehicleType === "car") basePrice = 500;
//     else if (vehicleType === "bike") basePrice = 300;
//     else if (vehicleType === "truck") basePrice = 700;

//     // Discount for newer vehicles
//     let ageFactor = vehicleAge < 3 ? 0.9 : 1.2; // 10% discount for new, 20% increase for old

//     // Coverage multiplier
//     let coverageFactor = coverage === "basic" ? 1 : coverage === "standard" ? 1.5 : 2;

//     // Final Quote Calculation
//     let finalQuote = basePrice * ageFactor * coverageFactor;

//     // Display Quote
//     document.getElementById("quoteResult").innerHTML = `
//         <h3>Estimated Quote: $${finalQuote.toFixed(2)}</h3>
//         <p>Based on your selections, this is an estimated price.</p>
//         <a href="register.html" class="btn-cta">Proceed to Buy</a>
//     `;
// });
// document.getElementById("quoteForm").addEventListener("submit", function (e) {
//     e.preventDefault();

//     const vehicleType = document.getElementById("vehicleType").value;
//     const vehicleAge = parseInt(document.getElementById("vehicleAge").value);
//     const coverage = document.getElementById("coverage").value;

//     let basePrice = 0;

//     // Base price based on vehicle type
//     if (vehicleType === "car") basePrice = 500;
//     else if (vehicleType === "bike") basePrice = 300;
//     else if (vehicleType === "truck") basePrice = 700;

//     // Discount for newer vehicles
//     let ageFactor = vehicleAge < 3 ? 0.9 : 1.2; // 10% discount for new, 20% increase for old

//     // Coverage multiplier
//     let coverageFactor = coverage === "basic" ? 1 : coverage === "standard" ? 1.5 : 2;

//     // Final Quote Calculation
//     let finalQuote = basePrice * ageFactor * coverageFactor;

//     // Display Quote
//     document.getElementById("quoteResult").innerHTML = `
//       <h3>Estimated Quote: $${finalQuote.toFixed(2)}</h3>
//       <p>Based on your selections, this is an estimated price.</p>
//       <a href="register.html" class="btn-cta">Proceed to Buy</a>
//     `;

//     // Prepare data to send to the backend
//     const quoteData = {
//       vehicleType,
//       vehicleAge,
//       coverage,
//       finalQuote
//     };

//     // Send quote data to the backend via POST request
//     fetch('http://localhost:5000/api/quote', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + localStorage.getItem('token') // If using JWT for authentication
//       },
//       body: JSON.stringify(quoteData)
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (data.message === "Quote submitted successfully") {
//         console.log('Quote data saved to backend:', data);
//       } else {
//         console.log('Error submitting quote:', data.message);
//       }
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
//   });

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://localhost:5000/api/vehicles/is-registered", {
            method: "GET",
            credentials: "include", // ✅ Send cookies with request
        });

        const data = await response.json();
        console.log("Vehicle Registration Check:", data);

        if (data.registered) {
           // document.getElementById("vehicleStatus").innerText = "✅ Vehicle Registered";

            //window.location.href = "plan.html";
        } else {
           // document.getElementById("vehicleStatus").innerText = "❌ No Registered Vehicle";
            window.location.href = "vehicle.html";
        }
    } catch (error) {
        console.error("Error checking vehicle:", error);
    }
});


document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
            method: "GET",
            credentials: "include", // Send cookies with request
        });

        if (response.ok) {
            const user = await response.json();
            console.log("Auth response:", user); // ✅ Log API response
            // Hide login/signup, show account/logout
            document.getElementById("signup").style.display = "none";
            document.getElementById("login").style.display = "none";
            document.getElementById("account").style.display = "inline";
            document.getElementById("logout").style.display = "inline";
        } else {
            // Show login/signup if user is NOT authenticated
            document.getElementById("signup").style.display = "inline";
            document.getElementById("login").style.display = "inline";
            document.getElementById("account").style.display = "none";
            document.getElementById("logout").style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
});

document.getElementById("quoteForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const vehicleType = document.getElementById("vehicleType").value;
  const vehicleAge = parseInt(document.getElementById("vehicleAge").value);
  const coverage = document.getElementById("coverage").value;
  const zipCode = document.getElementById("zipCode").value;

  
  //const name = document.getElementById("name").value;


  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  // Define base prices based on vehicle type
  const vehicleTypeFactor = { car: 1.0, bike: 0.8, truck: 1.5 };
  const coverageFactor = { basic: 1.2, standard: 1.5, premium: 2.0 };

  // High-risk ZIP codes (Example: Urban areas)
  const highRiskZipCodes = ["10001", "90001", "60601"];
  const locationFactor = highRiskZipCodes.includes(zipCode) ? 1.1 : 1.0;

  // Calculate quote
  const basePrice = vehicleTypeFactor[vehicleType] * 1000;
  const ageFactor = 1 + (vehicleAge * 0.05);
  const finalQuote = basePrice * ageFactor * coverageFactor[coverage] * locationFactor;

  // Store quote data in localStorage
  const quoteData = {
      vehicleType, vehicleAge, coverage, zipCode, finalQuote,phone,email
  };
  localStorage.setItem("quoteData", JSON.stringify(quoteData));

  // Display Quote
  // document.getElementById("quoteResult").innerHTML = `
  //     <h3>Estimated Quote: $${finalQuote.toFixed(2)}</h3>
  //     <p>Based on your selections, this is an estimated price.</p>
  //     <a href="buy-policy.html" class="btn-cta">Proceed to Buy</a>
  // `;
});

async function loadPlateNumbers() {
    try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

        const response = await fetch("http://localhost:5000/api/vehicles/plate-numbers", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();

        const dropdown = document.getElementById("plateDropdown");

        data.forEach(vehicle => {
            const option = document.createElement("option");
            option.value = vehicle.plateNumber;
            option.textContent = vehicle.plateNumber;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching plate numbers:", error);
    }
}


 

async function fetchVehicleDetails() {
    const plateNumber = document.getElementById("plateDropdown").value;
    if (!plateNumber) return;

    try {
        const response = await fetch(`http://localhost:5000/api/vehicles/details/${plateNumber}`);
        const data = await response.json();

        if (data.error) {
          //  document.getElementById("vehicleDetails").innerHTML = `<p style="color: red;">${data.error}</p>`;
            return;
        }

       // document.getElementById("vehicleType").value = data.vehicle;
        document.getElementById("makeModel").value = data.model;
        document.getElementById("vehicleYear").value = data.year;
        if (data.year) {
            calculateVehicleAge(data.year);
        } else {
            document.getElementById("vehicleAge").value = "";
        }

    } catch (error) {
        console.error("Error fetching vehicle details:", error);
    }
}

function calculateVehicleAge(vehicleYear) {
    const currentYear = new Date().getFullYear();
    const ageField = document.getElementById("vehicleAge");

    vehicleYear = parseInt(vehicleYear); // Ensure it's a number

    if (!isNaN(vehicleYear) && vehicleYear >= 1900 && vehicleYear <= currentYear) {
        ageField.value = `${currentYear - vehicleYear} years`;
    } else {
        ageField.value = "Invalid Year"; // Show error if year is incorrect
    }
}





document.addEventListener("DOMContentLoaded", loadPlateNumbers);

document.getElementById("quoteForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  // Get user input values
  const vehicleType = document.getElementById("vehicleType").value;
  const vehicleAge = parseInt(document.getElementById("vehicleAge").value);
  const coverageType = document.getElementById("coverage").value;
  const zipCode = document.getElementById("zipCode").value;
  const plate = document.getElementById("plateDropdown").value;
  const planid = document.getElementById("planIdText").value;
  

  // Define base prices based on vehicle type
  const vehicleTypeFactor = {
      car: 500,
      bike: 300,
      truck: 700
  };

  // Define coverage multipliers
  const coverageFactor = {
      basic: 1.2,
      standard: 1.5,
      premium: 2.0
  };

  // High-risk ZIP codes (Example: Urban areas)
  const highRiskZipCodes = ["10001", "90001", "60601"];
  const locationFactor = highRiskZipCodes.includes(zipCode) ? 1.1 : 1.0;

  // Calculate vehicle age factor (Discount for newer vehicles)
  const ageFactor = vehicleAge < 3 ? 0.9 : 1.2;

  // Calculate final insurance quote
  const basePrice = vehicleTypeFactor[vehicleType];
  const finalQuote = basePrice * ageFactor * coverageFactor[coverageType] * locationFactor;

  // Display the quote result
  const quoteBox = document.getElementById("quoteResult");
  quoteBox.innerHTML = `
    <div class="quote-box">
        <h3>Estimated Quote</h3>
        <p class="quote-amount">$${finalQuote.toFixed(2)}</p>
        <p class="quote-message">Based on your selections, this is an estimated price.</p>
        <a href="newoption.html" class="btn-cta">Proceed to Buy</a>
    </div>
  `;
  quoteBox.classList.remove("hidden");

  // Smooth fade-in effect
  setTimeout(() => {
      quoteBox.querySelector(".quote-box").classList.add("show");
  }, 100);

  // Prepare data to send to the backend
  const quoteData = {
      vehicleType,
      vehicleAge,
      coverageType,
      zipCode,
      plate,
      planid,
      finalQuote
  };

  // Send quote data to the backend via POST request
  fetch('http://localhost:5000/api/quote', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token') // If using JWT for authentication
      },
      body: JSON.stringify(quoteData)
  })
  .then(response => response.json())
  .then(data => {
      if (data.message === "Quote submitted successfully") {
          console.log('Quote data saved to backend:', data);
      } else {
          console.error('Error submitting quote:', data.message);
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
});

// Recalculate Button to Hide Quote Box
document.getElementById("recalculateBtn").addEventListener("click", function () {
  document.getElementById("quoteResult").classList.add("hidden");
});

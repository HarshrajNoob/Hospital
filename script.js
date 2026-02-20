let lastFiveDurations = [];

const modal = document.getElementById("appointmentModal");
const openBtn = document.querySelector(".btn-shop");
const closeBtn = document.getElementById("closeModal");

function updateOccupancyChart() {

  const beds = document.querySelectorAll(".bed-item");
  const totalBeds = beds.length;

  const occupiedBeds = document.querySelectorAll(
    ".bed-item.status-1, .bed-item.status-2, .bed-item.status-3"
  ).length;

  const percentage = Math.round((occupiedBeds / totalBeds) * 100);

  const chart = document.getElementById("occupancyChart");
  const text = document.getElementById("occupancyText");

  chart.style.background = 
    `conic-gradient(#0c6cf2 ${percentage}%, #e5e5e5 ${percentage}%)`;

  text.textContent = `${percentage}%`;
}


openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});



const form = document.getElementById("appointmentForm");
const queueTable = document.querySelector(".clinical-table tbody");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("patientName").value;
  const department = document.getElementById("department").value;

  const availableBed = document.querySelector(".bed-item.status-0");

  if (!availableBed) {
    alert("No beds available!");
    return;
  }

  const bedNumber = availableBed.dataset.bed;

  // Update bed visually
  availableBed.classList.remove("status-0");
  availableBed.classList.add("status-1");
  availableBed.querySelector(".bed-state-text").textContent = "Booked";

  // Add patient to queue table
  const newRow = document.createElement("tr");

  const arrivalTime = Date.now();

  newRow.innerHTML = `
    <td><span class="badge b-blue">${bedNumber}</span></td>
    <td>${name}</td>
    <td>${department}</td>
    <td>
      <button class="btn-table end-session">End Session</button>
    </td>
  `;

  newRow.dataset.bed = bedNumber;
  newRow.dataset.arrival = arrivalTime;

  updateOccupancyChart();

  queueTable.appendChild(newRow);

// Attach End Session listener HERE
newRow.querySelector(".end-session").addEventListener("click", function() {

  const currentRow = this.closest("tr");
  const bedNumber = currentRow.dataset.bed;

  const bed = document.querySelector(`[data-bed="${bedNumber}"]`);

  // Free bed
  bed.classList.remove("status-1");
  bed.classList.add("status-0");
  bed.querySelector(".bed-state-text").textContent = "Available";

  updateOccupancyChart();

  // Calculate consultation time
  const arrival = parseInt(currentRow.dataset.arrival);
  const endTime = Date.now();
  const consultationTime = Math.floor((endTime - arrival) / 1000);

  console.log("Consultation Time:", consultationTime, "seconds");

  // Store duration
  lastFiveDurations.push(consultationTime);

  if (lastFiveDurations.length > 5) {
    lastFiveDurations.shift();
  }

  const total = lastFiveDurations.reduce((sum, time) => sum + time, 0);
  const averageSeconds = Math.floor(total / lastFiveDurations.length);
  const averageMinutes = Math.ceil(averageSeconds / 60);

  document.getElementById("er-Time").textContent = `${averageMinutes}m`;

  // Remove patient row safely
  currentRow.remove();
});

  form.reset();
  modal.style.display = "none";
});




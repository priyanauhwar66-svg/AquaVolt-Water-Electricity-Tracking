
document.addEventListener("DOMContentLoaded", async () => {
    if (!requireLogin()) return;

    const canvas = document.getElementById("usageChart");

    try {
        const d = await apiRequest("/water-usage");
        const rows = d.records || [];

        // Calculate total consumption
        const totalWater = rows.reduce(
            (sum, r) => sum + Number(r.quantity || 0), 0
        );

        const totalElectricity = rows.reduce(
            (sum, r) => sum + Number(r.electricityQuantity || 0), 0
        );

        // Display consumption summaries
        const summary = document.createElement("div");

        summary.innerHTML = `
            <div style="display:flex; gap:20px; flex-wrap:wrap; margin-bottom:20px;">
                <div class="panel">
                    <h3>Total Water Consumption</h3>
                    <h2>${totalWater.toFixed(2)} Litres</h2>
                </div>

                <div class="panel">
                    <h3>Total Electricity Consumption</h3>
                    <h2>${totalElectricity.toFixed(2)} kWh</h2>
                </div>
            </div>
        `;

        canvas.parentElement.insertBefore(summary, canvas);

        if (typeof Chart === "undefined") {
            canvas.insertAdjacentHTML(
                "afterend",
                "<p>Chart library unavailable. Please check your internet connection.</p>"
            );
            return;
        }

        // Water consumption by category
        const waterTotals = {};

        rows.forEach(r => {
            if (Number(r.quantity || 0) > 0) {
                const category = r.category || "Other";
                waterTotals[category] =
                    (waterTotals[category] || 0) + Number(r.quantity || 0);
            }
        });

        // Electricity consumption by category
        const electricityTotals = {};

        rows.forEach(r => {
            if (Number(r.electricityQuantity || 0) > 0) {
                const category = r.category || "Other";
                electricityTotals[category] =
                    (electricityTotals[category] || 0) +
                    Number(r.electricityQuantity || 0);
            }
        });

        // Water chart
        new Chart(canvas, {
            type: "bar",
            data: {
                labels: Object.keys(waterTotals),
                datasets: [{
                    label: "Water Usage (Litres)",
                    data: Object.values(waterTotals),
                    backgroundColor: "#00BCD4"
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "top" },
                    title: {
                        display: true,
                        text: "Water Consumption by Category"
                    }
                }
            }
        });

        // Create a separate electricity chart
        const electricityCanvas = document.createElement("canvas");
        electricityCanvas.id = "electricityChart";

        canvas.parentElement.appendChild(electricityCanvas);

        new Chart(electricityCanvas, {
            type: "bar",
            data: {
                labels: Object.keys(electricityTotals),
                datasets: [{
                    label: "Electricity Usage (kWh)",
                    data: Object.values(electricityTotals),
                    backgroundColor: "#FFB74D"
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "top" },
                    title: {
                        display: true,
                        text: "Electricity Consumption by Category"
                    }
                }
            }
        });

    } catch (e) {
        canvas.insertAdjacentHTML("afterend", `<p>${e.message}</p>`);
    }
});

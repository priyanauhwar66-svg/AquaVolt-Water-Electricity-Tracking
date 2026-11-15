
document.addEventListener("DOMContentLoaded", async () => {

    if (!requireLogin()) return;

    const user = getCurrentUser();

    document.getElementById("welcomeName").textContent =
        user?.name || "User";

    const waterEl = document.getElementById("waterTotal");
    const electricityEl = document.getElementById("electricityTotal");
    const billEl = document.getElementById("billTotal");
    const tbody = document.getElementById("recentRows");

    try {

        const d = await apiRequest("/water-usage");
        const rows = d.records || [];

        // Calculate total water consumption
        const totalWater = rows.reduce(
            (sum, r) => sum + Number(r.quantity || 0), 0
        );

        // Calculate total electricity consumption
        const totalElectricity = rows.reduce(
            (sum, r) => sum + Number(r.electricityQuantity || 0), 0
        );

        // Calculate estimated bills
        const waterCost = totalWater * 0.05;
        const electricityCost = totalElectricity * 7;
        const totalBill = waterCost + electricityCost;

        // Update dashboard cards
        waterEl.textContent =
            totalWater.toLocaleString() + " L";

        electricityEl.textContent =
            totalElectricity.toLocaleString() + " kWh";

        billEl.textContent =
            "₹" + totalBill.toFixed(2);

        // Update recent usage table
        if (tbody) {

            const header = tbody.closest("table")?.querySelector("thead tr");

            if (header) {
                header.innerHTML = `
                    <th>Date</th>
                    <th>Water</th>
                    <th>Electricity</th>
                    <th>Category</th>
                    <th>Water Cost</th>
                `;
            }

            tbody.innerHTML = rows.slice(0, 5).map(r => `
                <tr>
                    <td>${new Date(r.date).toLocaleDateString()}</td>
                    <td>${Number(r.quantity || 0)} L</td>
                    <td>${Number(r.electricityQuantity || 0)} kWh</td>
                    <td>${r.category || "Electricity"}</td>
                    <td>₹${(Number(r.quantity || 0) * 0.05).toFixed(2)}</td>
                </tr>
            `).join("") || `
                <tr>
                    <td colspan="5" class="empty">
                        No usage added yet.
                    </td>
                </tr>
            `;
        }

    } catch (e) {

        waterEl.textContent = "Unavailable";
        electricityEl.textContent = "Unavailable";
        billEl.textContent = "—";

        alert(e.message);
    }
});

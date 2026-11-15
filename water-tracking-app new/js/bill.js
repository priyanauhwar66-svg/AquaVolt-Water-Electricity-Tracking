
async function calculateBill() {
    const water = Number(document.getElementById("water").value);
    const electricity = Number(document.getElementById("electricity").value);
    const electricityRate = Number(document.getElementById("electricityRate").value);

    if (
        !Number.isFinite(water) || water < 0 ||
        !Number.isFinite(electricity) || electricity < 0 ||
        !Number.isFinite(electricityRate) || electricityRate < 0
    ) {
        alert("Please enter valid non-negative quantities and rates.");
        return;
    }

    const waterCost = water * 0.05;
    const electricityCost = electricity * electricityRate;
    const totalCost = waterCost + electricityCost;

    document.getElementById("waterBill").textContent =
        "₹" + waterCost.toFixed(2);

    document.getElementById("electricityBill").textContent =
        "₹" + electricityCost.toFixed(2);

    document.getElementById("bill").textContent =
        "₹" + totalCost.toFixed(2);
}

async function loadTotal() {
    try {
        if (!requireLogin()) return;

        const d = await apiRequest("/water-usage");
        const records = d.records || [];

        const totalWater = records.reduce(
            (sum, r) => sum + Number(r.quantity || 0), 0
        );

        const totalElectricity = records.reduce(
            (sum, r) => sum + Number(r.electricityQuantity || 0), 0
        );

        document.getElementById("water").value = totalWater.toFixed(2);
        document.getElementById("electricity").value =
            totalElectricity.toFixed(2);

        calculateBill();

    } catch (e) {
        alert(e.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (!requireLogin()) return;
});

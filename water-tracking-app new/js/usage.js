
document.addEventListener("DOMContentLoaded", () => {
    if (!requireLogin()) return;

    const form = document.getElementById("usageForm");
    const date = document.getElementById("usageDate");
    const msg = document.getElementById("usageMessage");

    date.value = new Date().toISOString().slice(0, 10);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const waterInput = document.getElementById("waterUsage");
            const electricityInput = document.getElementById("electricityUsage");

            await apiRequest("/water-usage", {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({
                    category: document.getElementById("category").value,
                    quantity: Number(waterInput.value || 0),
                    electricityQuantity: Number(electricityInput?.value || 0),
                    date: date.value,
                    notes: document.getElementById("notes").value.trim()
                })
            });

            showMessage(msg, "Water and electricity usage saved successfully!");

            form.reset();
            date.value = new Date().toISOString().slice(0, 10);

        } catch (err) {
            showMessage(msg, err.message, true);
        }
    });
});

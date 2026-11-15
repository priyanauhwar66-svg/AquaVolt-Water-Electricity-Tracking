
document.addEventListener("DOMContentLoaded", async () => {
    if (!requireLogin()) return;

    const tbody = document.getElementById("historyRows");
    const table = tbody.closest("table");
    const head = table?.querySelector("thead tr");

    if (head) {
        head.innerHTML = `
            <th>Date</th>
            <th>Category</th>
            <th>Water</th>
            <th>Electricity</th>
            <th>Estimated Water Cost</th>
            <th>Action</th>
        `;
    }

    async function render() {
        try {
            const d = await apiRequest("/water-usage");
            const rows = d.records || [];

            tbody.innerHTML = rows.map(r => `
                <tr>
                    <td>${new Date(r.date).toLocaleDateString()}</td>
                    <td>${r.category || "Electricity"}</td>
                    <td>${Number(r.quantity || 0)} L</td>
                    <td>${Number(r.electricityQuantity || 0)} kWh</td>
                    <td>₹${(Number(r.quantity || 0) * 0.05).toFixed(2)}</td>
                    <td>
                        <button class="btn btn-small" data-delete="${r._id}">
                            Delete
                        </button>
                    </td>
                </tr>
            `).join("") || `
                <tr>
                    <td colspan="6" class="empty">No records available.</td>
                </tr>
            `;

        } catch (e) {
            tbody.innerHTML = `
                <tr><td colspan="6">${e.message}</td></tr>
            `;
        }
    }

    tbody.addEventListener("click", async e => {
        const id = e.target.dataset.delete;

        if (!id) return;

        if (!confirm("Delete this usage record?")) return;

        try {
            await apiRequest(`/water-usage/${id}`, {
                method: "DELETE",
                headers: authHeaders()
            });

            await render();

        } catch (err) {
            alert(err.message);
        }
    });

    await render();
});

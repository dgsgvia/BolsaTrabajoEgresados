// reset-password.js
const form = document.getElementById("formReset");

// Captura token desde URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;

    try {
        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.mensaje || "Contraseña actualizada correctamente");
            form.reset();
            window.location.href = "/login.html"; // Redirige al login
        } else {
            alert(data.error || "Ocurrió un error al actualizar la contraseña");
        }
    } catch (err) {
        console.error("Error al cambiar contraseña:", err);
        alert("Ocurrió un error. Intenta nuevamente.");
    }
});
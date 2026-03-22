// Inicializa EmailJS con tu Public Key
emailjs.init("OcaVvEmNpB8CbFkDE");

const form = document.getElementById("formRecuperar");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    try {
        // Llamada al backend para generar token
        const res = await fetch("/api/auth/recuperar-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (res.ok) {
            // Construye link de recuperación con el token que imprime el backend en consola
            // (Si quieres puedes enviarlo directamente desde el backend, pero con EmailJS lo hacemos en frontend)
            const token = data.token; // Modifica tu backend si quieres devolver token
            const link = `https://bolsatrabajoegresados-production.up.railway.app/reset-password.html?token=${token}`;

            // Envía correo usando EmailJS
            await emailjs.send("service_wa1l6so", "template_0v6xbp7", {
                nombre: "Usuario",
                link: link
            });

            alert("Se ha enviado el correo de recuperación correctamente.");
            form.reset();
        } else {
            alert(data.error || data.mensaje);
        }
    } catch (err) {
        console.error("Error enviando correo:", err);
        alert("Ocurrió un error. Intenta nuevamente.");
    }
});
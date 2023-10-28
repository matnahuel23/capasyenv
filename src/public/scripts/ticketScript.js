document.getElementById("payButton").addEventListener("click", async (event) => {
    event.preventDefault();
    const phone = document.getElementById("phone").value;

    try {
        const response = await fetch(`/carts/{{cart}}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone })
        });
        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: "La compra se realizó con éxito",
            }).then(() => {
                window.location.href = "/";
            });
        } else {
            const errorMessage = await response.text();
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage || "Hubo un problema al realizar la compra",
            });
        }
    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error en la solicitud",
        });
    }
});

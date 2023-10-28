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
            // La compra se realizó con éxito
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: "La compra se realizó con éxito",
            }).then(() => {
              window.location.href = "/";
          });
        } else {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al realizar la compra",
            }).then(() => {
              window.location.href = "/";
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
$(document).ready(function () {
    $('#customFile').on('change', function () {
        var fileName = $(this).val().split('\\').pop();
        $(this).next('.custom-file-label').html(fileName);
    });

    // Capturar el evento de envío del formulario
    $('#documentForm').submit(function (event) {
        // Obtener el valor seleccionado del radio
        var fileType = $('input[name="fileType"]:checked').val();
        // Agregar un campo oculto al formulario para enviar el fileType al servidor
        $('#fileTypeName').val(fileType);
        return true; // Continuar con el envío del formulario
    });
});

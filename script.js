let docGlobal = null;

document.getElementById('btnPreview').addEventListener('click', gerarPreview);
document.getElementById('btnDownload').addEventListener('click', baixarPDF);

function gerarPreview() {
    const nomePet = document.getElementById('nomePet').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const nomeDono = document.getElementById('nomeDono').value.trim();

    if (!nomePet || !telefone || !nomeDono || !endereco) {
        alert('Por favor, preencha nome do pet, telefone, nome do dono e endereço!');
        return;
    }

    const qrContainer = document.getElementById('qrCode');
    qrContainer.innerHTML = '';

    const qr = new QRCode(qrContainer, {
        text: `https://maps.google.com/?q=${encodeURIComponent(endereco)}`,
        width: 128,
        height: 128
    });

    setTimeout(() => {
        const canvas = qrContainer.querySelector('canvas');
        if (!canvas) {
            alert('Erro ao gerar QR Code');
            return;
        }

        const imgQRCode = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;

        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: [80, 25]
        });

        doc.setFillColor(224, 247, 255);
        doc.roundedRect(1, 1, 78, 23, 3, 3, 'F');

        doc.addImage(imgQRCode, 'PNG', 62, 5, 15, 15);
        doc.addImage(logoBase64, 'PNG', 2, 2, 10, 5);

        doc.setFontSize(11);
        doc.setTextColor(0, 63, 92);
        doc.text(`Pet: ${nomePet}`, 15, 10);
        doc.text(`Phone: ${telefone}`, 15, 16);
        doc.text(`Nome do Dono: ${nomeDono}`, 15, 22);

        doc.setFontSize(5);
        doc.setTextColor(120);
        doc.text('Escaneie para localização', 57, 23);

        docGlobal = doc;
        const pdfUri = doc.output('datauristring');
        document.getElementById('pdfPreview').src = pdfUri;

        document.getElementById('btnDownload').disabled = false;
    }, 500);
}

function baixarPDF() {
    if (!docGlobal) {
        alert('Por favor, gere o preview primeiro!');
        return;
    }

    const nomePet = document.getElementById('nomePet').value.trim();
    docGlobal.save(`${nomePet}_coleira.pdf`);
}

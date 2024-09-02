// app.js
async function setup() {
    // Carregar o modelo de detecção de rosto
    const model = await blazeface.load();
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Configurar a câmera
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });
    video.srcObject = stream;

    video.onloadedmetadata = () => {
        video.play();
        detectFaces();
    };

    async function detectFaces() {
        // Detectar rostos
        const predictions = await model.estimateFaces(video, false);

        // Limpar o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenhar caixas ao redor dos rostos detectados
        predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.topLeft.concat(prediction.bottomRight).map(coord => coord.toFixed(0));

            ctx.beginPath();
            ctx.rect(x, y, width - x, height - y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'red';
            ctx.stroke();
        });

        requestAnimationFrame(detectFaces);
    }
}

setup();

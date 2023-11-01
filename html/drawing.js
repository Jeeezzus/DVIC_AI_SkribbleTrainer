const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Initialisation du canvas
ctx.fillStyle = '#000'; // Définir la couleur initiale sur le blanc
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Gestion du dessin avec la souris sur le canvas
let isDrawing = false;

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath(); 
}

function draw(e) {
    if (!isDrawing) return;

    ctx.lineWidth = 4; 
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#FFF'; 

    // Obtenir la position de l'utilisateur, que ce soit une souris sur un ordinateur portable ou un doigt sur un appareil mobile
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Dessiner la ligne aux coordonnées cibles
    ctx.lineTo(clientX - canvas.offsetLeft, clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(clientX - canvas.offsetLeft, clientY - canvas.offsetTop);
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', draw);

canvas.addEventListener('touchstart', function (e) {e.preventDefault();});
canvas.addEventListener('touchmove', function (e) {e.preventDefault();});

function resetCanvas() {
    ctx.fillStyle = '#000'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.resetCanvas = resetCanvas;
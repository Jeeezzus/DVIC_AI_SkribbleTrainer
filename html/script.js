const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const displaysuccess = document.getElementById('displaysuccess');
let model;

// Liste des classes possibles
const classes = ['porte-avions', 'enclume', 'baignoire', 'papillon', 'voiture', 'porte', 'lunettes', 'fleur', 'guitare', 'marteau', 'glace', 'clé', 'ampoule', 'lune', 'poulpe', 'pantalon', 'voilier', 'télévision', 'sous-vêtements', 'baleine'];




// Charger le modèle en tant que fonction asynchrone pour s'assurer qu'aucune autre action n'est activée avant la fin du chargement
async function loadModel() {
    console.log("Chargement du modèle en cours...");
    model = new onnx.InferenceSession({ backendHint: 'webgl' });
    await model.loadModel('model3.onnx');
    console.log("Modèle chargé avec succès !");
}

loadModel();

async function recognizeDrawing() {
    try {
        let predictedClassIndex = await predict();
        let predictedClassName = classes[predictedClassIndex];

        if (predictedClassName === classToDraw) {
            displaysuccess.textContent = "Gagné ! Vous avez dessiné un(e) " + predictedClassName;
        } else {
            displaysuccess.textContent = "Réessayez ! Vous avez dessiné un(e) " + predictedClassName + " mais la cible était " + classToDraw;
        }
    } catch (error) {
        console.error("Erreur lors de la prédiction :", error);
    }
}

function resetGame() {
    classToDraw = getRandomClass();
    document.querySelector('h1').textContent = `Dessinez : ${classToDraw}`;
    resetCanvas();
}

function getRandomClass() {
    const randomIndex = Math.floor(Math.random() * classes.length);
    return classes[randomIndex];
}

let classToDraw = getRandomClass();
document.querySelector('h1').textContent = `Dessinez : ${classToDraw}`;

async function predict() {
    // Crée un autre canvas qui redimensionne celui affiché à l'écran
    let tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = 28;
    tmpCanvas.height = 28;
    let tmpCtx = tmpCanvas.getContext('2d');
    tmpCtx.drawImage(canvas, 0, 0, 28, 28);
  
    // Crée une bordure grise autour de la ligne dessinée par l'utilisateur, car dans l'ensemble de données utilisé pour entraîner le modèle, il était en niveaux de gris et non en noir ou blanc
    let NOT_ZERO_NUMB = 0;
    let pix_num = 0;
    let imgData = tmpCtx.getImageData(0, 0, 28, 28).data;
    for (let i = 0; i < imgData.length; i += 1) {
        if (imgData[i] != 0) {
            NOT_ZERO_NUMB += 1;
        }
        pix_num += 1;
    }
    let input = new Float32Array(28 * 28);
    for (let i = 0; i < imgData.length; i += 4) {
        let grayscale = 0;
        if (imgData[i] != 0)  { grayscale = 255; }
        if (imgData[i + 1] != 0)  { grayscale = 255; }
        if (imgData[i + 2] != 0)  { grayscale = 255; }
        grayscale = (((grayscale / 255)) - 0.1736) / 0.3317;
        input[i / 4] = grayscale;
    }
    // Arrondir tous les nombres flottants inférieurs à 1 à 0 pour éviter les problèmes lors du calcul
    for (let i = 0; i < input.length; i += 1) {
        if (input[i] < 1) {
            input[i] = 0;
        }
    }
  
    // Exécution du modèle
    let TensorInput = new onnx.Tensor(input, 'float32', [1, 1, 28, 28]);
    let outputMap = await model.run([TensorInput]);
    let outputData = outputMap.values().next().value.data;
    let predictedClassIndex = outputData.indexOf(Math.max(...outputData));
    
    let adjustedClassIndex = predictedClassIndex;
    if (adjustedClassIndex < 0) {
        adjustedClassIndex += classes.length;
    }

    // Affiche le nom de la classe prédite
    return adjustedClassIndex;
}

// GLOBAL VARIABLES
const seesaw = document.getElementById('seesaw-input');
const plank = document.getElementById('seesaw-plank');
const nextWeightDisplay = document.getElementById('next-weight');
const leftWeightDisplay = document.getElementById('left-weight');
const rightWeightDisplay = document.getElementById('right-weight');
const tiltAngleDisplay = document.getElementById('tilt-angle');
const log = document.getElementById("log");
const weightPreview = document.getElementById("weight-preview");
document.getElementById("reset-button").addEventListener("click", reset);

const PLANK_BASE_BOTTOM = 145; // 500px seesaw height / 4 because seesawplank is 25% of seesaw height + 20px seesaw plank height
const PIVOT_X = seesaw.offsetWidth / 2;
const PIVOT_Y = PLANK_BASE_BOTTOM + 10; // 10px is half of seesaw plank height
const MAX_PLANK_ANGLE = 30;
const WEIGHT_COLORS = ['#EFE9E3', '#D9CFC7']

let plankAngle = 0;
let nextWeight = Math.floor(Math.random() * 10) + 1;
let nextColor = '#EFE9E3';
let leftWeight = 0;
let rightWeight = 0;

let weights = [];

let leftTorque = 0;
let rightTorque = 0;


// EVENT LISTENERS
seesaw.addEventListener('click', function(event) {
    weightPreview.style.display = 'none';

    const rect = seesaw.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const weightX = clickX - 15;

    updateTorque(clickX, nextWeight);
    
    updatePlankAngle();
    
    const obj = document.createElement('div');
    const size = 30 + nextWeight * 4;
    obj.style.width = `${size}px`;
    obj.style.height = `${size}px`;
    obj.classList.add('weight');
    obj.style.left = `${weightX}px`;
    obj.style.bottom = '500px';
    obj.style.background = nextColor;
    obj.textContent =`${nextWeight} KG`;

    weights.push({
            element: obj,
            weight: nextWeight,
            x: weightX,
            color: nextColor
        });

    setTimeout(() => {
        obj.style.bottom = `${PLANK_BASE_BOTTOM}px`;
        updateWeightsPos();
        updateDisplays(clickX);
    }, 10);
    
    seesaw.appendChild(obj);

    addLog(nextWeight, clickX);
    updateWeightColor();
    saveState();
});

seesaw.addEventListener('mousemove', function(event) {
    const rect = seesaw.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const previewX = mouseX - 15;
    const size = 30 + nextWeight * 4;
    weightPreview.style.width = `${size}px`;
    weightPreview.style.height = `${size}px`;
    weightPreview.textContent =`${nextWeight} KG`;
    weightPreview.style.background = nextColor;
    weightPreview.style.left = `${previewX}px`;
    weightPreview.style.bottom = `${PLANK_BASE_BOTTOM + 200}px`;
    weightPreview.style.display = 'flex';
});

seesaw.addEventListener('mouseleave', function(event) {
    weightPreview.style.display = 'none';
});


// HELPER FUNCTIONS
function updateTorque(clickX, weight) {
    if (clickX < PIVOT_X) { // left side
        leftTorque += (PIVOT_X - clickX) * weight;
    } else { // right side
        rightTorque += (clickX - PIVOT_X) * weight;
    }
}

function updatePlankAngle() {
    plankAngle = Math.max(-MAX_PLANK_ANGLE,Math.min(MAX_PLANK_ANGLE, (rightTorque - leftTorque) / 100));
    plank.style.transform = `rotate(${plankAngle}deg)`;
}

function updateWeightsPos() {
    const plankAngleRad = plankAngle * (Math.PI / 180);
    weights.forEach(w => {
        const dx = w.x - PIVOT_X;
        const newY = PLANK_BASE_BOTTOM - dx * Math.tan(plankAngleRad);
        w.element.style.bottom = `${newY}px`;
    });
}

/*  function updateWeightsPos() { //DID NOT WORK
    const plankAngleRad = plankAngle * (Math.PI / 180);

    weights.forEach(w => {
        // calculate new x
        const dx = (w.x - PIVOT_X) * Math.sin(plankAngleRad) * Math.sin(plankAngleRad);

        // calculate new y
        const dy = (w.x - PIVOT_X) * Math.sin(plankAngleRad) * - Math.cos(plankAngleRad);
        w.element.style.bottom = `${w.y + dy}px`;

    });
}  */

function updateNextWeight() {
    nextWeight = Math.floor(Math.random() * 10) + 1;
}

function updateDisplays(clickX) {
    if (clickX === undefined) {
        leftWeight = 0;
        rightWeight = 0;
    }
    else{
        if (clickX < PIVOT_X) {
            leftWeight += nextWeight;
        } else if (clickX > PIVOT_X) {
            rightWeight += nextWeight;
        }
    }
    
    leftWeightDisplay.textContent = `${leftWeight} KG`;
    rightWeightDisplay.textContent = `${rightWeight} KG`;

    updateNextWeight();
    nextWeightDisplay.textContent = `${nextWeight} KG`;;

    tiltAngleDisplay.textContent = plankAngle.toFixed(2) + '°';
}

function addLog(weight, clickX) {
    const entry = document.createElement("div");

    const side = (clickX < PIVOT_X) ? 'LEFT' : 'RIGHT';
    const distance = Math.abs(clickX - PIVOT_X);

    entry.textContent = `Added ${weight} KG to ${side} side at distance ${distance.toFixed(2)} px.`;
    entry.classList.add("log-content");
    log.prepend(entry);
}

function reset() {
    weights.forEach(w => {
        seesaw.removeChild(w.element);
    });
    weights = [];

    leftTorque = 0;
    rightTorque = 0;
    plankAngle = 0;
    plank.style.transform = `rotate(0deg)`;
    log.innerHTML = '';

    updateDisplays();
    localStorage.removeItem('mustafafatihcan');
}

function updateWeightColor() {
    const colorIndex = Math.floor(Math.random() * WEIGHT_COLORS.length);
    nextColor = WEIGHT_COLORS[colorIndex];
}

function saveState() {
    const data = {
        plankAngle: plankAngle,
        leftTorque: leftTorque,
        rightTorque: rightTorque,
        leftWeight: leftWeight,
        rightWeight: rightWeight,
        weights: weights.map(w => ({
            weight: w.weight,
            x: w.x,
            color: w.color
        }))
    };
    localStorage.setItem('mustafafatihcan', JSON.stringify(data));
}

function loadState() {
    const data = JSON.parse(localStorage.getItem('mustafafatihcan'));
    if (data) {
        plankAngle = data.plankAngle;
        leftTorque = data.leftTorque;
        rightTorque = data.rightTorque;
        leftWeight = data.leftWeight;
        rightWeight = data.rightWeight;

        data.weights.forEach(weight => {
            const obj = document.createElement('div');
            const size = 30 + weight.weight * 4;
            obj.style.width = `${size}px`;
            obj.style.height = `${size}px`;
            obj.classList.add('weight');
            obj.style.left = `${weight.x}px`;
            obj.style.bottom = `500px`;
            obj.style.background = weight.color;
            obj.textContent =`${weight.weight} KG`;

            seesaw.appendChild(obj);

            weights.push({
                element: obj,
                weight: weight.weight,
                x: weight.x,
                color: weight.color
            });

            addLog(weight.weight, weight.x);

            setTimeout(() => {
                obj.style.bottom = `${PLANK_BASE_BOTTOM}px`;
                updateWeightsPos();
            }, 10);
        });

        plank.style.transform = `rotate(${plankAngle}deg)`;
        updateDisplays();
    }
}

// TEST AREA

loadState();
updateDisplays();

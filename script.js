// GLOBAL VARIABLES
const seesaw = document.getElementById('seesaw-input');
const plank = document.getElementById('seesaw-plank');

const PLANK_BASE_BOTTOM = 145; // 500px seesaw height / 4 because seesawplank is 25% of seesaw height + 20px seesaw plank height
const PIVOT_X = seesaw.offsetWidth / 2;
const PIVOT_Y = PLANK_BASE_BOTTOM + 10; // 10px is half of seesaw plank height
const MAX_PLANK_ANGLE = 30;

let plankAngle = 0;
let nextWeight = 1; //Math.floor(Math.random() * 10) + 1;

let weights = [];

let leftTorque = 0;
let rightTorque = 0;

// EVENT LISTENERS
seesaw.addEventListener('click', function(event) {
    const rect = seesaw.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    updateTorque(clickX, nextWeight);

    updatePlankAngle();

    const obj = document.createElement('div');
    obj.classList.add('weight');
    obj.style.left = `${clickX - 15}px`;
    obj.style.bottom = '500px';

    setTimeout(() => {
        obj.style.bottom = `${PLANK_BASE_BOTTOM}px`;
    }, 10);
    
    seesaw.appendChild(obj);

    //updateWeights();

    weights.push({
        element: obj,
        weight: nextWeight,
        x: clickX,
        y: PLANK_BASE_BOTTOM
    });

    //updateNextWeight();
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
    console.log(`Left Torque: ${leftTorque}, Right Torque: ${rightTorque}, Plank Angle: ${plankAngle}`);
}

function updateWeights() {
    weights.forEach(weight => {
        weight.element.style.bottom = `10px`;
    });
}

function updateNextWeight() {
    nextWeight = Math.floor(Math.random() * 10) + 1;
}

// TEST AREA

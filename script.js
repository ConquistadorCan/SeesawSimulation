const seesaw = document.getElementById('seesaw-input');

seesaw.addEventListener('click', function(event) {
    const rect = seesaw.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    const obj = document.createElement('div');
    obj.classList.add('weight');
    obj.style.left = `${clickX - 15}px`;
    obj.style.bottom = '500px';

    setTimeout(() => {
        obj.style.bottom = '145px';
        // 500px seesaw height / 4 because seesawplank is 25% of seesaw height + 20px seesaw plank height
    }, 10);

    seesaw.appendChild(obj);
});
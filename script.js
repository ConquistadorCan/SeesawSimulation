const seesaw = document.getElementById('seesaw-input');

seesaw.addEventListener('click', function(event) {
    const rect = seesaw.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    const obj = document.createElement('div');
    obj.classList.add('weight');
    obj.style.left = `${clickX - 15}px`;
    obj.style.bottom = '500px';

    setTimeout(() => {
        obj.style.bottom = '0px';
    }, 10);

    seesaw.appendChild(obj);
});
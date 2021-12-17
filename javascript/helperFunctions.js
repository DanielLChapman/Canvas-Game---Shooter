

function calculateWidth(hyp, a) {
    return hyp * Math.cos(a * Math.PI/180);
}

function calculateHeight(hyp,a) {
    return hyp * Math.sin(a * Math.PI / 180);
}

function rnd(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function openCloseSettings(setting) {
    if (setting === 'Open') {
        document.querySelector('#canvas-settings-window').style.display = 'block';
    } else {
        document.querySelector('#canvas-settings-window').style.display = 'none';
    }

}
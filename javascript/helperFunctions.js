

function calculateWidth(hyp, a) {
    return hyp * Math.cos(a * Math.PI/180);
}

function calculateHeight(hyp,a) {
    return hyp * Math.sin(a * Math.PI / 180);
}

function rnd(min, max) {
    return Math.floor(Math.random() * max) + min;
}
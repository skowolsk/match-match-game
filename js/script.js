let shirtCards = document.getElementById('shirtCards');
let difficultyGame = document.getElementById('difficultyGame');
let newGame = document.getElementById('newGame');
let board = document.querySelector(".board");

function selectElement(event, nameClass) {
    let target = event.target;

    while (target !== this) {
        if (target.tagName === 'LI') {
            for(let i = 0; i < target.parentNode.children.length; i++)
                target.parentNode.children[i].classList.remove(nameClass);
            target.classList.toggle(nameClass);
            return;
        }
        target = target.parentNode;
    }
}


shirtCards.onclick = (event) => selectElement(event, 'active-shirt');
difficultyGame.onclick = (event) => selectElement(event, 'active-difficulty');

newGame.onclick = function (event) {

    let timer = new Clock();
    timer.start();
    let cardsMatrix = new Cards(document.querySelector('.active-shirt').value, document.querySelector('.active-difficulty').value);

    board.innerHTML = "";
    board.appendChild(cardsMatrix.createMatrix());


    let cards = document.querySelector('.cards');
    let selectedCardFirst;
    let selectedCardSecond;
    cards.onclick = function (event) {
        let target = event.target;
        while (target !== this) {
            if (target.tagName === 'LI') {
                selectCard(target.querySelector('.flipper'));
                return;
            }
            target = target.parentNode;
        }
    };
    board.onclick = () => {
        if(selectedCardFirst.innerHTML === selectedCardSecond.innerHTML){
            setTimeout( ()=> {
                selectedCardFirst.classList.add('hiddenCard');
                selectedCardSecond.classList.add('hiddenCard');

                for(let i = 0, hiddenCardCounter = 0; i < cards.children.length; i++){
                    if(!cards.children[i].firstElementChild.classList.contains('hiddenCard')){
                        break;
                    } else hiddenCardCounter++;
                    if (hiddenCardCounter == cards.children.length) {
                        Clock.stop();
                        alert(`You win! Your time: ${timer.minutes}m:${timer.seconds}s`);
                    }
                }
            }, 500);
        }

    };

    function selectCard(node) {
        if (selectedCardSecond && selectedCardFirst) {
            selectedCardFirst.classList.remove('flip');
            selectedCardSecond.classList.remove('flip');
            selectedCardSecond = null;
            selectedCardFirst = null;
        }
        if(selectedCardFirst){
            selectedCardSecond = node;
            selectedCardSecond.classList.add('flip');
        } else {
            selectedCardFirst = node;
            selectedCardFirst.classList.add('flip');
        }
    }
};



class Cards {
    constructor(shirt, sizeMatrix){
        this.shirt = shirt;
        this.sizeMatrix = sizeMatrix;
    }
    createMatrix() {
        let cards = document.createElement('ul');
        cards.classList.add("cards");
        let similarCards = [];

        for(let i = 0; i < this.sizeMatrix/2; i++){

            similarCards.push(i);
            similarCards.push(i);
        }
        similarCards.sort(function(a, b) {return Math.random()-0.5});

        for(let i = 0; i < this.sizeMatrix; i++){
            let container = document.createElement('li');
            container.className = "flip-container";
            let flipper = document.createElement('div');
            flipper.className = "flipper";

            let front = document.createElement('div');
            front.className = "front";
            if(this.shirt == 1){
                front.style.backgroundColor = "#2e6d9c";
            } else if(this.shirt == 2){
                front.style.backgroundColor = "#9c6076";
            } else {
                front.style.backgroundColor = "#c7c125";
            }

            let back = document.createElement('div');
            back.className = "back";
            back.innerHTML = similarCards[0];
            similarCards.shift();


            flipper.appendChild(front);
            flipper.appendChild(back);

            container.appendChild(flipper);


            cards.appendChild(container);
        }

        return cards;
    }
}

class Clock {
    constructor () {
        this.seconds = 0;
        this.minutes = 0;
    }
    start() {
        Clock.stop();
        let counterGame = document.getElementById('counterGame');
        Clock.timeId = setInterval( ()=> {
            this.seconds++;
            if(this.seconds >= 60) {
                this.minutes++;
                this.seconds = 0;
            }
            counterGame.children[0].innerHTML = `${this.minutes}m:${this.seconds}s`;
            counterGame.classList.toggle('button-time-active');
        },1000);

    }
    static stop() {
        clearInterval(Clock.timeId);
    }
}

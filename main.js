
const textEl = document.querySelector('.question-text');
const answerMsg = document.querySelector('.answer-msg');
const inputEl = document.querySelector('#guess-input');
const checkEl = document.querySelector('.check-btn');
const nextBtnEl = document.querySelector('.next-btn');
const flatCheckEl = document.querySelector('#flat');
const lowestFretEl = document.querySelector('#lowest-fret');
const highestFretEl = document.querySelector('#highest-fret');
const stringCheckboxEl = document.querySelectorAll('.strings');
const stringInputEl = document.querySelectorAll('.string-name');
const saveBtn = document.querySelector('.save-btn');

const enharmonicMap = {
    'Db': 'C#', 'C#': 'Db',
    'Eb': 'D#', 'D#': 'Eb',
    'Gb': 'F#', 'F#': 'Gb',
    'Ab': 'G#', 'G#': 'Ab',
    'Bb': 'A#', 'A#': 'Bb',
}

let fretNum = null;
let playString = null;
let playNote = null;
let rotateArray = null;
let allInputsFilled = true;
let allCheckboxFilled = false;
let isFlat = flatCheck();
let strings = getActiveStrings();


nextBtnEl.addEventListener('click', () => {
    //Reset styles and values
    answerMsg.style.display = 'none';
    inputEl.style.borderColor = '';
    inputEl.value = '';

    playString = strings[randomNumGen(strings.length)];
    //Jobbe videre herfra
    playNote = isFlat[randomNumGen(isFlat.length)];
    rotateArray = rotateNotes(playString);
    fretNum = rotateArray.indexOf(playNote);
    textChanger(playString, playNote);
})

checkEl.addEventListener('click', () => {
    const val = Number(inputEl.value);
    if(inputEl.value === '' || val < 0 || val > 24){
        answerFeedback(false, false);
    }
    else if(val === fretNum || val % 12 === fretNum){
        answerFeedback(true, true);
    }
    else{
        answerFeedback(false, true);
    }
})

flatCheckEl.addEventListener('change', () => {
    strings = getActiveStrings();
    isFlat = flatCheck();
    rotateArray = rotateNotes(playString);
    playString = rotateArray[0];
    playNote = rotateArray[fretNum];
    
    textChanger(playString, playNote);
})

saveBtn.addEventListener('click', () => {
    allInputsFilled = Array.from(stringInputEl).every(el => el.value !== null && el.value !== undefined && el.value !== '');
    allCheckboxFilled = Array.from(stringCheckboxEl).every(checkbox => !checkbox.checked);
    if(allInputsFilled && !allCheckboxFilled){
        strings = getActiveStrings();
    }
})

for(let i = 0; i < stringInputEl.length; i++){
    stringInputEl[i].addEventListener('input', (e) => {
        let value = e.target.value;
        let filtered = '';
    
        for(let j = 0; j < value.length; j++){
            const char = value[j];
            if(j === 0 && 'ABCDEFG'.includes(char.toUpperCase())){
                filtered += char.toUpperCase();
            }
            else if((filtered === 'C' || filtered === 'F') && char === 'b' || (filtered === 'E' || filtered === 'B') && char === '#'){
                continue;
            }
            else if(j === 1 && '#b'.includes(char.toLowerCase())){
                filtered += char.toLowerCase();
            }
        }
        e.target.value = filtered;
    })
}

function randomNumGen(arraySize){
    return Math.floor(Math.random() * arraySize);
}

function rotateNotes(startNote) {
    const notes = isFlat;
    const startIndex = notes.indexOf(normalizeNote(startNote, flatCheckEl.checked));

    // "Slice" arrayen fra start og legg til resten foran
    return notes.slice(startIndex).concat(notes.slice(0, startIndex));
}

function normalizeNote(note, useFlats){
    if(useFlats && note.includes('b')) return note;
    if(!useFlats && note.includes('#')) return note;

    if(enharmonicMap[note]){
        const alt = enharmonicMap[note];
        return useFlats
            ? (alt.includes('b') ? alt : note)
            : (alt.includes('#') ? alt : note);
    }
    return note;
}

function getActiveStrings(){
    const activeStrings = [];
    
    stringCheckboxEl.forEach((checkbox, index) => {
        if(checkbox.checked){
            const rawValue = stringInputEl[index].value.trim();
            const normalized = normalizeNote(rawValue, flatCheckEl.checked);
            activeStrings.push(normalized);
        }
    })
    return activeStrings;
}

function flatCheck(){
    if(flatCheckEl.checked){
        return ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    }
    else{
        return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    }
}

function textChanger(string, note){
    textEl.textContent = `String: ${string} Note: ${note}`;
}

function answerFeedback(answer, text){
    if(!text){
        inputEl.style.borderColor = 'red';
        return;
    }
    if(answer){
        answerMsg.textContent = 'RIGHT!';
        answerMsg.style.color = 'green';
        inputEl.style.borderColor = 'lightGreen';
    }
    else{
        answerMsg.textContent = `Wrong! Right answer is ${fretNum}`;
        answerMsg.style.color = 'red';
        inputEl.style.borderColor = 'red';
    }

    answerMsg.style.display = 'block';
}

const textEl = document.querySelector('p');
const inputEl = document.querySelector('input');
const checkEl = document.querySelector('.check-btn');
const nextBtnEl = document.querySelector('.next-btn');
const flatCheckEl = document.querySelector('#flat');

// Strings on the guitar
const strings = ['E', 'A', 'D', 'G', 'B'];

let fretNum;
let isFlat = flatCheck();
let playString;
let playNote;
let rotateArray;

nextBtnEl.addEventListener('click', () => {
    inputEl.style.borderColor = '';
    inputEl.value = '';
    playString = strings[randomNumGen(strings.length)];
    playNote = isFlat[randomNumGen(isFlat.length)];
    rotateArray = rotateNotes(playString);
    fretNum = rotateArray.indexOf(playNote);
    textChanger(playString, playNote);
})

checkEl.addEventListener('click', () => {
    const val = Number(inputEl.value);
    if(val === '' || val < 0 || val > 24){
        inputEl.style.borderColor = 'red';
    }
    else if(val === fretNum || val % 12 === fretNum){
        textEl.textContent = `RIKTIG!`;
        inputEl.style.borderColor = 'lightgreen';
    }
    else{
        textEl.textContent = `Feil! Rett svar var ${fretNum}`;
        inputEl.style.borderColor = 'red';
    }
})

function randomNumGen(arrayLength){
    return Math.floor(Math.random() * arrayLength);
}

function rotateNotes(startNote) {
  const notes = isFlat;
  const startIndex = notes.indexOf(startNote);

  // "Slice" arrayen fra start og legg til resten foran
  return notes.slice(startIndex).concat(notes.slice(0, startIndex));
}

flatCheckEl.addEventListener('change', () => {
    isFlat = flatCheck();
    rotateArray = rotateNotes(playString);
    playNote = rotateArray[fretNum];
    
    textChanger(playString, playNote);
})

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
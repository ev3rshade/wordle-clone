/**
 * WORDLE CLONE - STUDENT IMPLEMENTATION
 * 
 * Complete the functions below to create a working Wordle game.
 * Each function has specific requirements and point values.
 * 
 * GRADING BREAKDOWN:
 * - Core Game Functions (60 points): initializeGame, handleKeyPress, submitGuess, checkLetter, updateGameState
 * - Advanced Features (30 points): updateKeyboardColors, processRowReveal, showEndGameModal, validateInput
 */

// ========================================
// CORE GAME FUNCTIONS (60 POINTS TOTAL)
// ========================================

/**
 * Initialize a new game
 * POINTS: 10
 */
function initializeGame() {
    currentWord = '';
    currentGuess = '';
    currentRow = 0;
    gameOver = false;
    gameWon = false;
    
    currentWord = getRandomWord();
    console.log(currentWord);
    
    resetBoard();
    
    hideModal();
    
}

/**
 * Handle keyboard input
 * POINTS: 15
 * 
 */
function handleKeyPress(key) {
    if (gameOver) {
        return
    }

    keyPattern = /^[A-Z]$/
    


    if(keyPattern.test(key) && currentGuess.length < WORD_LENGTH) {
        updateTileDisplay(getTile(currentRow, currentGuess.length), key);
        currentGuess = currentGuess + key;
        return;
    }
    

    if (key === 'ENTER') {
        if (isGuessComplete()) {
            submitGuess();

        } else {
            showMessage('Guess is too short!!!', type = 'error', duration = 2000);
            shakeRow(currentRow);
        }
        return;
    }

    if (key === 'BACKSPACE') {
        if (currentGuess.length > 0) {
            updateTileDisplay(getTile(currentRow, currentGuess.length - 1), '');
            currentGuess = currentGuess.substring(0, currentGuess.length - 1)
        }

        return;
    }
}

/**
 * Submit and process a complete guess
 * POINTS: 20
 * 
 * TODO: Complete this function to:
 * - Validate the guess is a real word
 * - Check each letter against the target word
 * - Update tile colors and keyboard
 * - Handle win/lose conditions
 */
function submitGuess() {
    const target = getTargetWord();
    const guess = getCurrentGuess();

    if (!isGuessComplete()) {
        showMessage('Guess is too short!!!', type = 'error', duration = 2000);
        return;
    }
    

    if (!isValidWord(guess)) {
        showMessage('Guess is invalid word!!!', type = 'error', duration = 2000);
        shakeRow(currentRow);
        return;
    }
    

    results = []
    for (let i = 0; i < WORD_LENGTH; i++) {
        results.push(checkLetter(guess[i], i, target));
        setTileState(getTile(currentRow, i), results[i]);
    }

    console.log(results);

    flipRowTiles(currentRow, [], () => {
        processRowReveal(currentRow, results);
        updateKeyboardColors(guess, results);
    });

    const isCorrect = (guess === target);
    updateGameState(isCorrect);

    if (!gameOver) {
            currentRow += 1;
            currentGuess = '';
    }
}

/**
 * Check a single letter against the target word
 * POINTS: 10
 * 
 */
function checkLetter(guessLetter, position, targetWord) {

    const guess = getCurrentGuess(); 
    if (targetWord[position] === guessLetter) {
        return 'correct';
    }

    const letterCount = {};
    for (let i = 0; i < WORD_LENGTH; i++) {
        const t = targetWord[i];
        if (guess[i] === t) {
            continue; 
        }
        letterCount[t] = (letterCount[t] || 0) + 1;
    }

    for (let i = 0; i < position; i++) {
        if (guess[i] === targetWord[i]) {
            continue; 
        }
        const g = guess[i];
        if ((letterCount[g] || 0) > 0) {
        letterCount[g] -= 1;
        }
    }

    if ((letterCount[guessLetter] || 0) > 0) {
        return 'present';
    }
    
    return 'absent';

}

/**
 * Update game state after a guess
 * POINTS: 5
 * 
 */
function updateGameState(isCorrect) {
    if (isCorrect) {
        gameWon = true;
        gameOver = true;
        showEndGameModal(true, getTargetWord());
        return;
    }

    if (currentRow >= MAX_GUESSES - 1) {
        gameWon = false;
        gameOver = true;
        showEndGameModal(false, getTargetWord());
    }
    
}

// ========================================
// ADVANCED FEATURES (30 POINTS TOTAL)
// ========================================

/**
 * Update keyboard key colors based on guessed letters
 * POINTS: 10
 */
function updateKeyboardColors(guess, results) {
    for (let i = 0; i < guess.length; i++) {
        const keyElement = document.querySelector(`[data-key="${guess[i]}"]`);
        if (keyElement.classList.contains('correct')) {
            return;
        }
        else if (keyElement.classList.contains('present') && (results[i] == 'absent')) {
            return;
        }
        
        updateKeyboardKey(guess[i], results[i]);
        
    }    
}

/**
 * Process row reveal (simplified - no animations needed)
 * POINTS: 5 (reduced from 15 since animations removed)
 * 
 */
function processRowReveal(rowIndex, results) {
    const allCorrect = results.every(c => c === 'correct');
    if (allCorrect) {
        celebrateRow(rowIndex);
    }
    
}

/**
 * Show end game modal with results
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Display appropriate win/lose message
 * - Show the target word
 * - Update game statistics
 */
function showEndGameModal(won, targetWord) {

    updateStats(won);
    const guessesUsed = won ? (currentRow + 1) : 0;
    showModal(won, targetWord, guessesUsed);}

/**
 * Validate user input before processing
 * POINTS: 5
 * 
 * */
function validateInput(key, currentGuess) {
    if (gameOver) return false;

    if (/^[A-Z]$/.test(key)) {
        return currentGuess.length < WORD_LENGTH;
    }

    if (key === 'ENTER') {
        return currentGuess.length === WORD_LENGTH;
    }

    if (key === 'BACKSPACE') {
        return currentGuess.length > 0;
    }

    return false;
}


console.log('Student implementation template loaded. Start implementing the functions above!'); 

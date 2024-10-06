(function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const dots = [
        { x: 100, y: 100 },
        { x: 700, y: 100 },
        { x: 700, y: 500 },
        { x: 100, y: 500 }
    ];

    const levels = [
        { duration: 5000 },
        { duration: 7000 },
        { duration: 9000 },
        { duration: 11000 },
        { duration: 13000 },
        { duration: 15000 }
    ];

    let currentDotIndex = 0;
    let currentLevel = 0;
    let timerInterval;
    let timeLeft;

    function drawDots() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        dots.forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawLine(dot1, dot2, progress) {
        ctx.beginPath();
        ctx.moveTo(dot1.x, dot1.y);
        const x = dot1.x + (dot2.x - dot1.x) * progress;
        const y = dot1.y + (dot2.y - dot1.y) * progress;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function displayTimer() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 - 30, 100, 60);

        ctx.fillStyle = '#000';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(timeLeft, canvas.width / 2, canvas.height / 2 + 10);
    }

    function createLevelIndicators() {
        const levelIndicator = document.getElementById('levelIndicator');
        levels.forEach((level, index) => {
            const levelElement = document.createElement('div');
            levelElement.classList.add('level');
            if (index < currentLevel) {
                levelElement.classList.add('completed');
            } else if (index === currentLevel) {
                levelElement.classList.add('ongoing');
            }
            levelElement.textContent = `Level ${index + 1}`;
            levelIndicator.appendChild(levelElement);
        });
    }

    function updateLevelIndicators() {
        const levelIndicator = document.getElementById('levelIndicator');
        levelIndicator.innerHTML = '';
        levels.forEach((level, index) => {
            const levelDiv = document.createElement('div');
            levelDiv.classList.add('level');
            levelDiv.textContent = `Level ${index + 1}`;
            if (index == currentLevel - 1) {
                levelDiv.style.backgroundColor = 'green';
            } else if (index == currentLevel) {
                levelDiv.style.backgroundColor = 'orange';
            } else {
                levelDiv.style.backgroundColor = 'white';
            }
            levelIndicator.appendChild(levelDiv);
        });
    }

    function startGame() {
        const levelIndicator = document.getElementById('levelIndicator');
        levelIndicator.innerHTML = '';
        drawDots();
        currentDotIndex = 0;
        currentLevel = 0;
        createLevelIndicators();
        updateLevelIndicators();
        startTimer();
    }

    function startTimer() {
        const levelDuration = levels[currentLevel].duration;
        const segmentDuration = levelDuration;
        let startTime = Date.now();

        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const progress = elapsedTime / segmentDuration;
            timeLeft = Math.ceil((levelDuration - elapsedTime) / 1000);

            if (progress >= 1) {
                drawDots();
                drawLine(dots[currentDotIndex], dots[(currentDotIndex + 1) % dots.length], 1);
                currentDotIndex++;

                if (currentDotIndex >= dots.length) {
                    alert('Level Completed!');
                    clearInterval(timerInterval);
                    nextLevel();
                } else {
                    startTime = Date.now();
                }
            } else {
                drawDots();
                for (let i = 0; i < currentDotIndex; i++) {
                    drawLine(dots[i], dots[(i + 1) % dots.length], 1);
                }
                drawLine(dots[currentDotIndex], dots[(currentDotIndex + 1) % dots.length], progress);
            }

            displayTimer();
        }, 30);
    }

    function nextLevel() {
        currentLevel++;
        if (currentLevel < levels.length) {
            updateLevelIndicators();
            currentDotIndex = 0;
            alert(`Congratulations! You've completed Level ${currentLevel}. Starting Level ${currentLevel + 1}`);
            startTimer();
        } else {
            alert("Congratulations! You've completed all levels.");
            drawDots();
        }
    }

    function stopGame() {
        clearInterval(timerInterval);
    }

    function resetGame() {
        stopGame();
        drawDots();
        currentDotIndex = 0;
        currentLevel = 0;
        const levelIndicator = document.getElementById('levelIndicator');
        levelIndicator.innerHTML = '';
        createLevelIndicators();
    }

    function restartLevel() {
        stopGame();
        drawDots();
        currentDotIndex = 0;
        startTimer();
    }

    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('stopButton').addEventListener('click', stopGame);
    document.getElementById('resetButton').addEventListener('click', resetGame);
    document.getElementById('restartLevelButton').addEventListener('click', restartLevel);

    drawDots();
})();

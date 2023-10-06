let timer;
let startTime;
let isGameRunning = false;

function startGame() {
    if (!isGameRunning) {
        const targetSentence = document.getElementById("target-sentence").textContent;
        document.getElementById("input-box").value = "";
        document.getElementById("result").textContent = "";

        isGameRunning = true;
        startTime = Date.now();

        timer = setInterval(function () {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            document.getElementById("result").textContent = "Time: " + elapsedTime + "s";
        }, 1000);

        document.getElementById("input-box").addEventListener("input", function () {
            const typedSentence = this.value;
            if (typedSentence === targetSentence) {
                clearInterval(timer);
                const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                const wordsPerMinute = calculateWordsPerMinute(targetSentence, elapsedTime);
                document.getElementById("result").textContent = "You typed at " + wordsPerMinute + " words per minute!";
                isGameRunning = false;
            }
        });
    }
}

function calculateWordsPerMinute(sentence, timeInSeconds) {
    const words = sentence.split(" ").length;
    const wordsPerMinute = Math.floor((words / timeInSeconds) * 60);
    return wordsPerMinute;
}
const wheel = document.querySelector('.wheel');
const spinButton = document.getElementById('spinButton');
const result = document.getElementById('result');

let spinning = false;

spinButton.addEventListener('click', () => {
    if (!spinning) {
        spinning = true;
        result.textContent = '';
        const randomDegree = 360 * 5 + Math.floor(Math.random() * 360); // Random degree for spinning
        wheel.style.transition = 'transform 3s ease-out';
        wheel.style.transform = `rotate(${randomDegree}deg)`;
        
        setTimeout(() => {
            spinning = false;
            wheel.style.transition = 'none';
            const degrees = randomDegree % 360;
            const prizes = ['100', '200', '300', '400', '500', 'Bankrupt', '1000', '2000', '3000', '5000'];
            const segmentSize = 360 / prizes.length;
            const index = Math.floor(degrees / segmentSize);
            const prize = prizes[index];
            result.textContent = `You won: $${prize}`;
        }, 3000);
    }
});

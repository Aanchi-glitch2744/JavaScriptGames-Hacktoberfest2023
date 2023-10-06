const catSelect = document.getElementById('cat-select');
        const memeTextInput = document.getElementById('meme-text-input');
        const generateButton = document.getElementById('generate-button');
        const catImage = document.getElementById('cat-image');
        const memeText = document.getElementById('meme-text');

        // Function to generate the meme
        generateButton.addEventListener('click', () => {
            const selectedCat = catSelect.value;
            const text = memeTextInput.value;

            catImage.src = selectedCat;
            memeText.innerText = text;
        });
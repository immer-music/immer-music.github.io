document.addEventListener("DOMContentLoaded", () => {
    const target = "Immer Music";
    const element = document.getElementById("logo-animate");

    // 영어 자음/모음
    const upperConsonants = "BCDFGHJKLMNPQRSTVWXYZ";
    const upperVowels = "AEIOU";
    const lowerConsonants = "bcdfghjklmnpqrstvwxyz";
    const lowerVowels = "aeiou";

    // 자음/모음 판별 함수
    function isVowel(char) {
        return "AEIOUaeiou".includes(char);
    }

    let frame = 0;
    let interval = setInterval(() => {
        let displayed = "";
        for (let i = 0; i < target.length; i++) {
            if (i < frame || target[i] === " ") {
                displayed += target[i];
            } else if (target[i] === target[i].toUpperCase() && target[i] !== " ") {
                // 대문자 위치
                if (isVowel(target[i])) {
                    displayed += upperVowels[Math.floor(Math.random() * upperVowels.length)];
                } else {
                    displayed += upperConsonants[Math.floor(Math.random() * upperConsonants.length)];
                }
            } else {
                // 소문자 위치
                if (isVowel(target[i])) {
                    displayed += lowerVowels[Math.floor(Math.random() * lowerVowels.length)];
                } else {
                    displayed += lowerConsonants[Math.floor(Math.random() * lowerConsonants.length)];
                }
            }
        }
        element.textContent = displayed;
        frame++;
        if (frame > target.length) clearInterval(interval);
    }, 60);
});
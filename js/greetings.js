(function() {
    const saudadiv = document.getElementById("saudadiv");
    const saudacao = ["Boa noite,", "Bom dia,", "Boa tarde,", "Boa noite,"][Math.floor(new Date().getHours() / 6)];

    if (saudadiv) {
        const saudacaoElement = document.createElement("p");
        saudacaoElement.textContent = saudacao;
        saudadiv.innerHTML = "";
        saudadiv.appendChild(saudacaoElement);
    }
})(); 
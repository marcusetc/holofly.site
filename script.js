const carousels = document.querySelectorAll('.carousel-container');

carousels.forEach(carousel => {
    const items = Array.from(carousel.querySelectorAll('img')); // Imagens do carrossel
    const messageBox = carousel.nextElementSibling; // Caixa de mensagem associada
    let currentIndex = 0; // Índice da imagem atualmente visível

    // Função para atualizar a posição do carrossel
    const updateCarousel = () => {
        const itemWidth = items[0].offsetWidth; // Largura de uma imagem
        carousel.scrollLeft = currentIndex * itemWidth;
        updateCenterItem();
    };

    // Função para avançar ou retroceder no carrossel
    const navigateCarousel = (direction) => {
        currentIndex += direction;

        if (currentIndex < 0) {
            currentIndex = items.length - 1; // Volta para o último item
        } else if (currentIndex >= items.length) {
            currentIndex = 0; // Volta para o primeiro item
        }

        updateCarousel();
    };

    // Função para detectar o item mais próximo do centro
    const updateCenterItem = () => {
        const containerRect = carousel.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        items.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            const distanceToCenter = Math.abs(containerCenter - itemCenter);

            // Aplica a classe "center" na imagem visível
            item.classList.toggle('center', distanceToCenter < 50);
        });
    };

// Adiciona evento de clique para exibir a mensagem
items.forEach(item => {
    item.addEventListener('click', () => {
        const message = item.getAttribute('data-message');
        if (message) {
            messageBox.textContent = message;
            messageBox.style.display = 'block';

            // Oculta a mensagem após 5 segundos
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 5000);
        }
    });
});

// Função para ocultar a mensagem quando o carrossel for tocado ou movimentado
const hideMessageOnInteraction = () => {
    messageBox.style.display = 'none';
};

// Adiciona eventos de movimento ou toque no carrossel para ocultar a mensagem
carousel.addEventListener('touchstart', hideMessageOnInteraction); // Para dispositivos móveis (toque)
carousel.addEventListener('scroll', hideMessageOnInteraction); // Para interação de rolagem


    // Configura o carrossel inicial
    updateCarousel();

    // Atualiza a posição e o estado ao redimensionar a janela
    window.addEventListener('resize', updateCarousel);

    // Exemplo de botões de navegação (opcional)
    const prevButton = carousel.parentElement.querySelector('.prev');
    const nextButton = carousel.parentElement.querySelector('.next');

    if (prevButton) {
        prevButton.addEventListener('click', () => navigateCarousel(-1));
    }
    if (nextButton) {
        nextButton.addEventListener('click', () => navigateCarousel(1));
    }
});

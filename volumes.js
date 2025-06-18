// Função para criar cards dos volumes
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mangaId = urlParams.get('mangaId');

    if (!mangaId) {
        window.location.href = 'index.html';
        return;
    }

    const manga = window.mangaData.categorias[mangaId];
    if (!manga) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('manga-title').textContent = manga.nome;

    // Criar cards para cada volume
    const volumesContainer = document.querySelector('.volumes-container');
    const subcategorias = manga.subcategorias;

    function criarCards(subcategoria) {
        // Adicionar título da subcategoria
        const subcategoriaTitle = document.createElement('h3');
        subcategoriaTitle.textContent = subcategoria.nome || 'Volumes';
        subcategoriaTitle.className = 'subcategoria-title';
        volumesContainer.appendChild(subcategoriaTitle);

        // Adicionar volumes da subcategoria
        subcategoria.volumes.forEach(volume => {
            const volumeCard = document.createElement('div');
            volumeCard.className = 'volume-list';

            // Adicionar imagem
            const img = document.createElement('img');
            img.src = volume.imagem || 'https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-21.png?ssl=1';
            img.alt = `Volume ${volume.volume}`;
            img.onerror = function() {
                this.src = 'https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-21.png?ssl=1';
            };
            volumeCard.appendChild(img);

            // Adicionar informações do volume
            const volumeInfo = document.createElement('div');
            volumeInfo.className = 'volume-info';

            // Título do mangá
            const mangaTitle = document.createElement('h3');
            mangaTitle.textContent = manga.nome;
            mangaTitle.className = 'manga-title';
            volumeInfo.appendChild(mangaTitle);

            // Número do volume
            const volumeNumber = document.createElement('h2');
            volumeNumber.textContent = `Volume ${volume.volume}`;
            volumeInfo.appendChild(volumeNumber);

            // Status
            const status = document.createElement('p');
            status.textContent = `Status: ${volume.status}`;
            status.className = `status ${volume.status.toLowerCase()}`;
            volumeInfo.appendChild(status);

            volumeCard.appendChild(volumeInfo);
            volumesContainer.appendChild(volumeCard);
        });

        // Adicionar um espaçador após cada subcategoria
        const spacer = document.createElement('div');
        spacer.className = 'subcategoria-spacer';
        volumesContainer.appendChild(spacer);
    }

    if (subcategorias) {
        subcategorias.forEach(subcategoria => {
            criarCards(subcategoria);
        });
    } else if (manga.volumes) {
        criarCards({ volumes: manga.volumes });
    }

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        window.history.back();
    });
});

// Função para criar cards de volume
function criarCards() {
    const content = document.querySelector('content');
    if (!content) {
        console.error('Elemento content não encontrado');
        return;
    }
    content.innerHTML = '';

    // Obter o mangaId da URL
    const params = new URLSearchParams(window.location.search);
    const mangaId = params.get('mangaId');
    if (!mangaId) {
        console.error('mangaId não encontrado na URL');
        return;
    }

    // Encontrar o manga correspondente
    const manga = window.mangaData.categorias[mangaId];
    if (!manga) {
        console.error('Manga não encontrado');
        return;
    }

    // Adicionar título do mangá
    const title = document.createElement('h1');
    title.textContent = manga.nome;
    content.appendChild(title);

    // Adicionar editora
    const editora = document.createElement('p');
    editora.textContent = `Editora: ${manga.editora}`;
    content.appendChild(editora);

    // Adicionar subcategorias ou volumes
    if (manga.subcategorias) {
        manga.subcategorias.forEach(subcategoria => {
            // Adicionar título da subcategoria
            const subcategoriaTitle = document.createElement('h2');
            subcategoriaTitle.textContent = subcategoria.nome;
            subcategoriaTitle.className = 'subcategoria-title';
            content.appendChild(subcategoriaTitle);

            // Adicionar volumes da subcategoria
            subcategoria.volumes.forEach(volume => {
                criarVolumeCard(manga, volume, subcategoria);
            });

            // Adicionar um espaçador após cada subcategoria
            const spacer = document.createElement('div');
            spacer.className = 'subcategoria-spacer';
            content.appendChild(spacer);
        });
    } else if (manga.volumes) {
        manga.volumes.forEach(volume => {
            criarVolumeCard(manga, volume);
        });
    }

    // Adicionar botão de voltar
    const backBtn = document.createElement('button');
    backBtn.textContent = 'Voltar';
    backBtn.className = 'back-btn';
    backBtn.onclick = () => {
        window.history.back();
    };
    content.appendChild(backBtn);
}

// Função auxiliar para criar cards de volume
function criarVolumeCard(manga, volume, subcategoria) {
    const volumeCard = document.createElement('div');
    volumeCard.className = 'volume-list';

    // Adicionar imagem
    const img = document.createElement('img');
    img.src = volume.imagem || 'https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-21.png?ssl=1';
    img.alt = `Volume ${volume.volume}`;
    img.onerror = function() {
        this.src = 'https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-21.png?ssl=1';
    };
    volumeCard.appendChild(img);

    // Adicionar informações do volume
    const volumeInfo = document.createElement('div');
    volumeInfo.className = 'volume-info';

    // Título do mangá
    const mangaTitle = document.createElement('h3');
    mangaTitle.textContent = manga.nome;
    mangaTitle.className = 'manga-title';
    volumeInfo.appendChild(mangaTitle);

    // Nome da subcategoria (se existir)
    if (subcategoria) {
        const subcategoriaTitle = document.createElement('p');
        subcategoriaTitle.textContent = subcategoria.nome;
        subcategoriaTitle.className = 'subcategoria-title';
        volumeInfo.appendChild(subcategoriaTitle);
    }

    // Número do volume
    const volumeNumber = document.createElement('h2');
    volumeNumber.textContent = `Volume ${volume.volume}`;
    volumeInfo.appendChild(volumeNumber);

    // Status
    const status = document.createElement('p');
    status.textContent = `Status: ${volume.status}`;
    status.className = `status ${volume.status.toLowerCase()}`;
    volumeInfo.appendChild(status);

    volumeCard.appendChild(volumeInfo);
    content.appendChild(volumeCard);
}

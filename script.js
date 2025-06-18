
// Função para criar cards
function criarCards() {
    const content = document.querySelector('content');
    content.innerHTML = '';

    data.categorias.forEach(categoria => {
        const card = document.createElement('div');
        card.className = 'card';

        // Adicionar imagem do primeiro volume
        const img = document.createElement('img');
        img.src = categoria.volumes[0].imagem;
        img.alt = `Capa do mangá ${categoria.nome}`;
        card.appendChild(img);

        // Adicionar título
        const title = document.createElement('h2');
        title.textContent = categoria.nome;
        card.appendChild(title);

        // Adicionar quantidade de volumes
        const volumes = document.createElement('p');
        volumes.textContent = `${categoria.volumes.length} volumes`;
        card.appendChild(volumes);

        // Adicionar status dos volumes
        const status = document.createElement('p');
        const volumesAdquiridos = categoria.volumes.filter(v => v.status === 'Adquirido').length;
        status.textContent = `${volumesAdquiridos} volumes adquiridos`;
        card.appendChild(status);

        // Adicionar card ao conteúdo
        content.appendChild(card);
    });
}

// Criar cards quando a página carregar
document.addEventListener('DOMContentLoaded', criarCards);
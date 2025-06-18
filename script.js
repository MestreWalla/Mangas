// Função para calcular estatísticas
function calcularEstatisticas() {
    let totalVolumes = 0;
    let volumesAdquiridos = 0;
    let volumesFaltando = 0;

    window.mangaData.categorias.forEach(manga => {
        // Contar volumes diretos
        if (manga.volumes) {
            totalVolumes += manga.volumes.length;
            volumesAdquiridos += manga.volumes.filter(v => v.status === 'Adquirido').length;
        }

        // Contar volumes em subcategorias
        if (manga.subcategorias) {
            manga.subcategorias.forEach(subcategoria => {
                if (subcategoria.volumes) {
                    totalVolumes += subcategoria.volumes.length;
                    volumesAdquiridos += subcategoria.volumes.filter(v => v.status === 'Adquirido').length;
                }
            });
        }
    });

    volumesFaltando = totalVolumes - volumesAdquiridos;

    document.getElementById('total-volumes').textContent = totalVolumes;
    document.getElementById('volumes-adquiridos').textContent = volumesAdquiridos;
    document.getElementById('volumes-faltando').textContent = volumesFaltando;
}

// Função para filtrar mangás
function filtrarMangas(statusFilter = '') {
    const mangas = window.mangaData.categorias;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const sortOrder = document.getElementById('sortOrder').value;

    return mangas.filter(manga => {
        const nome = manga.nome.toLowerCase();
        
        // Filtro por status
        if (statusFilter) {
            const volumes = manga.volumes || [];
            const subcategorias = manga.subcategorias || [];
            
            // Verifica em volumes diretos e em subcategorias
            const hasStatusInVolumes = volumes.some(v => v.status === statusFilter);
            const hasStatusInSubcategorias = subcategorias.some(sub => 
                sub.volumes?.some(v => v.status === statusFilter)
            );
            
            if (!hasStatusInVolumes && !hasStatusInSubcategorias) {
                return false;
            }
        }
        
        // Filtro por nome
        return nome.includes(searchInput);
    }).sort((a, b) => {
        if (sortOrder === 'nome') {
            return a.nome.localeCompare(b.nome);
        } else {
            // Conta volumes totais (diretos + subcategorias)
            const volumesA = (a.volumes?.length || 0) + (a.subcategorias?.reduce((total, sub) => total + (sub.volumes?.length || 0), 0) || 0);
            const volumesB = (b.volumes?.length || 0) + (b.subcategorias?.reduce((total, sub) => total + (sub.volumes?.length || 0), 0) || 0);
            return volumesB - volumesA;
        }
    });
}

// Função para criar cards
function criarCards() {
    const content = document.querySelector('content');
    if (!content) {
        console.error('Elemento content não encontrado');
        return;
    }
    content.innerHTML = '';

    if (!window.mangaData || !window.mangaData.categorias) {
        console.error('Dados não carregados corretamente');
        return;
    }

    const mangasFiltrados = filtrarMangas();

    mangasFiltrados.forEach((categoria, filteredIndex) => {
        // Encontrar o índice correto no array original
        const originalIndex = window.mangaData.categorias.findIndex(m => m.nome === categoria.nome);
        const card = document.createElement('div');
        card.className = 'card';

        // Adicionar imagem do primeiro volume
        const img = document.createElement('img');
        let firstImage;
        
        // Primeiro tenta encontrar em subcategorias
        if (categoria.subcategorias && categoria.subcategorias.length > 0) {
            const firstSubcategoria = categoria.subcategorias[0];
            if (firstSubcategoria && firstSubcategoria.volumes && firstSubcategoria.volumes[0]) {
                firstImage = firstSubcategoria.volumes[0].imagem;
            }
        }
        // Se não encontrar, tenta nos volumes diretos
        if (!firstImage && categoria.volumes && categoria.volumes[0]) {
            firstImage = categoria.volumes[0].imagem;
        }
        
        img.src = firstImage || 'https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-21.png?ssl=1';
        img.alt = `Capa do mangá ${categoria.nome}`;
        img.onerror = function() {
            this.src = 'https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-21.png?ssl=1';
        };
        card.appendChild(img);

        // Adicionar link ao título
        const link = document.createElement('a');
        link.href = `volumes.html?mangaId=${originalIndex}`;
        const title = document.createElement('h2');
        title.textContent = categoria.nome;
        link.appendChild(title);
        card.appendChild(link);

        // Adicionar editora
        const editora = document.createElement('p');
        editora.textContent = `Editora: ${categoria.editora}`;
        card.appendChild(editora);

        // Adicionar quantidade total de volumes
        let totalVolumes = 0;
        if (categoria.subcategorias) {
            categoria.subcategorias.forEach(subcategoria => {
                totalVolumes += subcategoria.volumes?.length || 0;
            });
        }
        if (categoria.volumes) {
            totalVolumes += categoria.volumes.length;
        }
        
        const volumes = document.createElement('p');
        volumes.textContent = `${totalVolumes} volumes`;
        card.appendChild(volumes);

        // Adicionar status dos volumes
        let volumesAdquiridos = 0;
        let volumesFaltando = 0;
        
        // Conta volumes adquiridos e faltando em subcategorias
        if (categoria.subcategorias) {
            categoria.subcategorias.forEach(subcategoria => {
                if (subcategoria.volumes) {
                    const adquiridos = subcategoria.volumes.filter(v => v.status === 'Adquirido').length;
                    const faltando = subcategoria.volumes.filter(v => v.status === 'Falta').length;
                    volumesAdquiridos += adquiridos;
                    volumesFaltando += faltando;
                }
            });
        }
        
        // Conta volumes adquiridos e faltando nos volumes diretos
        if (categoria.volumes) {
            const adquiridos = categoria.volumes.filter(v => v.status === 'Adquirido').length;
            const faltando = categoria.volumes.filter(v => v.status === 'Falta').length;
            volumesAdquiridos += adquiridos;
            volumesFaltando += faltando;
        }

        const statusAdquiridos = document.createElement('p');
        statusAdquiridos.textContent = `${volumesAdquiridos} volumes adquiridos`;
        statusAdquiridos.className = 'status adquirido';
        card.appendChild(statusAdquiridos);

        const statusFaltando = document.createElement('p');
        statusFaltando.textContent = `${volumesFaltando} volumes faltando`;
        statusFaltando.className = 'status falta';
        card.appendChild(statusFaltando);

        // Adicionar card ao conteúdo
        content.appendChild(card);
    });
}

// Configurar eventos
function configurarEventos() {
    // Busca
    document.getElementById('searchButton').addEventListener('click', criarCards);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            criarCards();
        }
    });

    // Filtros
    document.getElementById('statusFilter').addEventListener('change', criarCards);
    document.getElementById('sortOrder').addEventListener('change', criarCards);
}

// Inicializar a página
document.addEventListener('DOMContentLoaded', () => {
    calcularEstatisticas();
    configurarEventos();
    criarCards();
});
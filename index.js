const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Rota para manter o servidor acordado
app.get('/', (req, res) => {
    res.send('Servidor do Skip Intro está online!');
});

app.get('/api/pular-abertura/:anilistId/:episodio', async (req, res) => {
    const { anilistId, episodio } = req.params;

    try {
        console.log(`Buscando abertura para Anime ${anilistId}, Episódio ${episodio}...`);

        // Adicionado o &episodeLength=0 que a API exige!
        const urlAniSkip = `https://api.aniskip.com/v2/skip-times/${anilistId}/${episodio}?types=op&types=ed&episodeLength=0`;
        const resposta = await axios.get(urlAniSkip);

        if (resposta.data && resposta.data.found) {
            res.json({
                sucesso: true,
                dados: resposta.data.results
            });
        }

    } catch (erro) {
        if (erro.response && erro.response.status === 404) {
            console.log(`Aviso: Nenhuma abertura encontrada para Anime ${anilistId}, Ep ${episodio}.`);
            res.status(404).json({ 
                sucesso: false, 
                mensagem: "Tempos não encontrados para este episódio." 
            });
        } else {
            console.error("Erro na consulta:", erro.message);
            res.status(500).json({ 
                sucesso: false, 
                erro: "Falha ao se comunicar com o AniSkip." 
            });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor instantâneo rodando na porta ${PORT}`);
});

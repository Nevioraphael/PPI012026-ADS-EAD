import express from 'express';

const host = "0.0.0.0"; //requisições podem vir de todas as interfaces do host local
const porta = 3000; //identifica unica e exclusivamente uma aplicação nesse host
const app = express();

//app.get('/meioponto', (requisicao, resposta)=> {
    //resposta.send("<h1>0,5</h1>");
//});

//Todo o conteúdo do direório Views/public estará disponível na raiz do servidor
app.use(express.static('./Views/public'));

app.use(express.static('./Views/private'));

app.post("/Login", (requisicao, resposta) => {
    //precisa extrair os dados da requisição
    //os dados estão armazenados no corpo da requisição
    const dados = requisicao.body;
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
}) //javascript aceita funções como parâmetros de outras funções
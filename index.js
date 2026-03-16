import express from 'express';
import autenticar from './seguranca/autenticador.js';
import session from 'express-session';

const host = "0.0.0.0"; //requisições podem vir de todas as interfaces do host local
const porta = 3000; //identifica unica e exclusivamente uma aplicação nesse host
const app = express();
app.use(session({
    secret: 'minh4ch@v&s3cr&t@',
    resave: false, 
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 15 // 15 minutos de sessão
    }
}
));

//HTTP não distingue usuários
//Para que ele tenha a capacidade de identificar usuários, precisamos utilizar cookies de sessão
//Criando uma sessão para cada usuário autenticado

//escolher a biblioteca que irá processar os parâmetros da reposição
//queryString - extended = false
//qs - extended = true
app.use(express.urlencoded({extended: true}));

//Todo o conteúdo do direório Views/public estará disponível na raiz do servidor
app.use(express.static('./Views/public'));

app.post("/login", (requisicao, resposta) => {
    //precisa extrair os dados da requisição
    //os dados estão armazenados no corpo da requisição
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario === "admin" && senha === "123") {
        //atualizar a sessão do usuário
        requisicao.session.usuarioLogado = true;
        resposta.redirect("/menu.html");
    } else {
        resposta.redirect("/login.html");
    }
});

app.get("/login", (requisicao, resposta) => {
    resposta.redirect("/login.html");
});

app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect("/login.html");
});

//middleware
app.use(autenticar,express.static('./Views/private'));

app.listen(porta, host, () => { //arrow function
    console.log(`Servidor rodando em http://${host}:${porta}`);
}) //javascript aceita funções como parâmetros de outras funções
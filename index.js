import express from 'express';
import session from 'express-session';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

const host = "0.0.0.0";
const porta = 3000;
const session_secret = 'minh4ch@v3s3cr3t@';
const session_duration = 1000 * 60 * 15;

const app = express();

// Configuração da sessão
app.use(session({
    secret: session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: session_duration }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // importante para JSON no fetch
app.use(express.static('./Views/public'));

// Configuração do MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'seu_usuario',
    password: 'sua_senha',
    database: 'cadastrodb'
});

// Rotas CRUD
app.get("/usuarios", async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
});

app.post("/usuarios", async (req, res) => {
    const { nome, email } = req.body;
    if (!nome || !email) return res.status(400).json({ erro: "Nome e email obrigatórios." });

    const [result] = await pool.query("INSERT INTO usuarios (nome, email) VALUES (?, ?)", [nome, email]);
    res.json({ mensagem: "Usuário cadastrado!", id: result.insertId });
});

app.put("/usuarios/:id", async (req, res) => {
    const { nome, email } = req.body;
    const id = req.params.id;
    const [result] = await pool.query("UPDATE usuarios SET nome=?, email=? WHERE id=?", [nome, email, id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Usuário não encontrado." });
    res.json({ mensagem: "Usuário atualizado!" });
});

app.delete("/usuarios/:id", async (req, res) => {
    const id = req.params.id;
    const [result] = await pool.query("DELETE FROM usuarios WHERE id=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Usuário não encontrado." });
    res.json({ mensagem: "Usuário removido!" });
});

// Inicialização
app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});
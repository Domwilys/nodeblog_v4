//Impoortação de módulos
const express = require('express');
const app = express();
const cors = require('cors');
const handlebars = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const bodyParser = require('body-parser');
require('./config/auth')(passport);

//Configurações de sessão
app.use(session({
    secret: 'seguedo',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Variáveis globais
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Configurações de Middlewares
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Rotas
const routes = require('./routes/router');
app.use('/', routes);

//Configurações do Handlebars
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,

        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');

//Conexão com o banco de dados
const conn = require('./db/conn');
conn();

//Configurações de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Importação das variáveis de ambiente
require('dotenv').config();

//Port Bind da aplicação
const appPort = process.env.APP_PORT;
app.listen(appPort, () => {
    console.log('Servidor online');
});
const express = require('express');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger.json');

const LoginController = require('./controllers/LoginController');
const UsuarioController = require('./controllers/UsuarioController');

const logger = require('./middlewares/logger');
const jwt = require('./middlewares/jwt');

const AppConstants = require('./enum/AppConstants');

const MongoDBHelper = require('./helpers/MongoDBHelper');

class App {
	// Nessa array todos os controllers ficarão guardados
	#controllers

	// Função principal que dá início a tudo e configura os middlewares (index.js)
	start() {
		this.#setupExpress();
		this.#configureDatabase();
		this.#loadControllers();
		this.#startServer();
	}

	// A configuração do express e os middlewares
	// A configuração urlencoded e json permite os controllers definirem uma rota através do baseController e da instância do express
	#setupExpress = () => {
		this.express = express();

		// Essa linha faz com que o logger possa ser acessado de qualquer lugar do programa, tem acesso ao req e ao res
		this.express.use(logger);

		this.express.use(express.urlencoded({ extended: true }));
		this.express.use(express.json());

		// Essa linha faz com que o jwt possa ser acessado de qualquer lugar do programa, tem acesso ao req e ao res
		this.express.use(jwt);

		this.express.use(`${AppConstants.BASE_API_URL}/docs`,
			swaggerUi.serve,
			swaggerUi.setup(swaggerFile)
		);
	}

	// Conexão com o banco de dados através da connectionstring nesse helper, utiliza o mongoose para usar o método connect()
	#configureDatabase = () => {
		MongoDBHelper.connect();
	}

	// Lista e carrega os controllers do programa
	#loadControllers = () => {
		this.#controllers = [
			new LoginController(this.express),
			new UsuarioController(this.express)
		];
	}

	// Método principal que sobe o programa em uma porta definida no .env ou aqui através do método listen do express
	#startServer = () => {
		const port = process.env.EXPRESS_PORT || 3001;
		this.express.listen(port, () => {
			console.log(`Aplicação executando na porta ${port}`);
		});
	}
}

module.exports = App;


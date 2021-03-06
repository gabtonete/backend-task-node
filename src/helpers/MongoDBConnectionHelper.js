const mongoose = require('mongoose');


class MongoDBConnectionHelper {
    // define um método estatico que faz a conexão com o mongodb
    // como o método é estatico eu não preciso instânciar o objeto para usar
    static conectar() {
        // faz efetivamente a conexão com o mongodb
        const conexao = mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // quando a conexão for realizada com sucesso, ele vai mostrar a mensagem de sucesso
        mongoose.connection.on('connected', () => console.log('Conectado ao mongodb'));

        // se der algum erro na conexão, ele vai mostrar a mensagem de erro
        mongoose.connection.on('error', e => console.error('Erro ao conectar com o mongodb', e.message));

        return conexao;
    }
}

const five_minutes = 60000 * 5

async function dropCollections() {
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
        await collection.remove()
        console.log("Coleção removida");
  }
}

setInterval(dropCollections, five_minutes);

module.exports = MongoDBConnectionHelper;
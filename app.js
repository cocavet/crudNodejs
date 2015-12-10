    
    
    // ======================================================================================
    // 1. DEPENDENCIAS Y ENTORNO
    // ======================================================================================

        // Dependencias de la app
        // --------------------------------------------------------

            var express     = require('express'),
                routes      = require('./routes'),
                http        = require('http'),
                path        = require('path'),
                bodyParser  = require('body-parser'),
                favicon     = require('serve-favicon'),
                mongoose    = require('mongoose');

            var app = express();

            app.locals.moment = require('moment');


        // Comprobamos si hay conexión con la BBDD
        // --------------------------------------------------------

            mongoose.connect('mongodb://localhost/guillem', function (err) {
                if (!err) {
                    console.log('conectado a MongoDB');
                } else {
                    throw err;
                }
            });


        // Definimos nuestro entorno de trabajo
        // ---------------------------------------------------------------

            app.set('port', process.env.PORT || 3000); // Nuestro puerto
            app.set('views', __dirname + '/main'); // Archivos jade
            app.set('view engine', 'jade'); // Tipo de docs (html,jade,...)
            app.use(express.logger('dev'));
            app.use(bodyParser.urlencoded({ // Permite ratrear dentro del doc
                extended: true
            }));
            app.use(bodyParser.json());
            app.use(express.cookieParser());
            app.use(express.session({secret: 'OZhCLfxlGp9TtzSXmJtq'}));
            app.use(express.methodOverride());
            app.use(app.router);
            app.use(express.static(path.join(__dirname, 'src'))); // Dirección de nuestros src
            app.use(favicon(__dirname + '/src/img/favicon.ico'));


    // ======================================================================================
    // 2. SCHEMAS
    // ======================================================================================

        // Oferta
        // --------------------------------------------------------

            var Schema = mongoose.Schema;
            var ObjectId = Schema.ObjectId;

            var Oferta = new Schema({
                titulo: String,
                descripcion: String,
                categoria: String,
                fechaInit: Date,
                fechaFin: Date,
                empresa: String,
                direccion: String
            });

            var Oferta = mongoose.model('Oferta', Oferta);


    // ======================================================================================
    // 3. FUNCIONES
    // ======================================================================================


        // Recogemos los datos de la BBDD y printamos resultados
        // ---------------------------------------------------------------

            app.get('/', function(req,res){
                Oferta.find({}, function (err, docs) {
                    
                    res.render('index.jade', {
                        title: 'Todas las ofertas',
                        docs: docs
                    });
              });
            });


        // Renderizamos una nueva entrada en nueva.jade
        // ---------------------------------------------------------------

            app.get('/nueva', function(req, res){
                res.render('nueva.jade', {
                    title: 'Nueva oferta'
                });
            });


        // Obtenemos los datos de la nueva entrada y si se insertaron lo enviamos a la home
        // --------------------------------------------------------------------------------

            app.post('/nuevaoferta', function(req,res){

                var nuevaOferta = new Oferta(req.body.oferta);

                nuevaOferta.save(function (err) {
                    if (!err) {
                        res.redirect('/?valid=true');
                    }
                    else {
                        res.redirect('/?valid=false');
                    }
                });

            });

        // Pantalla de editar contenidos
        // ---------------------------------------------------------------

            app.get('/:id/editar', function(req, res){

                Oferta.findById(req.params.id, function (err, docs){
                    console.log(docs);
                    res.render('editar.jade', {
                        title: 'Editar oferta',
                        docs: docs
                    });

                });

            });

        // Pantalla de editar contenidos
        // ---------------------------------------------------------------

            app.put('/:id', function(req, res){
                Oferta.findById(req.params.id, function (err, doc){
                        doc.updated_at = new Date();
                        doc.titulo = req.body.oferta.titulo;
                        doc.descripcion = req.body.oferta.descripcion;
                        doc.categoria = req.body.oferta.categoria;
                        doc.fechaFin = req.body.oferta.fechaFin;
                        doc.empresa = req.body.oferta.empresa;
                        doc.direccion = req.body.oferta.direccion;
                        doc.save(function(err) {
                        if (!err){
                            res.redirect('/');
                        }
                        else {
                            console.log(err);
                        }
                    });
                });
            });

        // Borrar contenidos
        // ---------------------------------------------------------------

            app.del('/:id', function(req, res){
                Oferta.findOne({ _id: req.params.id }, function(err, doc) {
                    doc.remove(function() {
                        res.redirect('/');
                    });
                });
            });



    // ======================================================================================
    // 4. PUERTO CONEXIÓN
    // ======================================================================================

        // Conectamos con el puerto
        // ---------------------------------------------------------------

            http.createServer(app).listen(app.get('port'), function(){
            console.log('Run on port ' + app.get('port'));
            });

const express = require('express');
const { Router } = express;
const { engine } = require('express-handlebars');

const app = express();
const products = Router();
const port = 8080;

app.engine(
   'hbs', 
   engine({
      extname: '.hbs',
      defaultLayout: 'index.hbs',
      layoutsDir: __dirname + '/views/layouts/',
      partialsDir: __dirname + '/views/partials'
}));

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

const productsList = [{
   id: 'prueba',
   product: 'prueba',
   price: 'xxx',
   img: 'https://cdn1.iconfinder.com/data/icons/space-flat-galaxy-radio/512/starship-256.png',
}];

const listShow = true;
const formShow = true;


products.get('/', (req, res) => {
   if(productsList.length === 0){
      res.send(` Aún no hay productos cargados`)
   } else {res.render('main', {productsList:productsList, listExist: listShow })}
   ;
});

products.get('/:id', (req, res) => {
   const { id } = req.params;
   const found = productsList.find(product => product.id === id);

   if(found){
      res.send(found);
   }else {
      res.send('El producto no existe');
   };
});

products.post('/', (req, res) => {
   const generateNewId = () =>{
      let idIndex = Math.floor(Math.random() * 9999) +1;
      if (Object.keys(productsList).includes(idIndex) == idIndex) {
          idIndex = generateNewId();
      };
      return idIndex;
   };
    const product = {
         id: generateNewId(),
         product: req.body.item,
         price: req.body.price,
         img: req.body.imgUrl
    };
    productsList.push(product);  
    res.render('main', {formExist: formShow });
 });

products.put('/:id', (req, res) => {
   const { id } = req.params;
   const changes = req.body;

   const index = productsList.findIndex(product => product.id === id)
   
   if( index !== -1) {
      productsList[index] = changes;
      res.send(productsList[index]);
   }else {
      res.send('No existe producto con ese ID')
   };
 });

products.delete('/:id', (req, res) => {

  const { id } = req.params;
  const deleted = productsList.find(product => product.id === id);
  if(deleted){
     productsList = productsList.filter(product => product.id === id);
     res.send(`Se ha eliminado correctamente el siguiente producto: ${deleted}`)
  } else {
     res.send('El id ingresado no coincide con ningún producto');
  };
 });

app.set('view engine', 'hbs');
app.set('views', './views');

app.use('/products', products);

app.set('view engine', 'hbs');
app.set('views', './views');

app.listen(port, () => {
   console.log(`Escuchando en esta uri http://localhost: ${port}`)
});

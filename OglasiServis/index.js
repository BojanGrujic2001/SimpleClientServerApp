var express=require('express');
var oglasimodul=require('oglasmodul');
var app=express();
const port=3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/',(request, response)=>{
    response.send("Server OGLASI radi");
});

app.get('/svioglasi',(request, response)=>{
    response.send(oglasimodul.listaOglasa)
});

app.post('/dodajoglas',(request,response)=>{
    oglasimodul.dodajOglas(request.body)
    response.end("OK")
})

app.delete('/obrisioglas/:id',(request, response)=>{
    oglasimodul.izbrisiOglas(request.params["id"]);
    response.end("OK");
});

app.get('/getoglasbyid/:id',(request, response)=>{
    response.send(oglasimodul.vratiOglasZaId(request.params["id"]));
})

app.get('/filtrirajPoKategoriji',(request,response)=>{
    response.send(oglasimodul.filtrirajOglase(request.query["kat"]))
})



app.listen(port,()=>{console.log(`startovan server na portu ${port}`)});















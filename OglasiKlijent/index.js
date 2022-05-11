const express = require("express");
const fs=require("fs");
const app = express();
const path = require('path');
const axios = require('axios');
const port = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let procitajPogledZaNaziv=(naziv)=>{
    return fs.readFileSync(path.join(__dirname+"/stranice/"+naziv+".html"),"utf-8")
}

app.get("/",(req,res)=>{
    res.send(procitajPogledZaNaziv("index"));
});

app.get("/oglasi",(req,res)=>{
    axios.get('http://localhost:3000/svioglasi').then(response=>{
        let prikaz="";
        response.data.forEach(element=>{
            prikaz+=`<tr>
            <td>${element.ID}</td>
            <td>${element.Kategorija}</td>
            <td>${element.Datum}</td>
            <td>${element.Cena.Valuta}</td>
            <td>${element.Cena.Vrednost}</td>
            <td>${element.Tekst}</td>
            <td>${element.Oznaka}</td>
            <td>${element.Email[0].Email}</td>
            <td><a href="/izmeni/${element.ID}">Izmeni</a></td>
            <td><a href="/obrisi/${element.ID}">Obrisi</a></td>
            </tr>`
        })
        res.send(procitajPogledZaNaziv('oglasi').replace("#{data}",prikaz))
    })
    .catch(error=>{
        console.log(error)
    })
})

app.post("/filtriraj",(req,res)=>{
    axios.get(`http://localhost:3000/filtrirajPoKategoriji?kat=${req.body.filter}`).then(response=>{
        let prikaz=""
        response.data.forEach(element=>{
            prikaz+=`<tr>
            <td>${element.ID}</td>
            <td>${element.Kategorija}</td>
            <td>${element.Datum}</td>
            <td>${element.Cena.Valuta}</td>
            <td>${element.Cena.Vrednost}</td>
            <td>${element.Tekst}</td>
            <td>${element.Oznaka}</td>
            <td>${element.Email[0].Email}</td>
            <td><a href="/izmeni/${element.ID}">Izmeni</a></td>
            <td><a href="/obrisi/${element.ID}">Obrisi</a></td>
            </tr>`
        })
        res.send(procitajPogledZaNaziv('oglasi').replace("#{data}",prikaz))
    })
    .catch(error=>{
        console.log(error)
    })
})

app.get("/obrisi/:id",(req,res)=>{
    axios.delete(`http://localhost:3000/obrisioglas/${req.params["id"]}`)
    res.redirect("/oglasi");
});

app.get("/dodajoglas",(req,res)=>{
    res.send(procitajPogledZaNaziv("dodavanjeoglasa"));
});

app.post("/snimioglas",(req,res)=>{
    axios.post("http://localhost:3000/dodajoglas",{
        ID:0,
        Kategorija:req.body.kat,
        Datum:req.body.vreme,
        Cena:{
            Valuta:req.body.valuta,
            Vrednost:req.body.cena
        },
        Tekst:req.body.text,
        Oznaka:[
            req.body.Oznake
        ],
        Email:[{
            tip:req.body.tipemail,
            Email:req.body.email
        }]
    })
    res.redirect("/oglasi");
})



app.listen(port,()=>{console.log(`klijent na portu ${port}`)});
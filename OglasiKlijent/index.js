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




app.get("/izmeni/:id",(req,res)=>{
    axios.get(`http://localhost:3000/getoglasbyid/${req.params["id"]}`).then(response=>{
      
            let prikaz=`<label>Izaberite Kategoriju Proizvoda Za Izmenu</label>
            <br>
            <input type="number" name="id" value=${response.data.ID} hidden>
            <br>
            <select name="kat">
                <option value="${response.data.Kategorija}">${response.data.Kategorija}</option>
                <option value="automobili">automobili</option>
                <option value="stanovi">stanovi</option>
                <option value="alati">alati</option>
                <option value="elektronika">elektronika</option>
                <option value="telefoni">telefoni</option>
            </select>
            <br>
            <br>
            <input type="date" name="vreme" value=${response.data.Datum}>
            <br>
            <br>
            <input type="number" name="cena" value=${response.data.Cena.Vrednost}>
            <select name="valuta">
                <option value="RSD">RSD</option>
                <option value="EUR">EUR</option>
                <option value="AUD">AUD</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="BAM">BAM</option>
            </select>
            <br>
            <br>
            <input type="text" name="text" value=${response.data.Tekst}>
            <br>
            <br>
            <input type="text" name="Oznake" value=${response.data.Oznaka[0]}>
            <br>
            <br>
            <input type="text" name="email" value=${response.data.Email[0].Email}>
            <select name="tipemail">
                <option value="privatni">Privatni</option>
                <option value="sluzbeni">Sluzbeni</option>
            </select>
            <br>
            <br>`
        res.send(procitajPogledZaNaziv('izmena').replace("#{data}",prikaz))
    })
    .catch(error=>{
        console.log(error)
    })
});

app.post("/izmeniOglas",(req,res)=>{
    axios.post("http://localhost:3000/izmeniOglas",{
        ID:req.body.id,
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
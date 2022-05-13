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
            <td>${element.Oznaka[0].oz}<br>${element.Oznaka[1].oz}<br>${element.Oznaka[2].oz}<br>${element.Oznaka[3].oz}</td>
            <td>${element.Email[0].Email}<br>${element.Email[1].Email}</td>
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
            <td>${element.Oznaka[0].oz}<br>${element.Oznaka[1].oz}<br>${element.Oznaka[2].oz}<br>${element.Oznaka[3].oz}</td>
            <td>${element.Email[0].Email}<br>${element.Email[1].Email}</td>
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
        Oznaka:[{oz:req.body.Oznake1},
            {oz:req.body.Oznake2},
            {oz:req.body.Oznake3},
            {oz:req.body.Oznake4}
        ],
        Email:[{
            tip:req.body.tipemail1,
            Email:req.body.email1
        },
        {
            tip:req.body.tipemail2,
            Email:req.body.email2
        }]
    })
    res.redirect("/oglasi");
})




app.get("/izmeni/:id",(req,res)=>{
    axios.get(`http://localhost:3000/getoglasbyid/${req.params["id"]}`).then(response=>{
      
            let prikaz=`<label>Izaberite Kategoriju Proizvoda</label>
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
            <label for="">Unesite Datum Isteka Oglasa</label>
            <br>
            <input type="date" name="vreme" value=${response.data.Datum} required>
            <br>
            <br>
            <label for="">Unesite Cenu</label>
            <br>
            <input type="number" name="cena" value=${response.data.Cena.Vrednost}  min="1" required>
            <select name="valuta">
                <option value="${response.data.Cena.Valuta}">${response.data.Cena.Valuta}</option>
                <option value="RSD">RSD</option>
                <option value="EUR">EUR</option>
                <option value="AUD">AUD</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="BAM">BAM</option>
            </select>
            <br>
            <br>
            <label for="">Unesite Tekst Oglasa</label>
            <br>
            <input type="text" name="text" value=${response.data.Tekst} required>
            <br>
            <br>
            <label for="">Unesite Oznake</label>
            <br>
            <input type="text" name="Oznake1" value=${response.data.Oznaka[0].oz}>
            <br>
            <br>
            <input type="text" name="Oznake2" value=${response.data.Oznaka[1].oz}>
            <br>
            <br>
            <input type="text" name="Oznake3" value=${response.data.Oznaka[2].oz}>
            <br>
            <br>
            <input type="text" name="Oznake4" value=${response.data.Oznaka[3].oz}>
            <br>
            <br>
            <label for="">Unesite Vasu Email Adresu</label>
            <br>
            <input type="text" name="email1" value=${response.data.Email[0].Email} required>
            <select name="tipemail1">
                <option value="${response.data.Email[0].tip}">${response.data.Email[0].tip}</option>
                <option value="privatni">Privatni</option>
                <option value="sluzbeni">Sluzbeni</option>
            </select>
            <br>
            <br>
            <input type="text" name="email2" value=${response.data.Email[1].Email}>
            <select name="tipemail2">
                <option value="${response.data.Email[1].tip}">${response.data.Email[1].tip}</option>
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
        ID:parseInt(req.body.id),
        Kategorija:req.body.kat,
        Datum:req.body.vreme,
        Cena:{
            Valuta:req.body.valuta,
            Vrednost:req.body.cena
        },
        Tekst:req.body.text,
        Oznaka:[{oz:req.body.Oznake1},
            {oz:req.body.Oznake2},
            {oz:req.body.Oznake3},
            {oz:req.body.Oznake4}
        ],
        Email:[{
            tip:req.body.tipemail1,
            Email:req.body.email1
        },
        {
            tip:req.body.tipemail2,
            Email:req.body.email2
        }]
    })
    res.redirect("/oglasi");
})

app.listen(port,()=>{console.log(`klijent na portu ${port}`)});
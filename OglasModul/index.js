const fs=require('fs')
const PATH='../oglasi.json'

exports.listaOglasa=procitajJSON()

function procitajJSON(){
    return JSON.parse(fs.readFileSync(PATH,(err,data)=>{
        if(err) throw err
        return data
    }).toString())
}

let snimiIzmene=(data)=>{
    fs.writeFileSync(PATH,JSON.stringify(data,null,4))
}

exports.vratiOglasZaId=(ID)=>{
    return this.listaOglasa.find(n=>n.ID==ID)
}

exports.izbrisiOglas=(ID)=>{
    snimiIzmene(this.listaOglasa=this.listaOglasa.filter(f=>f.ID!=ID))
}

exports.dodajOglas=(novOglas)=>{
    let id=0
    if(this.listaOglasa.length>0){
        id=this.listaOglasa[this.listaOglasa.length-1].ID+1
    }
    novOglas.ID=id
    this.listaOglasa.push(novOglas)
    snimiIzmene(this.listaOglasa)
}

exports.filtrirajOglase=(kat)=>{
    return this.listaOglasa.filter(f=>f.Kategorija==kat)
}

exports.promeniOglas = (oglas) => {
    this.listaOglasa[this.listaOglasa.findIndex(o => o.ID == oglas.ID)] = oglas
    snimiIzmene(this.listaOglasa)
}

let ogat=
    {
        "ID":0,
        "Kategorija": "alati",
        "Datum": "2022-05-21",
        "Cena": {
            "Valuta":"RSD",
            "Vrednost":500.00
        },
        "Tekst": "metla",
        "Oznaka": [
            1,
            "120mm"
        ],
        "Email": [
            {
                "tip":"Sluzbeni",
                "Email":"grujic@gmail.com"
            }
        ]
    }


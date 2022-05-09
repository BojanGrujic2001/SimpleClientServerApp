const fs = require('fs')
const xmlPath='../oglasi.xml'
const xsdPath='../oglasi.xsd'
const dtdPath='../oglasi.dtd'
const xml2js=require('xml2js')

let oglasi=[]

class Oglas{
    constructor(id,kategorija,datum,Cena,tekst,Oznaka,Email){
        this.id=id
        this.kategorija=kategorija
        this.datum=datum
        this.Cena=Cena
        this.tekst=tekst
        this.Oznaka=Oznaka
        this.Email=Email
    }
}

class Cena{
    constructor(cena,valuta){
        this.cena=cena
        this.valuta=valuta
    }
}

class Oznaka{
    constructor(vrednost,atribut){
        this.vrednost=vrednost
        this.atribut=atribut
    }
}

class Email{
    constructor(adresa,tip){
        this.adresa=adresa
        this.tip=tip
    }
}


function procitajXml(){
    let xmlOglasi
    let xml = fs.readFileSync(xmlPath, (err, data) => {
        if (err) throw err
        return data
    }).toString()

    console.log(xml)

    xml2js.parseString(xml,(err,res)=>{
        if(err) throw err
        xmlOglasi=res['Oglasi']['Oglas']
    })

    for (let oglas of xmlOglasi){
       console.log(oglas.Datum[0])
    }

}


procitajXml()







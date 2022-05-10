const fs=require('fs')
const PATH='../oglasi.json'

exports.listaOglasa=procitajJSON()

function procitajJSON(){
    return JSON.parse(fs.readFileSync(PATH,(err,data)=>{
        if(err) throw err
        return data
    }).toString())
}

exports.vratiOglasZaId=(ID)=>{
    return this.listaOglasa.find(n=>n.ID==ID)
}

exports.izbrisiOglas=(ID)=>{
    return this.listaOglasa=this.listaOglasa.filter(f=>f.ID!=ID)
}

exports.dodajOglas=(novOglas)=>{
    let id=0
    if(this.listaOglasa.length>0){
        id=this.listaOglasa[this.listaOglasa.length-1].ID+1
    }
    novOglas.ID=id
    this.listaOglasa.push(novOglas)
}


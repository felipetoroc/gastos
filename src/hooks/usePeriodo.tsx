import {useState} from 'react';

export const usePeriodo = (dia:any) => {

    const [diapago, setDiapago] = useState(dia)


    var fechaPago = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    var fechaActual = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    var fechaIni = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    var fechaFin = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    
    if(diapago !== ''){
        fechaPago.setDate(diapago)
    }else{
        fechaPago.setMonth(fechaPago.getMonth()+1)
        fechaPago.setDate(1)
    }
       
    if(fechaActual>fechaPago){
        fechaFin.setMonth(fechaPago.getMonth()+1)
        fechaFin.setDate(fechaPago.getDate())
        fechaIni = fechaPago
    }else{
        fechaFin = fechaPago
        fechaIni.setMonth(fechaPago.getMonth()-1)
        fechaIni.setDate(fechaPago.getDate())
    }
    return [diapago,fechaPago,fechaIni,fechaFin,setDiapago]
}
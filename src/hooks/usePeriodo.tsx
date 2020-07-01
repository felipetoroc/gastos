import {useState} from 'react';

export const usePeriodo = (dia:any,num:any) => {

    const [diapago, setDiapago] = useState(dia)
    const [numPeriodo, setNumPeriodo] = useState(num)

    var fechaPago = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    var fechaActual = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    var fechaIni = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    var fechaFin = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    
    if(diapago !== ''){
        fechaPago.setMonth(fechaPago.getMonth()+numPeriodo)
        fechaPago.setDate(diapago)
    }else{
        fechaPago.setMonth(fechaPago.getMonth()+1+numPeriodo)
        fechaPago.setDate(1)
    }
    
       
    if(fechaActual>=fechaPago){
        fechaFin = new Date(fechaPago.getFullYear(), fechaPago.getMonth()+1, fechaPago.getDate())
        fechaIni = fechaPago
    }else{
        fechaFin = fechaPago
        fechaIni = new Date(fechaPago.getFullYear(), fechaPago.getMonth()-1, fechaPago.getDate())
    }
    return [diapago,fechaPago,fechaIni,fechaFin,setDiapago,setNumPeriodo]
}
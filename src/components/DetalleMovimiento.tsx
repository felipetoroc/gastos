import {IonLabel,IonItem, IonList, IonItemDivider} from '@ionic/react';
import React, {useState, useEffect} from 'react';
import './DetalleMovimiento.css';


const DetalleMovimiento: React.FC<any> = (props) => {
    const [movimiento, setMovimiento] = useState({
        fecha:'',
        tipo_moneda: '',
        categoria: '',
        descripcion: '',
        cuotas: '',
        tipo_movimiento: '',
        monto: 0
    });
    
    useEffect(()=>{
        setMovimiento(props.data.movimiento)
    },[])
    return (
        
        <>
            <IonList>
                <IonItemDivider>
                    <IonLabel>Fecha:</IonLabel>
                </IonItemDivider>
                <IonItem>
                    <IonLabel>{movimiento.fecha}</IonLabel>
                </IonItem>
                <IonItemDivider>
                    <IonLabel>Moneda:</IonLabel>
                </IonItemDivider>
                <IonItem>
                    <IonLabel>{movimiento.tipo_moneda}</IonLabel>
                </IonItem>
                <IonItemDivider>
                    <IonLabel>Categoría:</IonLabel>
                </IonItemDivider>
                <IonItem>    
                    <IonLabel>{movimiento.categoria}</IonLabel>
                </IonItem>
                <IonItemDivider>
                    <IonLabel>Descripción:</IonLabel>
                </IonItemDivider>
                <IonItem> 
                    <IonLabel>{movimiento.descripcion}</IonLabel>
                </IonItem>
                <IonItemDivider>
                    <IonLabel>Cuotas:</IonLabel>
                </IonItemDivider>
                <IonItem>  
                    <IonLabel>{movimiento.cuotas}</IonLabel>
                </IonItem>
                <IonItemDivider>
                    <IonLabel>Monto:</IonLabel>
                </IonItemDivider>
                <IonItem>
                    <IonLabel>{movimiento.tipo_movimiento==="gasto"?<span style={{color:"red"}}>-{Math.round(movimiento.monto)}</span >:<span style={{color:"green"}}>{Math.round(movimiento.monto)}</span>}</IonLabel>
                </IonItem>
            </IonList>             
        </>
        
    )
};

export default DetalleMovimiento;
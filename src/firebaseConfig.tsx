import firebase from 'firebase/app';
import 'firebase/firestore'
import {useState} from 'react'
import { IonLabel } from '@ionic/react';



const firebaseConfig = {
    apiKey: "AIzaSyABrLqUG3wIcAnelM5kv4MLJDnebu5kng8",
    authDomain: "gastos-432ba.firebaseapp.com",
    databaseURL: "https://gastos-432ba.firebaseio.com",
    projectId: "gastos-432ba",
    storageBucket: "gastos-432ba.appspot.com",
    messagingSenderId: "563903591657",
    appId: "1:563903591657:web:3a46c9efb2a3f862842c78"
  };

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore()

export function eliminar(id: string ,coleccion: string) {
  db.collection(coleccion).doc(id).delete();
}

export function agregar(data: any,coleccion: string){
  try{
      var docid = db.collection(coleccion).doc();
      docid.set(data)
      return docid.id;
  }catch(error){
    console.log(error)
  }
}

export function actualizar(data: any,coleccion: string, id: string){
  try{
    db.collection(coleccion).doc(id).set(data);
  }catch(error){
    console.log(error)
  }
}


//aun no funciona del todo
export function mostrar(coleccion: string){
  db.collection(coleccion).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        if(doc.exists){
          console.log(doc.id, " => ", doc.data());
        }else{
          console.log("no hay info seteada")
        }
        
    });
  });
}


export function totalGastos(coleccion: string):any {
   db.collection(coleccion).get().then(function(querySnapshot){
    var suma = 0;
    querySnapshot.forEach(function(doc) {
      suma = suma + parseInt(doc.data().gasto_monto)
    });
    
  });
  return
}








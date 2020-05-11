import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
import {useState} from 'react'
import { IonLabel } from '@ionic/react';
import { resolve } from 'url';



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


export async function login(correo: string, password: string){
  try{
    const res = await firebase.auth().signInWithEmailAndPassword(correo,password)
    console.log(res)
    return true
  }catch(error){
    console.log(error)
    return false
  }
}

export function logout(){
    return firebase.auth().signOut()
}

export async function regin(correo: string, password: string){
  try{
    const res = await firebase.auth().createUserWithEmailAndPassword(correo,password)
    return true;
  }catch(error){
    return false
  }
  
}

export const auth = firebase.auth()
export const db = firebase.firestore()

export function eliminar(id: string ,coleccion: string,uid:string) {
  db.collection("usersData").doc(uid).collection(coleccion).doc(id).delete();
}

export function agregar(data: any,coleccion: string,uid: string){
  try{
      var docid = db.collection("usersData").doc(uid).collection(coleccion).doc();
      docid.set(data)
      return docid.id;
  }catch(error){
    console.log(error)
  }
}

export function actualizar(data: any,coleccion: string, id: string,uid:string){
  try{
    db.collection("usersData").doc(uid).collection(coleccion).doc(id).set(data);
  }catch(error){
    console.log(error)
  }
}


//aun no funciona del todo
export async function mostrar(coleccion: string,uid:string){
  return new Promise((resolve,reject)=>{
    const data = db.collection("usersData").doc(uid).collection(coleccion).onSnapshot(function(querySnapshot) {
          if(querySnapshot){
            resolve(querySnapshot)
          }else{
            resolve(null)
          }
          data()
    });
  })
}


export function totalGastos(coleccion: string):any {
   db.collection(coleccion).get().then(function(querySnapshot){
    var suma = 0;
    querySnapshot.forEach(function(doc) {
      suma = suma + parseInt(doc.data().mov_monto)
    });
    
  });
  return
}








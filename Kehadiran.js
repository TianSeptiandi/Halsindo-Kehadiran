import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
getDatabase,
ref,
push,
onValue,
remove,
update
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

// FIREBASE
const app = initializeApp({

apiKey: "AIzaSyBH9fdaDioSIBohv04Nwn5UsB-Wh8Q8AaU",

authDomain: "latihan2-ba4c5.firebaseapp.com",

databaseURL:
"https://latihan2-ba4c5-default-rtdb.firebaseio.com",

projectId: "latihan2-ba4c5",

storageBucket:
"latihan2-ba4c5.firebasestorage.app",

messagingSenderId:
"515994512533",

appId:
"1:515994512533:web:7bdd166157ac92f398ff9c"

});

const db = getDatabase(app);

// ELEMEN
const tanggal =
document.getElementById("tanggal");

const jam =
document.getElementById("jam");

const nama =
document.getElementById("nama");

const status =
document.getElementById("status");

const lembur =
document.getElementById("lembur");

const foto =
document.getElementById("foto");

const lokasi =
document.getElementById("lokasi");

const simpan =
document.getElementById("simpan");

const daftar =
document.getElementById("daftar");

const mode =
document.getElementById("mode");

const dataRef =
ref(db, "Kehadiran");

let editKey = null;

// =======================
// JAM HIDUP
// =======================

function updateJam(){

const now = new Date();

jam.value =
String(now.getHours()).padStart(2,"0")
+ ":" +
String(now.getMinutes()).padStart(2,"0")
+ ":" +
String(now.getSeconds()).padStart(2,"0");

}

setInterval(updateJam,1000);

updateJam();

// =======================
// AMBIL LOKASI
// =======================

window.ambilLokasi = function(){

if(!navigator.geolocation){

alert("GPS tidak didukung");

return;

}

navigator.geolocation.getCurrentPosition(

(pos)=>{

const lat = pos.coords.latitude;

const long = pos.coords.longitude;

lokasi.value =
"https://www.google.com/maps?q="
+ lat + "," + long;

alert("Lokasi berhasil");

},

(err)=>{

alert("Lokasi gagal diambil");

}

);

}

// =======================
// SIMPAN DATA
// =======================

simpan.onclick = () => {

if(
tanggal.value == "" ||
nama.value == ""
){

alert("Lengkapi data");

return;

}

// FOTO ADA
if(foto.files.length > 0){

const reader = new FileReader();

reader.onload = function(e){

simpanData(e.target.result);

}

reader.readAsDataURL(
foto.files[0]
);

}

// FOTO TIDAK ADA
else{

simpanData("");

}

}

// =======================
// FUNCTION SIMPAN
// =======================

function simpanData(fotoBase64){

const data = {

tanggal : tanggal.value,
jam : jam.value,
nama : nama.value,
status : status.value,
lembur : lembur.value,
lokasi : lokasi.value,
foto : fotoBase64

};

// TAMBAH
if(editKey == null){

push(dataRef,data);

}

// UPDATE
else{

update(
ref(db,
"Kehadiran/" + editKey),
data
);

editKey = null;

mode.innerText = "";

simpan.innerText =
"Simpan Kehadiran";

}

alert("Data berhasil disimpan");

// RESET
nama.value = "";

status.value = "Hadir";

lembur.value = "Tidak";

lokasi.value = "";

foto.value = "";

}

// =======================
// TAMPIL DATA
// =======================

onValue(dataRef,(snapshot)=>{

daftar.innerHTML = "";

let grup = {};

// GRUPKAN
snapshot.forEach((item)=>{

const data = item.val();

const key = item.key;

if(!grup[data.tanggal]){

grup[data.tanggal] = [];

}

grup[data.tanggal].push({

key:key,
data:data

});

});

// URUTKAN
const urut =
Object.keys(grup).reverse();

urut.forEach((tgl,index)=>{

let jumlah =
grup[tgl].length;

daftar.innerHTML += `

<div class="mt-3">

<div
onclick="toggleData('box${index}')"
style="
background:#1f2937;
color:white;
padding:12px;
border-radius:10px;
cursor:pointer;
display:flex;
justify-content:space-between;
align-items:center;
">

<b>📅 ${tgl}</b>

<span
style="
background:gold;
color:black;
padding:4px 10px;
border-radius:20px;
">

${jumlah} Orang

</span>

</div>

<div
id="box${index}"
style="
display:none;
padding-top:10px;
">

</div>

</div>

`;

const isi =
document.getElementById(
`box${index}`
);

grup[tgl].forEach((item)=>{

const data = item.data;

isi.innerHTML += `

<div
class="card p-2 mb-2 shadow-sm">

<div
style="
display:flex;
justify-content:space-between;
gap:10px;
flex-wrap:wrap;
">

<div>

<b>${data.nama}</b>

<br>

🕒 ${data.jam}

<br>

📌 ${data.status}

<br>

⏰ OT :
${data.lembur}

</div>

${
data.foto
?
`
<img
src="${data.foto}"
style="
width:90px;
height:90px;
object-fit:cover;
border-radius:10px;
">
`
:
""
}

</div>

<br>

<div
style="
display:flex;
gap:5px;
flex-wrap:wrap;
">

${
data.lokasi
?
`
<a
href="${data.lokasi}"
target="_blank"
class="btn btn-success btn-sm">

Maps

</a>
`
:
""
}

<button
onclick="editData(
'${item.key}',
'${data.tanggal}',
'${data.nama}',
'${data.status}',
'${data.lembur}',
'${data.lokasi}'
)"
class="btn btn-warning btn-sm">

Edit

</button>

<button
onclick="hapusData('${item.key}')"
class="btn btn-danger btn-sm">

Hapus

</button>

</div>

</div>

`;

});

});

});

// =======================
// TOGGLE
// =======================

window.toggleData = function(id){

const box =
document.getElementById(id);

if(box.style.display == "none"){

box.style.display = "block";

}

else{

box.style.display = "none";

}

}

// =======================
// HAPUS
// =======================

window.hapusData = function(key){

let yakin =
confirm("Hapus data?");

if(yakin){

remove(
ref(db,
"Kehadiran/" + key)
);

}

}

// =======================
// EDIT
// =======================

window.editData = function(
key,
tgl,
nm,
sts,
lbr,
lok
){

tanggal.value = tgl;

nama.value = nm;

status.value = sts;

lembur.value = lbr;

lokasi.value = lok;

editKey = key;

mode.innerText =
"Mode Edit";

simpan.innerText =
"Update Kehadiran";

}

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

// ====================
// JAM HIDUP
// ====================

function updateJam() {

const sekarang = new Date();

let jamNow =
String(sekarang.getHours())
.padStart(2, "0");

let menitNow =
String(sekarang.getMinutes())
.padStart(2, "0");

let detikNow =
String(sekarang.getSeconds())
.padStart(2, "0");

jam.value =
jamNow + ":" +
menitNow + ":" +
detikNow;

}

setInterval(updateJam, 1000);

updateJam();

// ====================
// AMBIL LOKASI
// ====================

window.ambilLokasi = function() {

if (!navigator.geolocation) {

alert("GPS tidak didukung");

return;

}

navigator.geolocation.getCurrentPosition(

(posisi) => {

const lat =
posisi.coords.latitude;

const long =
posisi.coords.longitude;

lokasi.value =
"https://www.google.com/maps?q="
+ lat + "," + long;

alert("Lokasi berhasil diambil");

},

(error) => {

alert("Gagal mengambil lokasi");

}

);

}

// ====================
// SIMPAN
// ====================

simpan.onclick = () => {

if (
tanggal.value == "" ||
nama.value == ""
) {

alert("Lengkapi data");

return;

}

// FOTO ADA
if (foto.files.length > 0) {

const file = foto.files[0];

const reader = new FileReader();

reader.onloadend = function() {

simpanData(reader.result);

};

reader.readAsDataURL(file);

}

// FOTO TIDAK ADA
else {

simpanData("");

}

};

// ====================
// FUNCTION SIMPAN
// ====================

function simpanData(fotoBase64) {

const data = {

tanggal: tanggal.value,
jam: jam.value,
nama: nama.value,
status: status.value,
lembur: lembur.value,
lokasi: lokasi.value,
foto: fotoBase64

};

// TAMBAH
if (editKey == null) {

push(dataRef, data);

}

// UPDATE
else {

update(
ref(db, "Kehadiran/" + editKey),
data
);

editKey = null;

mode.innerText = "";

simpan.innerText =
"Simpan Kehadiran";

}

alert("Data berhasil disimpan");

// RESET
tanggal.value = "";

nama.value = "";

status.value = "Hadir";

lembur.value = "Tidak";

lokasi.value = "";

foto.value = "";

}

// ====================
// TAMPIL DATA
// ====================

onValue(dataRef, (snapshot) => {

daftar.innerHTML = "";

let grup = {};

// GRUPKAN TANGGAL
snapshot.forEach((item) => {

const data = item.val();

const key = item.key;

if (!grup[data.tanggal]) {

grup[data.tanggal] = [];

}

grup[data.tanggal].push({

key: key,
data: data

});

});

// TAMPILKAN
for (let tgl in grup) {

let jumlahOrang =
grup[tgl].length;

daftar.innerHTML += `

<div class="mt-4">

<h4
class="
bg-dark
text-white
p-2
rounded
d-flex
justify-content-between
align-items-center
">

<span>
Tanggal : ${tgl}
</span>

<span
class="
badge
bg-warning
text-dark
">

${jumlahOrang} Orang

</span>

</h4>

</div>

`;

grup[tgl].forEach((item) => {

const data = item.data;

daftar.innerHTML += `

<div
class="card p-2 mb-2 shadow-sm w-100"
style="
font-size:14px;
">

<b>${data.nama}</b>

<br>

Jam :
${data.jam}

<br>

Status :
${data.status}

<br>

Lembur :
${data.lembur}

<br><br>

${
data.foto
?
`
<img
src="${data.foto}"
style="
width:180px;
height:180px;
object-fit:cover;
border-radius:10px;
border:2px solid #ccc;
margin-bottom:10px;
">
`
:
``
}

<br>

${
data.lokasi
?
`
<a
href="${data.lokasi}"
target="_blank"
class="btn btn-success btn-sm">

Lihat Maps

</a>
`
:
``
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
class="btn btn-warning btn-sm ms-1">

Edit

</button>

<button
onclick="hapusData('${item.key}')"
class="btn btn-danger btn-sm ms-1">

Hapus

</button>

</div>

`;

});

}

});

// ====================
// HAPUS
// ====================

window.hapusData = function(key) {

let yakin =
confirm("Yakin mau hapus data?");

if (yakin) {

remove(
ref(db, "Kehadiran/" + key)
);

}

}

// ====================
// EDIT
// ====================

window.editData = function(
key,
tgl,
nm,
sts,
lbr,
lok
) {

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

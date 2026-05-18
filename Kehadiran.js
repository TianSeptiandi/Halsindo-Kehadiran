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

  projectId: "latihan2-ba4c5",

  storageBucket: "latihan2-ba4c5.firebasestorage.app",

  messagingSenderId: "515994512533",

  appId: "1:515994512533:web:7bdd166157ac92f398ff9c"

});

const db = getDatabase(app);

// ELEMEN
const inputTanggal = document.getElementById("tanggal");

const inputNama = document.getElementById("nama");

const inputStatus = document.getElementById("status");

const inputLembur = document.getElementById("lembur");

const simpan = document.getElementById("simpan");

const daftar = document.getElementById("daftar");

const modeText = document.getElementById("mode");

const dataref = ref(db, "Kehadiran");

let editKey = null;

// SIMPAN
simpan.onclick = () => {

  if (
    !inputTanggal.value ||
    !inputNama.value
  ) {

    alert("Data harus diisi!");

    return;

  }

  // TAMBAH
  if (editKey == null) {

    push(dataref, {

      tanggal: inputTanggal.value,

      nama: inputNama.value,

      status: inputStatus.value,

      lembur: inputLembur.value

    });

  }

  // UPDATE
  else {

    update(ref(db, "Kehadiran/" + editKey), {

      tanggal: inputTanggal.value,

      nama: inputNama.value,

      status: inputStatus.value,

      lembur: inputLembur.value

    });

    editKey = null;

    simpan.innerText = "Simpan";

    modeText.innerText = "";

  }

  // RESET
  inputTanggal.value = "";

  inputNama.value = "";

  inputStatus.value = "Hadir";

  inputLembur.value = "Tidak";

};

// TAMPIL DATA
onValue(dataref, snap => {

  daftar.innerHTML = "";

  let grupTanggal = {};

  snap.forEach(h => {

    const data = h.val();

    const key = h.key;

    if (!grupTanggal[data.tanggal]) {

      grupTanggal[data.tanggal] = [];

    }

    grupTanggal[data.tanggal].push({

      key: key,

      nama: data.nama,

      status: data.status,

      lembur: data.lembur

    });

  });

  // TAMPIL
  for (let tanggal in grupTanggal) {

    daftar.innerHTML += `

      <h4 class="mt-4">

        Tanggal : ${tanggal}

      </h4>

    `;

    grupTanggal[tanggal].forEach(item => {

      daftar.innerHTML += `

      <li class="mb-3">

        <b>Nama :</b> ${item.nama}

        &nbsp;&nbsp;&nbsp;

        <b>Status :</b> ${item.status}

        &nbsp;&nbsp;&nbsp;

        <b>Lembur :</b> ${item.lembur}

        <br><br>

        <button
        class="btn btn-danger btn-sm"
        onclick="hapusData('${item.key}')">

        Hapus

        </button>

        <button
        class="btn btn-warning btn-sm"
        onclick="editData(
          '${item.key}',
          '${tanggal}',
          '${item.nama}',
          '${item.status}',
          '${item.lembur}'
        )">

        Edit

        </button>

      </li>

      `;

    });

  }

});

// HAPUS
window.hapusData = function(key) {

  let yakin = confirm("Yakin mau dihapus?");

  if (yakin) {

    remove(ref(db, "Kehadiran/" + key))

    .then(() => {

      alert("Data berhasil dihapus");

    });

  }

}

// EDIT
window.editData = function(
  key,
  tanggal,
  nama,
  status,
  lembur
) {

  inputTanggal.value = tanggal;

  inputNama.value = nama;

  inputStatus.value = status;

  inputLembur.value = lembur;

  editKey = key;

  simpan.innerText = "Update";

  modeText.innerText = "Mode Edit";

}
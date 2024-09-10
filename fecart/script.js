import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getStorage, ref, uploadBytes } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyDlX7bz5gmMNWAawlWwV1_8Iny2FR0FqjE",
  authDomain: "quickdraw-fce0d.firebaseapp.com",
  projectId: "quickdraw-fce0d",
  storageBucket: "quickdraw-fce0d.appspot.com",
  messagingSenderId: "292914674994",
  appId: "1:292914674994:web:031f03d203b8e7b18e6b2b"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('meuCanvas');
    const ctx = canvas.getContext('2d');
    const limparButton = document.getElementById('limparButton');
    const continuarButton = document.getElementById('continuar');
    const capturarButton = document.getElementById('capturarButton');
    const borrachaButton = document.getElementById('borrachaButton');
    const desenhoButton = document.getElementById('desenhoButton');
    const abaI = document.getElementById('abaI');
    const abaAnterior = document.getElementById('abaAnterior');
    const abaProxima = document.getElementById('abaProxima');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let modoBorracha = false;

    function desenhar(x1, y1, x2, y2) {
        ctx.strokeStyle = modoBorracha ? 'white' : 'black';
        ctx.lineWidth = modoBorracha ? 20 : 5;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        lastX = e.offsetX;
        lastY = e.offsetY;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            desenhar(lastX, lastY, e.offsetX, e.offsetY);
            lastX = e.offsetX;
            lastY = e.offsetY;
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    limparButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    borrachaButton.addEventListener('click', () => {
        modoBorracha = true;
        borrachaButton.style.display = 'none';
        desenhoButton.style.display = 'inline';
    });

    desenhoButton.addEventListener('click', () => {
        modoBorracha = false;
        borrachaButton.style.display = 'inline';
        desenhoButton.style.display = 'none';
    });

    continuarButton.addEventListener('click', () => {
        abaI.style.display = 'none';
        abaAnterior.style.display = 'block';
    });

    const continuarButtonAbaAnterior = document.getElementById('continuarButton');
    continuarButtonAbaAnterior.addEventListener('click', () => {
        abaAnterior.style.display = 'none';
        abaProxima.style.display = 'block';
    });

    capturarButton.addEventListener('click', () => {
        try {
            const dataURL = canvas.toDataURL('image/png');
            const blob = dataURItoBlob(dataURL);
            uploadFile(blob);
        } catch (error) {
            console.error('Error saving image:', error);
        }
    });

    function uploadFile(file) {
        const storageRef = ref(storage, 'desenhos/desenho.png');
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!', snapshot);
        }).catch((error) => {
            console.error('Upload failed', error);
        });
    }

    function dataURItoBlob(dataURI) {
        var byteString = dataURI.split(',')[0].indexOf('base64') >= 0
            ? atob(dataURI.split(',')[1])
            : unescape(dataURI.split(',')[1]);

        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var _ia = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteString.length; i++) {
            _ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([arrayBuffer], { type: mimeString });
    }
});

// script.js
let profile = {};
let results = { sleep: null, diet: null, bmi: null };

document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    profile.name = document.getElementById('name').value;
    profile.gender = document.getElementById('gender').value;
    profile.age = document.getElementById('age').value;
    
    document.getElementById('displayName').textContent = profile.name;
    document.getElementById('displayGender').textContent = profile.gender;
    document.getElementById('displayAge').textContent = profile.age;
    document.getElementById('profileDisplay').style.display = 'block';
    document.getElementById('menu').style.display = 'flex';
});

function showSection(section) {
    document.getElementById('menu').style.display = 'none'; // Sembunyikan menu
    document.querySelectorAll('.check-section').forEach(sec => sec.style.display = 'none');
    document.getElementById(section).style.display = 'block'; // Tampilkan section yang dipilih
}

function backToMenu() {
    document.querySelectorAll('.check-section').forEach(sec => sec.style.display = 'none');
    document.getElementById('menu').style.display = 'flex'; // Tampilkan menu kembali
}

document.getElementById('sleepForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const bedTime = new Date('1970-01-01T' + document.getElementById('bedTime').value);
    const wakeTime = new Date('1970-01-01T' + document.getElementById('wakeTime').value);
    let duration = (wakeTime - bedTime) / (1000 * 60 * 60);
    if (duration < 0) duration += 24;
    
    let quality = duration >= 7 && duration <= 9 ? 'Baik' : duration < 7 ? 'Kurang' : 'Berlebih';
    results.sleep = { duration, quality };
    document.getElementById('sleepResult').innerHTML = `<p>Durasi Tidur: ${duration.toFixed(1)} jam - Kualitas: ${quality}</p><button id="downloadSleepBtn">Unduh PDF</button>`;
    document.getElementById('sleepResult').style.display = 'block';
});

document.getElementById('dietForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const calories = parseInt(document.getElementById('calories').value);
    const foods = document.getElementById('foods').value;
    const idealCalories = profile.gender === 'Laki-laki' ? (profile.age > 30 ? 2200 : 2500) : (profile.age > 30 ? 1800 : 2200);
    let assessment = calories >= idealCalories * 0.8 && calories <= idealCalories * 1.2 ? 'Seimbang' : calories < idealCalories * 0.8 ? 'Kurang' : 'Berlebih';
    results.diet = { calories, foods, assessment };
    document.getElementById('dietResult').innerHTML = `<p>Asupan Kalori: ${calories} - Pola: ${assessment}</p><p>Makanan: ${foods}</p><button id="downloadDietBtn">Unduh PDF</button>`;
    document.getElementById('dietResult').style.display = 'block';
});

document.getElementById('bmiForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100;
    const bmi = weight / (height * height);
    let category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
    results.bmi = { bmi: bmi.toFixed(1), category };
    document.getElementById('bmiResult').innerHTML = `<p>BMI: ${bmi.toFixed(1)} - Kategori: ${category}</p><button id="downloadBmiBtn">Unduh PDF</button>`;
    document.getElementById('bmiResult').style.display = 'block';
    generateTips();
});

function generateTips() {
    if (results.sleep && results.diet && results.bmi) {
        let tips = '<h3>Tips Berdasarkan Hasil Anda:</h3><ul>';
        if (results.sleep.quality !== 'Baik') tips += '<li>Tingkatkan kualitas tidur dengan rutinitas yang konsisten.</li>';
        if (results.diet.assessment !== 'Seimbang') tips += '<li>Seimbangkan asupan kalori dengan makan makanan bergizi.</li>';
        if (results.bmi.category !== 'Normal') tips += '<li>Konsultasikan dengan dokter untuk BMI yang optimal.</li>';
        tips += '<li>Olahraga teratur dan minum air cukup untuk hidup sehat.</li></ul>';
        document.getElementById('tipsContent').innerHTML = tips;
        document.getElementById('tips').style.display = 'block';
    }
}

// Event listeners untuk download PDF masing-masing
document.addEventListener('click', function(e) {
    if (e.target.id === 'downloadSleepBtn') {
        const element = document.getElementById('sleepResult');
        html2pdf().from(element).save('RiseBalance-Sleep-Result.pdf');
    } else if (e.target.id === 'downloadDietBtn') {
        const element = document.getElementById('dietResult');
        html2pdf().from(element).save('RiseBalance-Diet-Result.pdf');
    } else if (e.target.id === 'downloadBmiBtn') {
        const element = document.getElementById('bmiResult');
        html2pdf().from(element).save('RiseBalance-BMI-Result.pdf');
    }
});

document.getElementById('shareBtn').addEventListener('click', function() {
    if (navigator.share) {
        navigator.share({
            title: 'Hasil Cek Kesehatan RiseBalance',
            text: 'Lihat hasil cek kesehatan saya!',
            url: window.location.href
        });
    } else {
        alert('Fitur share tidak didukung di browser ini.');
    }
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    const element = document.getElementById('tips');
    html2pdf().from(element).save('RiseBalance-Tips-Results.pdf');
});

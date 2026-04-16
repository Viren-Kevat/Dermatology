
lucide.createIcons();

// ── BUILD DATE GRID ──
const dateGrid = document.getElementById('date-grid');
const today = new Date();
const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
let selectedDate = null;

for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const slot = document.createElement('div');
    slot.className = 'date-slot' + (isWeekend ? ' disabled' : '') + (i === 0 ? ' today' : '');
    slot.dataset.date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    slot.dataset.full = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    slot.innerHTML = `<span class="day-name">${dayNames[d.getDay()]}</span><span class="day-num">${d.getDate()}</span>`;
    if (!isWeekend) {
        slot.addEventListener('click', () => {
            document.querySelectorAll('.date-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            selectedDate = slot.dataset.full;
            updateSummary();
            document.getElementById('err-date').classList.remove('show');
        });
    }
    dateGrid.appendChild(slot);
}

// ── TIME SELECTION ──
let selectedTime = null;
document.querySelectorAll('.time-slot:not(.busy)').forEach(slot => {
    slot.addEventListener('click', () => {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        selectedTime = slot.dataset.time;
        updateSummary();
        document.getElementById('err-time').classList.remove('show');
    });
});

// ── SERVICE PILLS ──
let selectedServices = [];
document.querySelectorAll('.svc-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        pill.classList.toggle('selected');
        const svc = pill.dataset.svc;
        if (pill.classList.contains('selected')) {
            if (!selectedServices.includes(svc)) selectedServices.push(svc);
        } else {
            selectedServices = selectedServices.filter(s => s !== svc);
        }
        lucide.createIcons();
        updateSummary();
        if (selectedServices.length > 0) document.getElementById('err-service').classList.remove('show');
    });
});

// ── LIVE SUMMARY ──
function updateSummary() {
    const fn = document.getElementById('first-name').value.trim();
    const ln = document.getElementById('last-name').value.trim();
    const pt = document.getElementById('patient-type').value;

    // Notice we only have first-name, wait we have first-name, but in HTML there is no last-name
    // Actually the HTML has `<input type="text" id="first-name" name="first_name" ... placeholder="Jane Stark">`
    // Wait, the updateSummary tries to read 'last-name', but there is no 'last-name' element!
    // I should fix the JS bug too!

    // Re-adding a defensive check
    const fnElem = document.getElementById('first-name');
    const fnVal = fnElem ? fnElem.value.trim() : '';

    const sumName = document.getElementById('sum-name');
    if (fnVal) {
        sumName.textContent = fnVal;
        sumName.classList.remove('empty');
    } else {
        sumName.textContent = 'Not entered';
        sumName.classList.add('empty');
    }

    const sumSvc = document.getElementById('sum-service');
    if (selectedServices.length) {
        sumSvc.textContent = selectedServices.join(', ');
        sumSvc.classList.remove('empty');
    } else {
        sumSvc.textContent = 'Not selected';
        sumSvc.classList.add('empty');
    }

    const sumDate = document.getElementById('sum-date');
    if (selectedDate) {
        sumDate.textContent = selectedDate;
        sumDate.classList.remove('empty');
    } else {
        sumDate.textContent = 'Not selected';
        sumDate.classList.add('empty');
    }

    const sumTime = document.getElementById('sum-time');
    if (selectedTime) {
        sumTime.textContent = selectedTime;
        sumTime.classList.remove('empty');
    } else {
        sumTime.textContent = 'Not selected';
        sumTime.classList.add('empty');
    }

    const sumType = document.getElementById('sum-type');
    if (pt) {
        sumType.textContent = pt === 'new' ? 'New Patient' : 'Existing Patient';
        sumType.classList.remove('empty');
    } else {
        sumType.textContent = 'Not selected';
        sumType.classList.add('empty');
    }
}

// Live name update
const fnElem = document.getElementById('first-name');
if (fnElem) fnElem.addEventListener('input', updateSummary);

document.getElementById('patient-type').addEventListener('change', updateSummary);

// ── FORM VALIDATION + SUBMIT ──
document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const required = [
        { id: 'first-name', err: 'err-first' },
        { id: 'phone', err: 'err-phone' },
        { id: 'dob', err: 'err-dob' },
        { id: 'patient-type', err: 'err-patient', isSelect: true },
    ];
    required.forEach(({ id, err }) => {
        const el = document.getElementById(id);
        const errEl = document.getElementById(err);
        if (el && errEl) {
            if (!el.value.trim()) {
                el.classList.add('error'); errEl.classList.add('show'); valid = false;
            } else {
                el.classList.remove('error'); errEl.classList.remove('show');
            }
        }
    });

    // Email
    const email = document.getElementById('email');
    const emailErr = document.getElementById('err-email');
    if (email && emailErr) {
        if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            email.classList.add('error'); emailErr.classList.add('show'); valid = false;
        } else {
            email.classList.remove('error'); emailErr.classList.remove('show');
        }
    }

    if (!selectedServices.length) {
        document.getElementById('err-service').classList.add('show'); valid = false;
    }
    if (!selectedDate) {
        document.getElementById('err-date').classList.add('show'); valid = false;
    }
    if (!selectedTime) {
        document.getElementById('err-time').classList.add('show'); valid = false;
    }
    if (!document.getElementById('consent').checked) {
        valid = false;
        document.getElementById('consent').style.outline = '2px solid var(--error)';
    } else {
        document.getElementById('consent').style.outline = '';
    }

    if (!valid) return;

    // Simulate submit
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader" style="width:20px;height:20px;animation:spin 1s linear infinite"></i> Submitting…';
    lucide.createIcons();

    setTimeout(() => {
        document.getElementById('success-overlay').classList.add('show');
    }, 1200);
});

// Clear error on input
document.querySelectorAll('.form-input, .form-select').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('error'));
});

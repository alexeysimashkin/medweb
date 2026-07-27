'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [view, setView] = useState('login'); // login, register, dashboard
  const router = useRouter();

  // --- State для форм ---
  // Регистрация/Логин
  const [authForm, setAuthForm] = useState({ fullName: '', specialization: '', email: '', password: '' });
  // Пациент
  const [patientSearch, setPatientSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatient, setNewPatient] = useState({ fullName: '', cardNumber: '', gender: 'Male', birthDate: '', phone: '' });
  // Прием
  const [appointment, setAppointment] = useState({
    appointmentDateTime: '',
    complaints: '',
    anamnesis: '',
    objectiveStatus: '',
    recommendations: '',
    diagnosisCode: '',
    diagnosisText: ''
  });
  // ЭЦП
  const [signatures, setSignatures] = useState([]);
  const [selectedSignatureId, setSelectedSignatureId] = useState('');
  const [newSignature, setNewSignature] = useState({ keyIdentifier: '', ownerName: '', validFrom: '', validTo: '' });
  
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [message, setMessage] = useState('');

  // Проверка авторизации при загрузке
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.doctor) {
          setIsAuthenticated(true);
          setDoctor(data.doctor);
          setView('dashboard');
          loadAppointments();
          loadSignatures();
        }
      });
  }, []);

  const handleAuth = async (type) => {
    const res = await fetch(`/api/auth/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authForm)
    });
    const data = await res.json();
    if (res.ok) {
      setIsAuthenticated(true);
      setDoctor(data.doctor);
      setView('dashboard');
      loadAppointments();
      loadSignatures();
      setMessage('Успешный вход!');
    } else {
      setMessage('Ошибка: ' + data.error);
    }
  };

  const loadAppointments = async () => {
    const res = await fetch('/api/appointments');
    const data = await res.json();
    if (res.ok) setAppointmentsList(data);
  };

  const loadSignatures = async () => {
    const res = await fetch('/api/signatures');
    const data = await res.json();
    if (res.ok) setSignatures(data);
  };

  const searchPatients = async (query) => {
    if (query.length < 2) { setPatients([]); return; }
    const res = await fetch(`/api/patients?q=${query}`);
    const data = await res.json();
    setPatients(data);
  };

  const createPatient = async () => {
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPatient)
    });
    const data = await res.json();
    if (res.ok) {
      setSelectedPatient(data);
      setPatients([data]);
      setMessage('Пациент создан!');
    } else {
      setMessage('Ошибка: ' + data.error);
    }
  };

  const createAppointment = async () => {
    if (!selectedPatient) {
      setMessage('Выберите или создайте пациента');
      return;
    }
    const payload = {
      patientId: selectedPatient.id,
      appointmentDateTime: appointment.appointmentDateTime,
      complaints: appointment.complaints,
      anamnesis: appointment.anamnesis,
      objectiveStatus: appointment.objectiveStatus,
      recommendations: appointment.recommendations,
      diagnosisCode: appointment.diagnosisCode,
      diagnosisText: appointment.diagnosisText,
      signatureId: selectedSignatureId || null
    };

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Прием успешно создан и подписан!');
      loadAppointments();
      // Очистка формы
      setAppointment({ appointmentDateTime: '', complaints: '', anamnesis: '', objectiveStatus: '', recommendations: '', diagnosisCode: '', diagnosisText: '' });
      setSelectedPatient(null);
      setPatientSearch('');
    } else {
      setMessage('Ошибка: ' + data.error);
    }
  };

  const addSignature = async () => {
    const res = await fetch('/api/signatures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSignature)
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('ЭЦП добавлена!');
      loadSignatures();
      setNewSignature({ keyIdentifier: '', ownerName: '', validFrom: '', validTo: '' });
    } else {
      setMessage('Ошибка: ' + data.error);
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout');
    setIsAuthenticated(false);
    setDoctor(null);
    setView('login');
  };

  // --- Интерфейс входа ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4 text-center">🏥 Medical MIS</h1>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setView('login')} className={`flex-1 p-2 ${view === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Вход</button>
            <button onClick={() => setView('register')} className={`flex-1 p-2 ${view === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Регистрация</button>
          </div>
          {view === 'login' && (
            <>
              <input className="w-full p-2 border mb-2" placeholder="Email" type="email" onChange={(e) => setAuthForm({...authForm, email: e.target.value})} />
              <input className="w-full p-2 border mb-2" placeholder="Пароль" type="password" onChange={(e) => setAuthForm({...authForm, password: e.target.value})} />
              <button onClick={() => handleAuth('login')} className="w-full bg-blue-500 text-white p-2 rounded">Войти</button>
            </>
          )}
          {view === 'register' && (
            <>
              <input className="w-full p-2 border mb-2" placeholder="ФИО врача" onChange={(e) => setAuthForm({...authForm, fullName: e.target.value})} />
              <input className="w-full p-2 border mb-2" placeholder="Специализация" onChange={(e) => setAuthForm({...authForm, specialization: e.target.value})} />
              <input className="w-full p-2 border mb-2" placeholder="Email" type="email" onChange={(e) => setAuthForm({...authForm, email: e.target.value})} />
              <input className="w-full p-2 border mb-2" placeholder="Пароль" type="password" onChange={(e) => setAuthForm({...authForm, password: e.target.value})} />
              <button onClick={() => handleAuth('register')} className="w-full bg-green-500 text-white p-2 rounded">Создать врача</button>
            </>
          )}
          {message && <p className="mt-2 text-red-500">{message}</p>}
        </div>
      </div>
    );
  }

  // --- Панель управления (Dashboard) ---
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
          <div>
            <h1 className="text-2xl font-bold">👨‍⚕️ {doctor?.full_name}</h1>
            <p className="text-sm text-gray-600">{doctor?.specialization}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Выйти</button>
          </div>
        </div>

        {/* Управление ЭЦП */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">🔐 Мои ЭЦП</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            {signatures.map(s => (
              <span key={s.id} className={`px-3 py-1 rounded text-sm ${new Date(s.valid_to) > new Date() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {s.owner_name} (до {s.valid_to})
              </span>
            ))}
          </div>
          <details className="mt-2 p-2 border rounded">
            <summary className="cursor-pointer font-medium">➕ Добавить новую ЭЦП</summary>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input className="p-2 border" placeholder="Ключ (ID)" value={newSignature.keyIdentifier} onChange={(e) => setNewSignature({...newSignature, keyIdentifier: e.target.value})} />
              <input className="p-2 border" placeholder="Владелец" value={newSignature.ownerName} onChange={(e) => setNewSignature({...newSignature, ownerName: e.target.value})} />
              <input className="p-2 border" type="date" value={newSignature.validFrom} onChange={(e) => setNewSignature({...newSignature, validFrom: e.target.value})} />
              <input className="p-2 border" type="date" value={newSignature.validTo} onChange={(e) => setNewSignature({...newSignature, validTo: e.target.value})} />
              <button onClick={addSignature} className="col-span-2 bg-blue-500 text-white p-2 rounded">Добавить ключ</button>
            </div>
          </details>
        </div>

        {/* Создание приема */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">📝 Новый прием</h2>
          
          {/* Поиск/Выбор пациента */}
          <div className="mb-4">
            <label className="block font-medium">Пациент</label>
            <input className="w-full p-2 border" placeholder="Поиск по ФИО или карте..." value={patientSearch} onChange={(e) => { setPatientSearch(e.target.value); searchPatients(e.target.value); }} />
            {patients.length > 0 && (
              <ul className="border mt-1 max-h-32 overflow-y-auto">
                {patients.map(p => (
                  <li key={p.id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setSelectedPatient(p); setPatientSearch(p.full_name); setPatients([]); }}>
                    {p.full_name} ({p.card_number})
                  </li>
                ))}
              </ul>
            )}
            {selectedPatient && <div className="mt-1 text-green-600">✅ Выбран: {selectedPatient.full_name}</div>}
            
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-500">➕ Или создать нового пациента</summary>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input className="p-2 border" placeholder="ФИО" value={newPatient.fullName} onChange={(e) => setNewPatient({...newPatient, fullName: e.target.value})} />
                <input className="p-2 border" placeholder="Номер карты" value={newPatient.cardNumber} onChange={(e) => setNewPatient({...newPatient, cardNumber: e.target.value})} />
                <select className="p-2 border" value={newPatient.gender} onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}>
                  <option value="Male">Мужской</option>
                  <option value="Female">Женский</option>
                </select>
                <input className="p-2 border" type="date" value={newPatient.birthDate} onChange={(e) => setNewPatient({...newPatient, birthDate: e.target.value})} />
                <input className="p-2 border col-span-2" placeholder="Телефон" value={newPatient.phone} onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})} />
                <button onClick={createPatient} className="col-span-2 bg-green-500 text-white p-2 rounded">Сохранить пациента</button>
              </div>
            </details>
          </div>

          {/* Данные приема */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Дата и время</label>
              <input className="w-full p-2 border" type="datetime-local" value={appointment.appointmentDateTime} onChange={(e) => setAppointment({...appointment, appointmentDateTime: e.target.value})} />
            </div>
            <div>
              <label className="block font-medium">ЭЦП для подписи</label>
              <select className="w-full p-2 border" value={selectedSignatureId} onChange={(e) => setSelectedSignatureId(e.target.value)}>
                <option value="">Без подписи</option>
                {signatures.map(s => <option key={s.id} value={s.id}>{s.owner_name} (до {s.valid_to})</option>)}
              </select>
            </div>
            <div><label className="block font-medium">Жалобы</label><textarea className="w-full p-2 border" rows="2" value={appointment.complaints} onChange={(e) => setAppointment({...appointment, complaints: e.target.value})} /></div>
            <div><label className="block font-medium">Анамнез</label><textarea className="w-full p-2 border" rows="2" value={appointment.anamnesis} onChange={(e) => setAppointment({...appointment, anamnesis: e.target.value})} /></div>
            <div><label className="block font-medium">Объективный статус</label><textarea className="w-full p-2 border" rows="2" value={appointment.objectiveStatus} onChange={(e) => setAppointment({...appointment, objectiveStatus: e.target.value})} /></div>
            <div><label className="block font-medium">Рекомендации</label><textarea className="w-full p-2 border" rows="2" value={appointment.recommendations} onChange={(e) => setAppointment({...appointment, recommendations: e.target.value})} /></div>
            <div><label className="block font-medium">Код МКБ-10</label><input className="w-full p-2 border" placeholder="J06.9" value={appointment.diagnosisCode} onChange={(e) => setAppointment({...appointment, diagnosisCode: e.target.value})} /></div>
            <div><label className="block font-medium">Диагноз (текст)</label><input className="w-full p-2 border" placeholder="Острая респираторная инфекция" value={appointment.diagnosisText} onChange={(e) => setAppointment({...appointment, diagnosisText: e.target.value})} /></div>
          </div>
          <button onClick={createAppointment} className="mt-4 w-full bg-blue-600 text-white p-3 rounded text-lg font-bold hover:bg-blue-700">
            💾 Сохранить и подписать прием
          </button>
        </div>

        {/* История приемов */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">📋 История приемов</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr><th className="p-2 text-left">Пациент</th><th className="p-2 text-left">Дата/Время</th><th className="p-2 text-left">Диагноз</th><th className="p-2 text-left">Подпись</th></tr>
              </thead>
              <tbody>
                {appointmentsList.map(a => (
                  <tr key={a.id} className="border-t">
                    <td className="p-2">{a.patient_name} ({a.card_number})</td>
                    <td className="p-2">{new Date(a.appointment_datetime).toLocaleString()}</td>
                    <td className="p-2">{a.diagnosis_code} - {a.diagnosis_text}</td>
                    <td className="p-2">{a.is_signed ? '✅ ' + a.signature_owner : '❌ Нет'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {message && <div className="mt-4 p-2 bg-yellow-100 border border-yellow-400 rounded">{message}</div>}
      </div>
    </div>
  );
}

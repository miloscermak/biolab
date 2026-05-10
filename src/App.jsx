import React, { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { Users, ChevronRight, BarChart3, QrCode, Trophy, Presentation, Link as LinkIcon } from 'lucide-react';
import { auth, db, APP_ID } from './firebase.js';
import { QUESTIONS } from './questions.js';

// Cesty ve Firestore — oddělené per APP_ID, takže více workshopů může běžet paralelně
const GAME_STATE_PATH = ['apps', APP_ID, 'state', 'current'];
const VOTES_COLLECTION_PATH = ['apps', APP_ID, 'votes'];

const App = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [gameState, setGameState] = useState({ currentQuestion: 0, status: 'waiting' });
  const [votes, setVotes] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  // Anonymní přihlášení do Firebase (každý hlasující dostane unikátní uid)
  useEffect(() => {
    signInAnonymously(auth).catch((err) => console.error('Auth error:', err));
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // Real-time sync stavu hry
  useEffect(() => {
    if (!user) return;
    const stateDoc = doc(db, ...GAME_STATE_PATH);
    const unsubscribe = onSnapshot(stateDoc, (snapshot) => {
      if (snapshot.exists()) {
        setGameState(snapshot.data());
      } else if (role === 'presenter') {
        setDoc(stateDoc, { currentQuestion: 0, status: 'waiting' });
      }
    }, (err) => console.error('State sync error:', err));
    return () => unsubscribe();
  }, [user, role]);

  // Real-time sync hlasů
  useEffect(() => {
    if (!user) return;
    const votesCol = collection(db, ...VOTES_COLLECTION_PATH);
    const unsubscribe = onSnapshot(votesCol, (snapshot) => {
      setVotes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (err) => console.error('Votes sync error:', err));
    return () => unsubscribe();
  }, [user]);

  // Reset příznaku "už jsem hlasoval" při přechodu na další otázku
  useEffect(() => {
    setHasVoted(false);
  }, [gameState.currentQuestion]);

  const handleStartAsPresenter = async () => {
    setRole('presenter');
    const stateDoc = doc(db, ...GAME_STATE_PATH);
    await setDoc(stateDoc, { currentQuestion: 0, status: 'voting' });
    // Smazání starých hlasů z předchozího běhu
    const votesCol = collection(db, ...VOTES_COLLECTION_PATH);
    const snapshot = await getDocs(votesCol);
    for (const d of snapshot.docs) {
      await deleteDoc(d.ref);
    }
  };

  const handleVote = async (optionIndex) => {
    if (hasVoted || !user) return;
    setHasVoted(true);
    await addDoc(collection(db, ...VOTES_COLLECTION_PATH), {
      questionIndex: gameState.currentQuestion,
      optionIndex,
      userId: user.uid,
      timestamp: Date.now(),
    });
  };

  const nextStep = async () => {
    const stateDoc = doc(db, ...GAME_STATE_PATH);
    if (gameState.status === 'voting') {
      await setDoc(stateDoc, { ...gameState, status: 'results' });
    } else if (gameState.status === 'results') {
      if (gameState.currentQuestion < QUESTIONS.length - 1) {
        await setDoc(stateDoc, {
          ...gameState,
          currentQuestion: gameState.currentQuestion + 1,
          status: 'voting',
        });
      } else {
        await setDoc(stateDoc, { ...gameState, status: 'ended' });
      }
    }
  };

  const resetGame = async () => {
    const stateDoc = doc(db, ...GAME_STATE_PATH);
    await setDoc(stateDoc, { currentQuestion: 0, status: 'voting' });
    const votesCol = collection(db, ...VOTES_COLLECTION_PATH);
    const snapshot = await getDocs(votesCol);
    for (const d of snapshot.docs) {
      await deleteDoc(d.ref);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        Připojování k serveru...
      </div>
    );
  }

  // --- Volba role ---
  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6 font-sans">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="bg-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto">
            <Presentation size={40} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Kvíz: Biopsie & Genetika</h1>
          <div className="grid gap-4 pt-4">
            <button
              onClick={handleStartAsPresenter}
              className="flex items-center justify-between p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl transition-all"
            >
              <div className="text-left">
                <div className="font-bold text-lg text-indigo-400">Prezentující</div>
                <div className="text-sm text-slate-400">Spustit kvíz na projektoru.</div>
              </div>
              <ChevronRight />
            </button>
            <button
              onClick={() => setRole('voter')}
              className="flex items-center justify-between p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl transition-all"
            >
              <div className="text-left">
                <div className="font-bold text-lg text-emerald-400">Hlasující</div>
                <div className="text-sm text-slate-400">Odpovídat z mobilu.</div>
              </div>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Pohled prezentujícího ---
  if (role === 'presenter') {
    // Závěrečné vyhodnocení napříč všemi otázkami
    if (gameState.status === 'ended') {
      const stats = QUESTIONS.map((q, i) => {
        const qVotes = votes.filter((v) => v.questionIndex === i);
        const correct = qVotes.filter((v) => v.optionIndex === q.correct).length;
        const total = qVotes.length;
        return { i, total, correct, pct: total > 0 ? Math.round((correct / total) * 100) : 0 };
      });
      const overallTotal = stats.reduce((a, s) => a + s.total, 0);
      const overallCorrect = stats.reduce((a, s) => a + s.correct, 0);
      const overallPct = overallTotal > 0 ? Math.round((overallCorrect / overallTotal) * 100) : 0;

      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-8">
          <Trophy size={64} className="text-yellow-500 mb-4 mt-8" />
          <h1 className="text-4xl font-bold mb-2">Kvíz dokončen</h1>
          <p className="text-slate-400 mb-8">
            Celkem správně <span className="text-emerald-400 font-bold">{overallPct}%</span>{' '}
            ({overallCorrect}/{overallTotal} hlasů)
          </p>
          <div className="w-full max-w-3xl space-y-3 mb-8">
            {stats.map((s) => (
              <div key={s.i} className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                <span className="font-bold text-slate-500 w-8">{s.i + 1}.</span>
                <span className="flex-1 text-sm text-slate-300 truncate">{QUESTIONS[s.i].q}</span>
                <span className="text-xs text-slate-500">{s.correct}/{s.total}</span>
                <span className={`font-bold w-14 text-right ${s.pct >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {s.pct}%
                </span>
              </div>
            ))}
          </div>
          <button onClick={resetGame} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold">
            Restartovat kvíz
          </button>
        </div>
      );
    }

    const currentQ = QUESTIONS[gameState.currentQuestion];
    const currentVotes = votes.filter((v) => v.questionIndex === gameState.currentQuestion);
    const total = currentVotes.length;
    const joinUrl = customUrl || window.location.href;

    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
        <header className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BarChart3 size={24} />
            </div>
            <h2 className="font-bold text-xl leading-tight">Kvíz: Biopsie & Genetika</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
              <Users size={18} className="text-blue-400" />
              <span className="font-bold">{total} hlasů</span>
            </div>
            <button
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full font-bold transition-all"
            >
              {gameState.status === 'voting' ? 'Ukončit hlasování' : 'Další otázka'}
            </button>
          </div>
        </header>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 overflow-y-auto">
          <div className="lg:col-span-8 space-y-8 flex flex-col justify-center">
            <div className="space-y-4">
              <span className="text-blue-400 font-bold tracking-widest uppercase text-sm">
                Otázka {gameState.currentQuestion + 1} z {QUESTIONS.length}
              </span>
              <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight">{currentQ.q}</h1>
            </div>

            <div className="space-y-4">
              {currentQ.options.map((opt, i) => {
                const count = currentVotes.filter((v) => v.optionIndex === i).length;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const isCorrect = i === currentQ.correct;
                const showResults = gameState.status === 'results';

                return (
                  <div key={i} className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50">
                    <div
                      className={`absolute inset-y-0 left-0 transition-all duration-1000 ${
                        showResults ? (isCorrect ? 'bg-emerald-500/20' : 'bg-rose-500/10') : 'bg-blue-500/10'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative p-5 flex items-center justify-between gap-4 font-medium">
                      <div className="flex items-center gap-4">
                        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className={showResults && isCorrect ? 'text-emerald-400' : 'text-slate-200'}>{opt}</span>
                      </div>
                      {showResults && (
                        <span className={`font-black text-2xl ${isCorrect ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {pct}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {gameState.status === 'results' && (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <p className="text-lg text-slate-300 italic">💡 {currentQ.explanation}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center items-center space-y-6 lg:border-l lg:border-slate-800 lg:pl-8">
            <h3 className="text-2xl font-bold flex items-center gap-2 text-slate-300">
              <QrCode className="text-blue-400" /> Připojte se
            </h3>
            <div className="p-4 bg-white rounded-3xl">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(joinUrl)}`}
                alt="QR Code"
                className="w-48 h-48 lg:w-64 lg:h-64"
              />
            </div>
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2 text-slate-500 bg-slate-800 p-2 rounded-lg text-xs truncate max-w-full">
                <LinkIcon size={12} /> {joinUrl}
              </div>
              <input
                type="text"
                placeholder="Přepsat URL adresu (volitelné)..."
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-[10px]"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- Pohled hlasujícího (mobil) ---
  const currentQ_voter = QUESTIONS[gameState.currentQuestion];
  const myVote = votes.find(
    (v) => v.questionIndex === gameState.currentQuestion && v.userId === user.uid
  );

  if (gameState.status === 'waiting') {
    return (
      <div className="h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        Čekáme na start workshopu...
      </div>
    );
  }

  if (gameState.status === 'ended') {
    // Spočítat skóre tohoto účastníka
    const myAnswers = votes.filter((v) => v.userId === user.uid);
    const myCorrect = myAnswers.filter(
      (v) => QUESTIONS[v.questionIndex] && v.optionIndex === QUESTIONS[v.questionIndex].correct
    ).length;
    return (
      <div className="h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <Trophy size={48} className="text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Děkujeme za účast!</h1>
        <p className="text-slate-400">
          Tvoje skóre: <span className="text-emerald-400 font-bold">{myCorrect}</span> / {myAnswers.length}
        </p>
      </div>
    );
  }

  if (hasVoted || myVote) {
    return (
      <div className="h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
        <h1 className="text-2xl font-bold">Odhlasováno! 👍</h1>
        {gameState.status === 'results' && myVote && (
          <div
            className={`p-6 rounded-2xl border ${
              myVote.optionIndex === currentQ_voter.correct
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-rose-500/10 border-rose-500/30'
            }`}
          >
            <div className="font-bold text-lg mb-2">
              {myVote.optionIndex === currentQ_voter.correct ? 'Správně!' : 'Vedle...'}
            </div>
            <p className="text-sm opacity-80">{currentQ_voter.explanation}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 font-sans">
      <div className="pt-4 pb-6 border-b border-slate-900 mb-6">
        <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">
          Otázka {gameState.currentQuestion + 1} z {QUESTIONS.length}
        </span>
        <h2 className="text-xl font-bold mt-2">{currentQ_voter.q}</h2>
      </div>
      <div className="space-y-3">
        {currentQ_voter.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleVote(i)}
            className="w-full text-left p-5 bg-slate-900 border border-slate-800 rounded-2xl active:scale-95 transition-all flex items-center gap-4"
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-500">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="font-medium">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;

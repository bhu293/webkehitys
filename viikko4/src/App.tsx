
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import LoginForm from "./LoginForm";
import { auth, logout } from "./authService";
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function generateCodename() {
  const adjectives = ["Sneaky", "Electric", "Silent", "Hyper", "Cosmic"];
  const animals = ["Fox", "Panda", "Lizard", "Dragon", "Hawk"];
  const number = Math.floor(Math.random() * 3000);

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];

  return `${adj}${animal}${number}`;
}

function App() {
  const [userCodename, setUserCodename] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserCodename("");
      return;
    }

    const storageKey = `codename_${user.uid}`;
    let savedCodename = localStorage.getItem(storageKey);

    if (!savedCodename) {
      savedCodename = generateCodename();
      localStorage.setItem(storageKey, savedCodename);
    }

    setUserCodename(savedCodename);
  }, [user]);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img
            src={heroImg}
            className="base"
            width="170"
            height="179"
            alt=""
          />
          <img
            src={reactLogo}
            className="framework"
            alt="React logo"
          />
          <img
            src={viteLogo}
            className="vite"
            alt="Vite logo"
          />
        </div>

        {user ? (
          <>
            <h1>Koodinimi</h1>
            <h2>Tervetuloa, {userCodename}</h2>

            <button onClick={logout}>
              Kirjaudu ulos
            </button>
          </>
        ) : (
          <LoginForm />
        )}
      </section>
    </>
  );
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
 
const Home = () => {
  const { user } = useAuth();

  return (
    <>
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-cyan-400 sm:text-6xl">
            Plateforme CTF pour la Sécurité Sans Fil & IoT
          </h1>
          <p className="mt-6 text-lg leading-8 text-white">
            Une plateforme gamifiée d'entraînement à la cybersécurité dans les réseaux sans fil et les objets connectés.
            Apprenez, pratiquez et maîtrisez la sécurité offensive et défensive.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            {user ? (
              <Link
                to="/challenges"
                className="btn-primary"
              >
                Commencer les défis
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  S'inscrire
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-semibold leading-6 text-white"
                >
                  Se connecter <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card">
              <h3 className="text-lg font-semibold text-neon-green">Wireless Security</h3>
              <p className="mt-2 text-white">
                Apprenez à sécuriser et tester les réseaux Wi-Fi, Bluetooth et autres protocoles sans fil.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-neon-green">IoT Security</h3>
              <p className="mt-2 text-white">
                Découvrez les vulnérabilités des objets connectés et comment les sécuriser.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-neon-green">Hands-on Practice</h3>
              <p className="mt-2 text-white">
                Mettez en pratique vos connaissances avec des challenges réalistes et progressifs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home; 
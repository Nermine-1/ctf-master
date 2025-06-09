import React, { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Accueil', href: '/', current: true },
    { name: 'Défis', href: '/challenges', current: false },
    { name: 'Classement', href: '/leaderboard', current: false },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Disclosure as="nav" className="bg-black/90 border-b border-green-500/30">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="text-2xl font-bold text-green-400 glitch-text hover-glow">
                    Plateforme CTF
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? 'border-green-500 text-green-400'
                          : 'border-transparent text-gray-400 hover:border-green-500/50 hover:text-green-400',
                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-all duration-300'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {user ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                          {user.username[0].toUpperCase()}
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-900 border border-green-500/30 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(
                                active ? 'bg-gray-800 text-green-400' : 'text-gray-300',
                                'block px-4 py-2 text-sm transition-colors duration-300'
                              )}
                            >
                              Votre Profil
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/teams/create"
                              className={classNames(
                                active ? 'bg-gray-800 text-green-400' : 'text-gray-300',
                                'block px-4 py-2 text-sm transition-colors duration-300'
                              )}
                            >
                              Créer une Équipe
                            </Link>
                          )}
                        </Menu.Item>
                        {user.is_admin && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/admin"
                                className={classNames(
                                  active ? 'bg-gray-800 text-green-400' : 'text-gray-300',
                                  'block px-4 py-2 text-sm transition-colors duration-300'
                                )}
                              >
                                Tableau de Bord Admin
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-800 text-green-400' : 'text-gray-300',
                                'block w-full text-left px-4 py-2 text-sm transition-colors duration-300'
                              )}
                            >
                              Se déconnecter
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="space-x-4">
                    <Link
                      to="/login"
                      className="text-gray-400 hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300"
                    >
                      Se connecter
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary"
                    >
                      S'inscrire
                    </Link>
                  </div>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors duration-300">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-800 border-green-500 text-green-400'
                      : 'border-transparent text-gray-400 hover:bg-gray-800 hover:border-green-500/50 hover:text-green-400',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors duration-300'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <Disclosure.Button
                as={Link}
                to="/teams/create"
                className="block px-4 py-2 text-base font-medium text-gray-400 hover:bg-gray-800 hover:text-green-400 transition-colors duration-300"
              >
                Créer une Équipe
              </Disclosure.Button>
            </div>
            {user ? (
              <div className="border-t border-gray-800 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white">
                      {user.username[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-green-400">{user.username}</div>
                    <div className="text-sm font-medium text-gray-400">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as={Link}
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-400 hover:bg-gray-800 hover:text-green-400 transition-colors duration-300"
                  >
                    Votre Profil
                  </Disclosure.Button>
                  {user.is_admin && (
                    <Disclosure.Button
                      as={Link}
                      to="/admin"
                      className="block px-4 py-2 text-base font-medium text-gray-400 hover:bg-gray-800 hover:text-green-400 transition-colors duration-300"
                    >
                      Tableau de Bord Admin
                    </Disclosure.Button>
                  )}
                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-400 hover:bg-gray-800 hover:text-green-400 transition-colors duration-300"
                  >
                    Se déconnecter
                  </Disclosure.Button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-800 pb-3 pt-4">
                <div className="space-y-1">
                  <Disclosure.Button
                    as={Link}
                    to="/login"
                    className="block px-4 py-2 text-base font-medium text-gray-400 hover:bg-gray-800 hover:text-green-400 transition-colors duration-300"
                  >
                    Se connecter
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    to="/register"
                    className="block px-4 py-2 text-base font-medium text-gray-400 hover:bg-gray-800 hover:text-green-400 transition-colors duration-300"
                  >
                    S'inscrire
                  </Disclosure.Button>
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar; 
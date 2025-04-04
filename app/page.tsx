"use client";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RootState } from "@/store/store";
import { setAuthUser } from '@/store/authSlice';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from '@/server';
import axios from 'axios';
import { toast } from 'sonner';
import { Building, ArrowRight, ChevronRight, Menu, X, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoutHandler = async() => { 
    try {
      await axios.post(`${API_URL}/users/logout`, {}, { withCredentials: true });
      dispatch(setAuthUser(null));
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Ocurrió un error');
      }
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Barra de navegación */}
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg py-3' : 'bg-gray-900 py-5'
        }`}
      >
        <div className="w-[90%] max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">IPCE</h1>
          </div>

          {/* Navegación para escritorio */}
          <div className="hidden md:flex items-center gap-8">
            <nav>
              <ul className="flex gap-6">
                <li><a href="#features" className="font-medium text-blue-100 hover:text-blue-400 transition-colors">Características</a></li>
                <li><a href="#about" className="font-medium text-blue-100 hover:text-blue-400 transition-colors">Acerca de</a></li>
                <li><a href="#contact" className="font-medium text-blue-100 hover:text-blue-400 transition-colors">Contacto</a></li>
              </ul>
            </nav>
            
            {!user ? (
              <div className="flex items-center gap-3">
                <Link href="/auth/login"> 
                  <Button variant="outline" 
                    className="cursor-pointer border-2 border-blue-400 text-blue-400 hover:bg-blue-900/30 transition-all duration-300 rounded-md px-6">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/signup"> 
                  <Button 
                    className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 rounded-md px-6 shadow-md hover:shadow-lg">
                    Registrarse
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="cursor-pointer border-2 border-blue-900 hover:border-blue-700 transition-all ring-offset-2 ring-2 ring-transparent hover:ring-blue-800">
                    <AvatarFallback className="font-bold uppercase bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                      {user.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.username}</span>
                    <span className="text-xs text-gray-400">
                      {user.isVerified ? (
                        <span className="flex items-center text-green-400">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                          Verificado
                        </span>
                      ) : (
                        <span className="flex items-center text-amber-400">
                          <span className="w-2 h-2 bg-amber-400 rounded-full mr-1"></span>
                          No verificado
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                
                <Link href="/dashboard">
                  <Button 
                    className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 rounded-md flex items-center gap-1 shadow-md hover:shadow-lg">
                    Panel <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                
                <Button 
                  onClick={logoutHandler}
                  variant="ghost" 
                  size="icon"
                  className="cursor-pointer text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Botón del menú móvil */}
          <button 
            className="md:hidden block text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 absolute w-full shadow-lg">
            <div className="w-[90%] mx-auto py-4">
              <nav className="mb-6">
                <ul className="flex flex-col gap-4">
                  <li><a href="#features" className="font-medium text-blue-100 block py-2">Características</a></li>
                  <li><a href="#about" className="font-medium text-blue-100 block py-2">Acerca de</a></li>
                  <li><a href="#contact" className="font-medium text-blue-100 block py-2">Contacto</a></li>
                </ul>
              </nav>
              
              {!user ? (
                <div className="flex flex-col gap-3">
                  <Link href="/auth/login" className="w-full"> 
                    <Button variant="outline" 
                      className="w-full cursor-pointer border-2 border-blue-400 text-blue-400 hover:bg-blue-900/30 transition-all duration-300 rounded-md">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="w-full"> 
                    <Button 
                      className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 rounded-md">
                      Registrarse
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 py-2">
                    <Avatar className="cursor-pointer border-2 border-blue-800">
                      <AvatarFallback className="font-bold uppercase bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                        {user.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.username}</span>
                      <span className="text-xs text-gray-400">
                        {user.isVerified ? "Verificado" : "No verificado"}
                      </span>
                    </div>
                  </div>
                  
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 rounded-md">
                      Panel
                    </Button>
                  </Link>
                  
                  <Button 
                    onClick={logoutHandler}
                    variant="outline" 
                    className="w-full cursor-pointer border-red-900 text-red-400 hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-2" /> Cerrar Sesión
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Contenido principal */}
      <main>
        {/* Sección Hero */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="w-[90%] max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-10">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 tracking-tight leading-tight"
              >
                Sistema Inteligente de Gestión de Edificios
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-blue-100 max-w-3xl mb-10"
              >
                Revoluciona cómo gestionas la infraestructura de tus edificios con nuestra plataforma IPCE de última generación
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-lg px-8 py-6 rounded-md shadow-lg hover:shadow-xl transition-all duration-300">
                  Comenzar <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-blue-400 text-blue-400 hover:bg-blue-900/30 text-lg px-8 py-6 rounded-md transition-all duration-300">
                  Saber más
                </Button>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative w-full h-64 md:h-96 lg:h-[500px] mt-10 rounded-lg overflow-hidden shadow-2xl border border-gray-700"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-800/90 to-blue-900/90 flex items-center justify-center">
                <Building className="w-20 h-20 text-blue-400 opacity-20" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl md:text-3xl font-medium">Vista previa del panel interactivo</h3>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Sección de características */}
        <section id="features" className="py-20 bg-gray-800">
          <div className="w-[90%] max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-blue-100">Características poderosas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-6 rounded-lg bg-gray-700 hover:bg-gray-700/80 border border-gray-600 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4">
                    <Building className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-100">Característica {i}</h3>
                  <p className="text-gray-300">Una característica potente que mejora tu experiencia de gestión de edificios.</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Pie de página */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="w-[90%] max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">IPCE</h2>
              </div>
              <p className="text-gray-400 max-w-md">
                El sistema de gestión de edificios más avanzado para las necesidades de infraestructura moderna.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-100">Producto</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Características</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Precios</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Documentación</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-100">Empresa</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Acerca de</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Carreras</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-100">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacidad</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Términos</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Seguridad</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 IPCE Gestión de Edificios. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-blue-400 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-blue-400 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
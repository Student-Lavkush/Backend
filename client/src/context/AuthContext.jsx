import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);


  useEffect(() => {
    checkAuth();
  }, []);


  async function checkAuth() {
    try {
      const data = await authService.getMe();
      setUser(data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }


  async function register({ fullName, email, password, role }) {

    setAuthLoading(true);

    try {

      const data = await authService.register({
        fullName,
        email,
        password,
        role,
      });

      setUser(data.user);

      return {
        success: true,
        user: data.user,
      };

    } catch (error) {

      return {
        success:false,
        error:error?.response?.data?.message || "Signup failed"
      };

    } finally {
      setAuthLoading(false);
    }
  }



  async function login({ email, password ,role}) {

    setAuthLoading(true);

    try {

      const data = await authService.login({
        email,
        password,
        role,
      });


      setUser(data.user);


      return {
        success:true,
        user:data.user
      };


    } catch(error){

      return {
        success:false,
        error:error?.response?.data?.message || "Login failed"
      };

    } finally {
      setAuthLoading(false);
    }
  }



  async function logout(){

    await authService.logout();
    setUser(null);

  }



  function updateUser(partialUser){

    setUser(prev => ({
      ...prev,
      ...partialUser
    }));

  }



  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated:!!user,
        loading,
        authLoading,
        register,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}



export function useAuth(){

  const context = useContext(AuthContext);

  if(!context){
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;

}
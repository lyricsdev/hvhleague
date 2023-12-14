import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
interface AuthContextType {
    token: string | null;
    isLoggedIn: () => boolean;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const isLoggedIn = () => {
        return !!token;
      };
    useEffect(() => {
        const storedToken = getCookie('auth_token');
        if (storedToken) {
            setToken(storedToken);
            console.log(storedToken)
        }
    }, []);

    return (
        <AuthContext.Provider value={{ token,isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const routes = [
    { path: '/', label: 'Home' },
    { path: '/clients', label: 'Clients' },
    { path: '/packages', label: 'Packages' },
    { path: '/shipments', label: 'Shipments' },
];

const NavBar: React.FC = () => {
    const location = useLocation();
    
    return (
        <nav className="p-4 bg-gray-600">
            <ul className="flex list-none m-0 p-0">
                {routes.map(route => (
                    <li key={route.path} className="mr-6">
                        <Link
                            to={route.path}
                            className={`text-white no-underline ${
                                location.pathname === route.path 
                                    ? 'text-cyan-400 font-bold' 
                                    : 'font-normal'
                            }`}
                        >
                            {route.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavBar;
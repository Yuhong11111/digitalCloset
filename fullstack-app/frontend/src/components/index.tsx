import React from 'react';

export const Header: React.FC = () => {
    return (
        <header>
            <h1>My Fullstack App</h1>
        </header>
    );
};

export const Footer: React.FC = () => {
    return (
        <footer>
            <p>© 2023 My Fullstack App. All rights reserved.</p>
        </footer>
    );
};

export const Button: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => {
    return (
        <button onClick={onClick}>
            {label}
        </button>
    );
};
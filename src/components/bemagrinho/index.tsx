'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";

export default function Bemagrinho() {
    const [sequence, setSequence] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Concatena a tecla pressionada à sequência atual
            setSequence((prev) => (prev + e.key).slice(-10)); // Mantém os últimos 10 caracteres

            // Verifica se a sequência é "bemagrinho"
            if (sequence === 'bemagrinho') {
                setIsActive(true); // Ativa a animação
                setTimeout(() => {
                    setIsActive(false); // Desativa a animação após 3 segundos
                }, 800);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [sequence]);

    return (
            <Image
                className={`absolute top-[25%] left-1/2 transform -translate-x-1/2 transition-transform duration-700 ease-in-out ${
                    isActive ? 'scale-150' : 'scale-0'
                } z-10`}
                src={'/bemagrinho.svg'}
                width={400}
                height={400}
                alt="Bemagrinho"
            />
    );
}

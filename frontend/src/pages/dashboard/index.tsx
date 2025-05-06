import { useEffect, useState } from 'react';
import axios from 'axios';
import { CircleDollarSign, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { Input } from '../../components/Input';

const mesesOrdenados = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
];

export default function Dashboard() {
    const [ano, setAno] = useState(new Date().getFullYear());
    const [resumo, setResumo] = useState({});

    const fetchResumo = async anoSelecionado => {
        try {
            const response = await axios.get(
                `/balance/resumo_mensal?ano=${anoSelecionado}`,
            );
            setResumo(response.data);
        } catch (error) {
            console.error('Erro ao buscar resumo:', error);
        }
    };

    useEffect(() => {
        fetchResumo(ano);
    }, [ano]);

    const getColor = net => {
        if (net > 0) return 'text-green-600';
        if (net < 0) return 'text-red-600';
        return 'text-yellow-600';
    };

    const getIcon = net => {
        if (net > 0)
            return <ArrowUpCircle className="w-6 h-6 text-green-600" />;
        if (net < 0)
            return <ArrowDownCircle className="w-6 h-6 text-red-600" />;
        return <CircleDollarSign className="w-6 h-6 text-yellow-600" />;
    };

    const formatCurrency = value => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <span className="text-gray-800 font-medium">
                    Filtrar por ano:
                </span>
                <Input
                    id="ano"
                    type="number"
                    value={ano}
                    onChange={e => setAno(e.target.value)}
                    className="w-32 border rounded px-2 py-1"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {mesesOrdenados.map(mes => {
                    const dados = resumo[mes] || {
                        entradas: 0,
                        saidas: 0,
                        liquido: 0,
                    };
                    return (
                        <div
                            key={mes}
                            className="bg-white text-gray-800 shadow-md rounded-xl p-6 space-y-3 border border-gray-200 hover:shadow-lg transition"
                        >
                            <div className="flex justify-between items-center">
                                <h2
                                    className={`text-lg font-bold ${getColor(
                                        dados.liquido,
                                    )}`}
                                >
                                    {mes}
                                </h2>
                                {getIcon(dados.liquido)}
                            </div>
                            <p>Income: {formatCurrency(dados.entradas)}</p>
                            <p>Expenses: {formatCurrency(dados.saidas)}</p>
                            <p>Net: {formatCurrency(dados.liquido)}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

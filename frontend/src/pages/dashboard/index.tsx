import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CircleDollarSign, ArrowDownCircle, ArrowUpCircle, Plus, X } from 'lucide-react';
import { Input } from '../../components/Input';
import { api } from '../../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

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
    const [selectedYears, setSelectedYears] = useState([new Date().getFullYear()]);
    const [resumo, setResumo] = useState({});
    const [chartView, setChartView] = useState('all');

    const fetchResumo = async anoSelecionado => {
        try {
            const response = await api.get(
                `/balance/resumo_mensal?ano=${anoSelecionado}`,
            );
            setResumo(prev => ({
                ...prev,
                [anoSelecionado]: response.data,
            }));
        } catch (error) {
            console.error('Erro ao buscar resumo:', error);
        }
    };

    useEffect(() => {
        selectedYears.forEach(year => {
            fetchResumo(year);
        });
    }, [selectedYears]);

    const addYear = () => {
        const newYear = Math.max(...selectedYears) + 1;
        setSelectedYears([...selectedYears, newYear]);
    };

    const removeYear = yearToRemove => {
        setSelectedYears(selectedYears.filter(year => year !== yearToRemove));
    };

    const updateYear = (index, newValue) => {
        const newYears = [...selectedYears];
        newYears[index] = Number(newValue);
        setSelectedYears(newYears);
    };

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

    const chartData = {
        labels: mesesOrdenados,
        datasets: selectedYears.flatMap(year => {
            const yearData = resumo[year] || {};
            return [
                {
                    label: `Receitas ${year}`,
                    data: mesesOrdenados.map(mes => yearData[mes]?.entradas || 0),
                    backgroundColor: `rgba(34, 197, 94, ${0.3 + (selectedYears.indexOf(year) * 0.2)})`,
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 1,
                    hidden: chartView === 'expenses' || chartView === 'net',
                },
                {
                    label: `Despesas ${year}`,
                    data: mesesOrdenados.map(mes => yearData[mes]?.saidas || 0),
                    backgroundColor: `rgba(239, 68, 68, ${0.3 + (selectedYears.indexOf(year) * 0.2)})`,
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 1,
                    hidden: chartView === 'income' || chartView === 'net',
                },
                {
                    label: `Saldo ${year}`,
                    data: mesesOrdenados.map(mes => yearData[mes]?.liquido || 0),
                    backgroundColor: `rgba(234, 179, 8, ${0.3 + (selectedYears.indexOf(year) * 0.2)})`,
                    borderColor: 'rgb(234, 179, 8)',
                    borderWidth: 1,
                    hidden: chartView === 'income' || chartView === 'expenses',
                },
            ];
        }),
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Evolução Financeira Mensal',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback(value) {
                        return formatCurrency(value);
                    },
                },
            },
        },
    };

    return (
        <div className="p-6 space-y-6 overflow-y-scroll">
            <div className="flex items-center gap-4 flex-wrap">
                <span className="text-gray-800 font-medium">
                    Anos para comparação:
                </span>
                {selectedYears.map((year, index) => (
                    <div key={year} className="flex items-center gap-2">
                        <Input
                            type="number"
                            value={year}
                            onChange={e => updateYear(index, e.target.value)}
                            className="w-24 border rounded px-2 py-1"
                        />
                        {selectedYears.length > 1 && (
                            <button
                                onClick={() => removeYear(year)}
                                className="p-1 text-red-500 hover:text-red-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
                <button
                    onClick={addYear}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {mesesOrdenados.map(mes => {
                    const dados = resumo[selectedYears[0]]?.[mes] || {
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

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex justify-end mb-4 gap-2">
                    <button
                        onClick={() => setChartView('all')}
                        className={`px-3 py-1 rounded ${
                            chartView === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200'
                        }`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setChartView('income')}
                        className={`px-3 py-1 rounded ${
                            chartView === 'income'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200'
                        }`}
                    >
                        Receitas
                    </button>
                    <button
                        onClick={() => setChartView('expenses')}
                        className={`px-3 py-1 rounded ${
                            chartView === 'expenses'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200'
                        }`}
                    >
                        Despesas
                    </button>
                    <button
                        onClick={() => setChartView('net')}
                        className={`px-3 py-1 rounded ${
                            chartView === 'net'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-200'
                        }`}
                    >
                        Saldo
                    </button>
                </div>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

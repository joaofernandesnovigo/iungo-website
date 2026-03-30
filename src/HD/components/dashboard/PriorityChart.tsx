
interface PriorityChartProps {
  data: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}

const priorityConfig = {
  urgent: { label: 'Urgente', color: 'bg-rose-500', textColor: 'text-rose-600' },
  high: { label: 'Alta', color: 'bg-amber-500', textColor: 'text-amber-600' },
  medium: { label: 'Média', color: 'bg-teal-500', textColor: 'text-teal-600' },
  low: { label: 'Baixa', color: 'bg-gray-400', textColor: 'text-gray-600' },
};

export function PriorityChart({ data }: PriorityChartProps) {
  const total = data.low + data.medium + data.high + data.urgent;
  
  const getPercentage = (value: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const priorities = [
    { key: 'urgent', ...priorityConfig.urgent, value: data.urgent },
    { key: 'high', ...priorityConfig.high, value: data.high },
    { key: 'medium', ...priorityConfig.medium, value: data.medium },
    { key: 'low', ...priorityConfig.low, value: data.low },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Distribuição por Prioridade
      </h3>

      {total === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <i className="ri-pie-chart-line text-xl text-gray-400"></i>
          </div>
          <p className="text-sm">Nenhum ticket ativo</p>
        </div>
      ) : (
        <>
          {/* Barra de progresso empilhada */}
          <div className="h-4 rounded-full overflow-hidden flex bg-gray-100 mb-4">
            {priorities.map((priority) => {
              const percentage = getPercentage(priority.value);
              if (percentage === 0) return null;
              return (
                <div
                  key={priority.key}
                  className={`${priority.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                  title={`${priority.label}: ${priority.value} (${percentage}%)`}
                />
              );
            })}
          </div>

          {/* Legenda */}
          <div className="grid grid-cols-2 gap-3">
            {priorities.map((priority) => (
              <div key={priority.key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                <span className="text-xs text-gray-600">{priority.label}</span>
                <span className={`text-xs font-semibold ${priority.textColor} ml-auto`}>
                  {priority.value}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-500">Total de tickets ativos</span>
            <span className="text-sm font-bold text-gray-800">{total}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default PriorityChart;

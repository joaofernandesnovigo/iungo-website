
interface ActivityChartProps {
  data: {
    date: string;
    count: number;
  }[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  };

  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Atividade dos Últimos 7 Dias
      </h3>

      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((item, index) => {
          const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
          const isToday = index === data.length - 1;
          
          return (
            <div
              key={item.date}
              className="flex-1 flex flex-col items-center gap-2"
            >
              {/* Valor */}
              <span className="text-xs font-medium text-gray-600">
                {item.count}
              </span>
              
              {/* Barra */}
              <div className="w-full h-20 bg-gray-100 rounded-t-md relative flex items-end">
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    isToday ? 'bg-teal-500' : 'bg-teal-300'
                  }`}
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
              </div>
              
              {/* Label */}
              <div className="text-center">
                <p className={`text-xs font-medium ${isToday ? 'text-teal-600' : 'text-gray-600'}`}>
                  {formatDate(item.date)}
                </p>
                <p className="text-[10px] text-gray-400">
                  {formatFullDate(item.date)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">Total na semana</span>
        <span className="text-sm font-bold text-gray-800">
          {data.reduce((sum, d) => sum + d.count, 0)} tickets
        </span>
      </div>
    </div>
  );
}

export default ActivityChart;

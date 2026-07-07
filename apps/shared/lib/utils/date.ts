// Date utilities
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
};

export const formatDatetime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('pt-BR');
};

export const isValidDateRange = (start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return true;
  return start <= end;
};

export const getDateRangeLabel = (start: Date | null, end: Date | null): string => {
  if (!start && !end) return 'Todos os períodos';
  if (!start) return `Até ${formatDate(end!)}`;
  if (!end) return `A partir de ${formatDate(start)}`;
  return `${formatDate(start)} - ${formatDate(end)}`;
};
function getFormattedDate(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (diff < oneDay) {
    // If less than a day ago, show time like "8:39 PM"
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    // Otherwise, show date like "Jul 2, 2025"
    return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

function getFirstInitial(name: string) {
  return name.charAt(0).toUpperCase();
}


function getUserColor(name: string) {
  const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export { getFormattedDate, getFirstInitial, getUserColor }

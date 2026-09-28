// Static mock of Maharashtra public holidays for 2026
const mhHolidays2026 = [
  '2026-01-26', // Republic Day
  '2026-02-19', // Shivaji Maharaj Jayanti
  '2026-03-20', // Gudhi Padwa
  '2026-04-14', // Ambedkar Jayanti
  '2026-05-01', // Maharashtra Day
  '2026-08-15', // Independence Day
  '2026-09-17', // Ganesh Chaturthi
  '2026-10-02', // Gandhi Jayanti
  '2026-11-09', // Diwali
  '2026-12-25', // Christmas
];

export const calculateSlaDeadline = (startDate: Date, slaDays: number): { deadline: Date, source: string } => {
  let currentDate = new Date(startDate);
  let daysAdded = 0;

  while (daysAdded < slaDays) {
    currentDate.setDate(currentDate.getDate() + 1);
    
    // Check if weekend (0 = Sunday, 6 = Saturday)
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    
    // Check if public holiday
    const dateStr = currentDate.toISOString().split('T')[0];
    const isHoliday = mhHolidays2026.includes(dateStr);
    
    if (!isWeekend && !isHoliday) {
      daysAdded++;
    }
  }

  return { deadline: currentDate, source: "Bundled Maharashtra Holidays JSON (2026)" };
};

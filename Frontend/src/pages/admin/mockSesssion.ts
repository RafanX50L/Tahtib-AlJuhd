const trainerIds = [
  '60d5f483f5a4f12345678901', // Trainer 1
  '60d5f483f5a4f12345678902', // Trainer 2
  '60d5f483f5a4f12345678903'  // Trainer 3
];

const clientIds = [
  '60d5f483f5a4f12345678904', // Client 1
  '60d5f483f5a4f12345678905', // Client 2
  '60d5f483f5a4f12345678906'  // Client 3
];

const sessionDetails = [
  { trainer: 0, client: 0, day: 8, startHour: 9, status: 'scheduled' },
  { trainer: 1, client: 1, day: 8, startHour: 14, status: 'scheduled' },
  { trainer: 2, client: 2, day: 9, startHour: 10, status: 'completed' },
  { trainer: 0, client: 1, day: 9, startHour: 13, status: 'cancelled' },
  { trainer: 1, client: 0, day: 10, startHour: 11, status: 'scheduled' },
  { trainer: 2, client: 1, day: 10, startHour: 15, status: 'scheduled' },
  { trainer: 0, client: 2, day: 11, startHour: 9.5, status: 'scheduled' },
  { trainer: 1, client: 2, day: 11, startHour: 14.5, status: 'completed' },
  { trainer: 2, client: 0, day: 12, startHour: 10, status: 'scheduled' },
  { trainer: 0, client: 1, day: 12, startHour: 13.5, status: 'scheduled' },
  { trainer: 1, client: 2, day: 13, startHour: 9, status: 'cancelled' },
  { trainer: 2, client: 0, day: 13, startHour: 14, status: 'scheduled' },
  { trainer: 0, client: 0, day: 14, startHour: 10.5, status: 'scheduled' },
  { trainer: 1, client: 1, day: 14, startHour: 15.5, status: 'completed' }
];

function createSession(id, trainerIndex, clientIndex, day, startHour, status) {
  const date = new Date(2025, 3, day); // April day, 2025
  const startTime = new Date(date);
  const hours = Math.floor(startHour);
  const minutes = (startHour - hours) * 60;
  startTime.setHours(hours, minutes, 0);
  const endTime = new Date(startTime);
  endTime.setHours(hours + 1, minutes, 0);

  return {
    _id: `session${id}`,
    trainerId: trainerIds[trainerIndex],
    clientId: clientIds[clientIndex],
    date: date,
    startTime: startTime,
    endTime: endTime,
    roomId: `room${id}`,
    status: status,
    createdAt: new Date(2025, 3, 1), // April 1, 2025
    updatedAt: new Date(2025, 3, 1)
  };
}

const mockSessions = sessionDetails.map((detail, index) =>
  createSession(index + 1, detail.trainer, detail.client, detail.day, detail.startHour, detail.status)
);

export default mockSessions;
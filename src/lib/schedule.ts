/**
 * Static scheduling data for Design 2.
 *
 * This feature presents designed states over fixed data — there is no backend
 * (non-goal of both this feature and the one before it). Every number shown in
 * the availability and attendance screens is computed from these structures so
 * the screens cannot contradict each other.
 */

export const HOUR_START = 7;
export const HOUR_END = 23;
/** DESIGN.md §Layout: the week grid uses 56px rows for one hour. */
export const HOUR_PX = 56;

export type Level = "Principiante" | "Intermedio" | "Avanzado";

export interface WeekDay {
  index: number;
  short: string;
  long: string;
  /** Day of month in October 2026. */
  date: number;
}

/** The reference week, 12–18 October 2026, matching every exported screen. */
export const WEEK: WeekDay[] = [
  { index: 0, short: "L", long: "lunes", date: 12 },
  { index: 1, short: "M", long: "martes", date: 13 },
  { index: 2, short: "X", long: "miércoles", date: 14 },
  { index: 3, short: "J", long: "jueves", date: 15 },
  { index: 4, short: "V", long: "viernes", date: 16 },
  { index: 5, short: "S", long: "sábado", date: 17 },
  { index: 6, short: "D", long: "domingo", date: 18 },
];

export interface Room {
  id: string;
  name: string;
}

export const ROOMS: Room[] = [
  { id: "s1", name: "Sala 1" },
  { id: "s2", name: "Sala 2" },
  { id: "s3", name: "Sala 3" },
];

export interface Teacher {
  id: string;
  name: string;
}

export const TEACHERS: Teacher[] = [
  { id: "t1", name: "Marcos Delgado" },
  { id: "t2", name: "Carla Ibáñez" },
  { id: "t3", name: "Rubén Salas" },
];

export interface ScheduledClass {
  id: string;
  title: string;
  style: string;
  level: Level;
  /** null means the class has no teacher assigned yet. */
  teacherId: string | null;
  roomId: string;
  /** 0 = lunes … 6 = domingo. */
  day: number;
  /** "19:30" — local studio time, 24h clock. */
  start: string;
  durationMin: number;
  capacity: number;
  booked: number;
  price: string;
  credits: number;
  description: string;
}

export const CLASSES: ScheduledClass[] = [
  // Lunes 12
  mk("c-l1", "Salsa Iniciación", "Salsa en línea", "Principiante", "t2", "s2", 0, "11:00", 90, 14, 8, "15,00 €", 1, "Primeros pasos: ritmo, paso básico y giras sencillas."),
  mk("c-l2", "Bachata Iniciación", "Bachata", "Principiante", "t3", "s3", 0, "18:00", 60, 12, 7, "15,00 €", 1, "Introducción a la bachata moderna y al trabajo de pareja."),
  mk("c-l3", "Salsa Intermedio", "Salsa en línea", "Intermedio", "t2", "s1", 0, "19:30", 90, 16, 12, "15,00 €", 1, "Giros en línea, timing y combinaciones de dos tiempos."),
  mk("c-l4", "Salsa Avanzado", "Salsa en línea", "Avanzado", "t3", "s1", 0, "21:00", 90, 10, 5, "15,00 €", 1, "Nivel técnico alto: turnos, spins y musicalidad."),
  // Martes 13 — c-m2 is the reference class used across the designs
  mk("c-m1", "Salsa Cubana", "Salsa cubana", "Principiante", "t2", "s2", 1, "17:00", 60, 14, 9, "15,00 €", 1, "Rueda cubana básica y liderazgo básico."),
  mk("c-m2", "Salsa Intermedio", "Salsa en línea", "Intermedio", "t1", "s1", 1, "19:30", 90, 16, 12, "15,00 €", 1, "Giros en línea, timing y combinaciones de dos tiempos."),
  mk("c-m3", "Bachata Intermedio", "Bachata", "Intermedio", "t3", "s3", 1, "21:00", 60, 12, 10, "15,00 €", 1, "Body movement y variaciones de pie."),
  // Miércoles 14
  mk("c-x1", "Salsa Iniciación", "Salsa en línea", "Principiante", "t2", "s2", 2, "18:00", 60, 14, 11, "15,00 €", 1, "Primeros pasos: ritmo, paso básico y giras sencillas."),
  mk("c-x2", "Salsa Avanzado", "Salsa en línea", "Avanzado", "t1", "s1", 2, "20:00", 120, 10, 6, "15,00 €", 1, "Sesión larga de trabajo técnico y coreografía."),
  // Jueves 15
  mk("c-j1", "Bachata Iniciación", "Bachata", "Principiante", "t3", "s3", 3, "17:00", 60, 12, 4, "15,00 €", 1, "Introducción a la bachata moderna."),
  mk("c-j2", "Salsa Intermedio", "Salsa en línea", "Intermedio", "t2", "s1", 3, "19:30", 90, 16, 14, "15,00 €", 1, "Giros en línea y combinaciones de dos tiempos."),
  mk("c-j3", "Salsa Cubana", "Salsa cubana", "Principiante", null, "s2", 3, "20:00", 60, 14, 5, "15,00 €", 1, "Rueda cubana básica. Pendiente de asignar profesor."),
  // Viernes 16
  mk("c-v1", "Salsa Cubana", "Salsa cubana", "Principiante", "t2", "s2", 4, "18:00", 60, 14, 12, "15,00 €", 1, "Rueda cubana y pasos de vuelta."),
  mk("c-v2", "Salsa Intermedio", "Salsa en línea", "Intermedio", "t1", "s1", 4, "19:30", 90, 16, 16, "15,00 €", 1, "Giros en línea, timing y combinaciones de dos tiempos."),
  mk("c-v3", "Bachata Intermedio", "Bachata", "Intermedio", "t3", "s3", 4, "21:00", 60, 12, 5, "15,00 €", 1, "Body movement y variaciones de pie."),
  // Sábado 17 — c-s3 and c-s4 share Sala 1 at 18:00: the designed room conflict
  mk("c-s1", "Salsa Iniciación", "Salsa en línea", "Principiante", "t1", "s2", 5, "11:00", 90, 14, 10, "15,00 €", 1, "Primeros pasos: ritmo, paso básico y giras sencillas."),
  mk("c-s2", "Bachata Iniciación", "Bachata", "Principiante", "t3", "s3", 5, "12:30", 60, 12, 6, "15,00 €", 1, "Introducción a la bachata moderna."),
  mk("c-s3", "Salsa Intermedio", "Salsa en línea", "Intermedio", "t2", "s1", 5, "18:00", 60, 16, 8, "15,00 €", 1, "Giros en línea y combinaciones."),
  mk("c-s4", "Salsa Cubana", "Salsa cubana", "Intermedio", "t3", "s1", 5, "18:00", 90, 16, 4, "15,00 €", 1, "Rueda cubana avanzada. Ocupa la Sala 1 junto a la clase anterior."),
];

function mk(
  id: string,
  title: string,
  style: string,
  level: Level,
  teacherId: string | null,
  roomId: string,
  day: number,
  start: string,
  durationMin: number,
  capacity: number,
  booked: number,
  price: string,
  credits: number,
  description: string,
): ScheduledClass {
  return { id, title, style, level, teacherId, roomId, day, start, durationMin, capacity, booked, price, credits, description };
}

/** Weekly availability windows, keyed by teacher, 0 = lunes … 6 = domingo. */
export interface AvailabilityWindow {
  day: number;
  start: string;
  end: string;
}

export const AVAILABILITY: Record<string, AvailabilityWindow[]> = {
  // Totals 32 h: six hours each weekday plus two on Saturday, Sunday closed.
  t1: [
    { day: 0, start: "17:00", end: "23:00" },
    { day: 1, start: "17:00", end: "23:00" },
    { day: 2, start: "17:00", end: "23:00" },
    { day: 3, start: "17:00", end: "23:00" },
    { day: 4, start: "17:00", end: "23:00" },
    { day: 5, start: "11:00", end: "13:00" },
  ],
  t2: [
    { day: 0, start: "10:00", end: "14:00" },
    { day: 0, start: "18:00", end: "22:00" },
    { day: 1, start: "16:00", end: "22:00" },
    { day: 2, start: "17:00", end: "21:00" },
    { day: 3, start: "17:00", end: "23:00" },
    { day: 4, start: "16:00", end: "22:00" },
    { day: 5, start: "17:00", end: "21:00" },
  ],
  t3: [
    { day: 0, start: "17:00", end: "23:00" },
    { day: 1, start: "20:00", end: "23:00" },
    { day: 3, start: "16:00", end: "22:00" },
    { day: 4, start: "20:00", end: "23:00" },
    { day: 5, start: "11:00", end: "15:00" },
  ],
};

/** Dates the studio is closed, shown as exceptions in the availability editor. */
export const BLACKOUT_DATES = [
  { date: "01/11/2026", reason: "Festivo" },
  { date: "24/12/2026", reason: "Cierre" },
];

/* ------------------------------------------------------------------ roster */

export type Attendance = "present" | "late" | "absent" | "unmarked";

export interface RosterEntry {
  name: string;
  email: string;
  kind: "Bono" | "Suelta";
  payment: "paid" | "pending";
  attendance: Attendance;
}

export const ROSTER: RosterEntry[] = [
  ro("Lucía Moreno", "lucia.moreno@example.com", "Bono", "paid", "present"),
  ro("Javier Ruiz", "javier.ruiz@example.com", "Suelta", "paid", "present"),
  ro("Ana Prieto", "ana.prieto@example.com", "Bono", "paid", "present"),
  ro("Marta Sanz", "marta.sanz@example.com", "Bono", "paid", "present"),
  ro("Diego Ferrer", "diego.ferrer@example.com", "Bono", "paid", "late"),
  ro("Paula Ortega", "paula.ortega@example.com", "Suelta", "pending", "present"),
  ro("Hugo Cabrera", "hugo.cabrera@example.com", "Bono", "paid", "present"),
  ro("Nerea Vidal", "nerea.vidal@example.com", "Bono", "paid", "present"),
  ro("Sergio Lozano", "sergio.lozano@example.com", "Bono", "paid", "present"),
  ro("Clara Molina", "clara.molina@example.com", "Suelta", "paid", "absent"),
  ro("Iván Pastor", "ivan.pastor@example.com", "Bono", "paid", "present"),
  ro("Rocío Navarro", "rocio.navarro@example.com", "Bono", "pending", "unmarked"),
];

function ro(
  name: string,
  email: string,
  kind: "Bono" | "Suelta",
  payment: "paid" | "pending",
  attendance: Attendance,
): RosterEntry {
  return { name, email, kind, payment, attendance };
}

/* --------------------------------------------------- the student's bookings */

export interface BookingRow {
  classId: string;
  /** Grouping heading for the upcoming list. */
  group: "Esta semana" | "Próxima semana";
  status: "confirmed" | "waitlist";
  dayLabel: string;
}

export const UPCOMING_BOOKINGS: BookingRow[] = [
  { classId: "c-m2", group: "Esta semana", status: "confirmed", dayLabel: "Mar 13" },
  { classId: "c-x1", group: "Esta semana", status: "confirmed", dayLabel: "Mié 14" },
  { classId: "c-v2", group: "Próxima semana", status: "waitlist", dayLabel: "Lun 19" },
];

export interface PastBooking {
  date: string;
  title: string;
  attendance: Attendance;
}

export const PAST_BOOKINGS: PastBooking[] = [
  { date: "10/10/2026", title: "Salsa Intermedio", attendance: "present" },
  { date: "08/10/2026", title: "Salsa Cubana", attendance: "late" },
  { date: "06/10/2026", title: "Bachata Iniciación", attendance: "absent" },
  { date: "03/10/2026", title: "Salsa Intermedio", attendance: "present" },
];

/* ------------------------------------------------------------------ helpers */

export function minutesOf(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

export function formatMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Spanish decimal notation: 90 -> "1,5 h", 60 -> "1 h", 120 -> "2 h". */
export function durationLabel(minutes: number): string {
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1).replace(".", ",")} h`;
}

export function classesForDay(day: number): ScheduledClass[] {
  return CLASSES.filter((entry) => entry.day === day).sort(
    (a, b) => minutesOf(a.start) - minutesOf(b.start),
  );
}

export function classesForTeacher(teacherId: string): ScheduledClass[] {
  return CLASSES.filter((entry) => entry.teacherId === teacherId);
}

export function findClass(id: string | null | undefined): ScheduledClass | undefined {
  if (!id) return undefined;
  return CLASSES.find((entry) => entry.id === id);
}

export function teacherName(teacherId: string | null): string {
  if (!teacherId) return "Sin asignar";
  return TEACHERS.find((teacher) => teacher.id === teacherId)?.name ?? "Sin asignar";
}

export function roomName(roomId: string): string {
  return ROOMS.find((room) => room.id === roomId)?.name ?? roomId;
}

export function hoursOf(windows: AvailabilityWindow[]): number {
  return windows.reduce(
    (total, window) => total + (minutesOf(window.end) - minutesOf(window.start)) / 60,
    0,
  );
}

export function formatHours(hours: number): string {
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1).replace(".", ",")} h`;
}

/* --------------------------------------------------- calendar grid support */

export const YEAR = 2026;
export const MONTH = 9; // octubre, 0-based like Date
/** The reference "today": martes 13 October 2026, the focus day of every design. */
export const TODAY = 13;
/** Time shown by the week grid's current-time line. */
export const NOW = "18:20";

const DAYS_IN_MONTH = new Date(YEAR, MONTH + 1, 0).getDate();

/** Weekday index, 0 = lunes, for a day of October 2026. */
export function weekdayIndexOf(date: number): number {
  return (new Date(YEAR, MONTH, date).getDay() + 6) % 7;
}

export interface MonthCell {
  date: number;
  /** False for the trailing September days and leading November day in the grid. */
  inMonth: boolean;
}

/**
 * Monday-first month grid as weeks of cells. Out-of-month cells keep their date
 * number so the grid reads as a real calendar; they carry no classes.
 */
export function monthGrid(): MonthCell[][] {
  const leading = weekdayIndexOf(1);
  const cells: MonthCell[] = [];
  const previousMonthDays = new Date(YEAR, MONTH, 0).getDate();
  for (let i = leading - 1; i >= 0; i--) {
    cells.push({ date: previousMonthDays - i, inMonth: false });
  }
  for (let date = 1; date <= DAYS_IN_MONTH; date++) {
    cells.push({ date, inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ date: cells.length - (leading + DAYS_IN_MONTH) + 1, inMonth: false });
  }
  const weeks: MonthCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/**
 * Classes shown on one day of October. The reference week (12–18) returns the
 * canonical records so every id in bookings, roster and attention links
 * resolves; other weeks reuse that week's programme, which is what a studio
 * running a fixed weekly timetable would show, with a deterministic occupancy
 * variation so the month does not look cloned.
 */
export function classesForDate(date: number): ScheduledClass[] {
  const base = classesForDay(weekdayIndexOf(date));
  if (date >= 12 && date <= 18) return base;
  return base.map((entry, index) => {
    const variation = ((date * 7919 + index * 104729) % 5) - 2;
    return {
      ...entry,
      id: `${entry.id}-${date}`,
      booked: Math.min(entry.capacity, Math.max(0, entry.booked + variation)),
    };
  });
}

/**
 * The three designed problems, derived rather than hard-coded so the attention
 * list can never drift from the calendar it describes.
 */
export function unassignedClasses(): ScheduledClass[] {
  return CLASSES.filter((entry) => entry.teacherId === null);
}

/** Overlapping classes sharing one room on the same day. */
export function roomConflicts(): Array<{ room: ScheduledClass; clash: ScheduledClass }> {
  const found: Array<{ room: ScheduledClass; clash: ScheduledClass }> = [];
  for (const entry of CLASSES) {
    const start = minutesOf(entry.start);
    const end = start + entry.durationMin;
    for (const other of CLASSES) {
      if (other.id <= entry.id || other.day !== entry.day || other.roomId !== entry.roomId) continue;
      const otherStart = minutesOf(other.start);
      const otherEnd = otherStart + other.durationMin;
      if (start < otherEnd && otherStart < end) found.push({ room: entry, clash: other });
    }
  }
  return found;
}

/** LEVEL_STYLE maps a level onto the implementation tokens in globals.css. */
export const LEVEL_STYLE: Record<
  Level,
  { bar: string; fill: string; text: string; border: string; edge: string }
> = {
  Principiante: {
    bar: "bg-level-beginner",
    fill: "bg-level-beginner-container",
    text: "text-on-level-beginner",
    border: "border-level-beginner",
    edge: "border-l-level-beginner",
  },
  Intermedio: {
    bar: "bg-level-intermediate",
    fill: "bg-level-intermediate-container",
    text: "text-on-level-intermediate",
    border: "border-level-intermediate",
    edge: "border-l-level-intermediate",
  },
  Avanzado: {
    bar: "bg-level-advanced",
    fill: "bg-level-advanced-container",
    text: "text-on-level-advanced",
    border: "border-level-advanced",
    edge: "border-l-level-advanced",
  },
};

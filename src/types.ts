export interface PlotRecord {
  id: string; // Plot ID e.g. "W1-P1"
  replication: string; // "ซ้ำที่ 1", "ซ้ำที่ 2", "ซ้ำที่ 3"
  cornVarieties: string[]; // e.g. ["PAC789", "CP S8"]
  irrigationSystem: string; // e.g. "W1: ระบบเปียกสลับแห้ง (AWD)"
  moisture: number; // e.g. 24
  temperature: number; // e.g. 28.5
  landPrep: string; // textarea
  initialWater: number; // liters
  fertilizer: string; // e.g. "15-15-15 อัตรา 50 กก./ไร่"
  createdAt: string; // ISO String
  createdBy: string; // user UID
  createdByName?: string; // name
}

export interface LoginLog {
  id: string;
  username: string;
  email: string;
  status: string; // "success" | "failed"
  timestamp: string; // ISO string
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  status: "เสร็จสิ้น" | "กำลังดำเนินการ" | "รอดำเนินการ";
  timestamp: string;
}

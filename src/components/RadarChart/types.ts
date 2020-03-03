export type RadarPoint = {
  label: string;
  score: number;
};

export type RadarData = {
  groupName: string;
  scores: RadarPoint[];
};

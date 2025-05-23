export interface HoleData {
  yards: number;
  par: number;
  index: number;
}

export interface ScoreData {
  score: number;
  putts: number;
  sandie: boolean;
  upDown: boolean;
  penalty: number;
  fairwayHit?: boolean; 
  greenInRegulation?: boolean;
}

export interface PlayerStats {
  totalScore: number;
  totalOver: number;
  fairwaysHit: number;
  greensInRegulation: number;
  upAndDowns: number;
  sandSaves: number;
  totalPutts: number;
  totalHolesPlayed: number;
}